// ============================================================================
// STRIPE WEBHOOK HANDLER
// ============================================================================
// POST /api/stripe/webhook - Handle Stripe webhook events
//
// This endpoint receives events from Stripe and updates your database
// accordingly. It's the ONLY reliable way to know when payments succeed,
// subscriptions change, or payments fail.
//
// SETUP:
// 1. Go to Stripe Dashboard > Developers > Webhooks
// 2. Add endpoint: https://yourdomain.com/api/stripe/webhook
// 3. Select events: checkout.session.completed, customer.subscription.*
// 4. Copy signing secret to STRIPE_WEBHOOK_SECRET in .env
//
// WHY WEBHOOKS:
// - User might close browser after payment
// - Payment might fail after initial success
// - Subscription renewals happen automatically
// - Only way to handle all edge cases reliably
// ============================================================================

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  // SECURITY: Validate webhook secret is configured
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      // ======================================================================
      // CHECKOUT COMPLETED
      // ======================================================================
      // Fired when a checkout session is successfully completed.
      // This is where you provision access to your product.
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Get subscription details
        if (session.subscription && session.customer) {
          const subscriptionResponse = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          // Type assertion for subscription data
          const subscription = subscriptionResponse as unknown as {
            id: string;
            items: { data: Array<{ price: { id: string } }> };
            current_period_end: number;
          };

          // Update user with subscription info
          await prisma.user.update({
            where: {
              stripeCustomerId: session.customer as string,
            },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          });
        }
        break;
      }

      // ======================================================================
      // SUBSCRIPTION UPDATED
      // ======================================================================
      // Fired when subscription is updated (plan change, renewal, etc.)
      case "customer.subscription.updated": {
        const subscriptionData = event.data.object as unknown as {
          id: string;
          items: { data: Array<{ price: { id: string } }> };
          current_period_end: number;
        };

        await prisma.user.update({
          where: {
            stripeSubscriptionId: subscriptionData.id,
          },
          data: {
            stripePriceId: subscriptionData.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscriptionData.current_period_end * 1000
            ),
          },
        });
        break;
      }

      // ======================================================================
      // SUBSCRIPTION DELETED/CANCELED
      // ======================================================================
      // Fired when subscription is canceled or expires.
      // Revoke access to premium features here.
      case "customer.subscription.deleted": {
        const deletedSubscription = event.data.object as unknown as { id: string };

        await prisma.user.update({
          where: {
            stripeSubscriptionId: deletedSubscription.id,
          },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        break;
      }

      default:
        // Unhandled event type - log for debugging
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
