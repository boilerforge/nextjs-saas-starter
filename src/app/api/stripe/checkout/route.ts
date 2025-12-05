// ============================================================================
// STRIPE CHECKOUT SESSION API ROUTE
// ============================================================================
// POST /api/stripe/checkout - Create a Stripe Checkout Session
//
// This endpoint creates a checkout session for subscription purchases.
// Users are redirected to Stripe's hosted checkout page, then back to
// your app upon completion.
//
// FLOW:
// 1. User clicks "Subscribe" button
// 2. Frontend calls this endpoint with priceId
// 3. Backend creates Stripe checkout session
// 4. Frontend redirects user to Stripe checkout URL
// 5. After payment, Stripe redirects to success/cancel URL
// 6. Stripe webhook updates user subscription status
// ============================================================================

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Require authentication
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to subscribe" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let stripeCustomerId = user.stripeCustomerId;

    const stripe = getStripe();

    // Create Stripe customer if doesn't exist
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      // Save customer ID to database
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Check if user already has an active subscription
    if (user.stripeSubscriptionId) {
      // Redirect to billing portal to manage existing subscription
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: absoluteUrl("/dashboard/settings"),
      });

      return NextResponse.json({ url: portalSession.url });
    }

    // Create checkout session for new subscription
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: absoluteUrl("/dashboard?success=true"),
      cancel_url: absoluteUrl("/pricing?canceled=true"),
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "An error occurred creating checkout session" },
      { status: 500 }
    );
  }
}
