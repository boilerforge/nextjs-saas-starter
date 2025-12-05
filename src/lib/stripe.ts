// ============================================================================
// STRIPE CONFIGURATION
// ============================================================================
// This file sets up Stripe for payment processing.
//
// STRIPE SETUP CHECKLIST:
// 1. Create account at https://stripe.com
// 2. Get API keys from Dashboard > Developers > API keys
// 3. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env
// 4. For webhooks: Add STRIPE_WEBHOOK_SECRET (get from webhook endpoint)
//
// WHY STRIPE:
// - Industry standard for SaaS payments
// - Excellent developer experience
// - Built-in subscription management
// - Handles tax calculation, invoices, and compliance
// ============================================================================

import Stripe from "stripe";

// Lazy-loaded Stripe instance to avoid initialization errors when
// environment variables aren't available at build time
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-11-17.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Convenience export for backward compatibility
// WHY: Use getStripe() in API routes instead of this direct export
export const stripe = {
  get instance() {
    return getStripe();
  },
};

// ============================================================================
// PRICING CONFIGURATION
// ============================================================================
// Define your pricing plans here. Update these to match your Stripe products.
//
// HOW TO SET UP IN STRIPE:
// 1. Dashboard > Products > Add product
// 2. Add a recurring price (monthly or yearly)
// 3. Copy the Price ID (starts with "price_")
// 4. Replace the IDs below

// NOTE: Price IDs are loaded at runtime. Ensure STRIPE_PRO_PRICE_ID and
// STRIPE_ENTERPRISE_PRICE_ID are set in your .env file before enabling
// paid subscriptions. Empty priceIds will cause checkout to fail gracefully.

export function getPlan(key: "free" | "pro" | "enterprise") {
  const plans = {
    free: {
      name: "Free",
      description: "Perfect for trying out the platform",
      price: 0,
      priceId: "", // No Stripe price for free tier
      features: [
        "Up to 3 projects",
        "Basic analytics",
        "Community support",
      ],
    },
    pro: {
      name: "Pro",
      description: "For professionals and growing teams",
      price: 1900, // $19.00 in cents
      priceId: process.env.STRIPE_PRO_PRICE_ID || "",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Custom domains",
        "API access",
      ],
    },
    enterprise: {
      name: "Enterprise",
      description: "For large organizations",
      price: 4900, // $49.00 in cents
      priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "SLA guarantee",
        "Custom integrations",
        "Audit logs",
        "SSO/SAML",
      ],
    },
  };
  return plans[key];
}

// Static PLANS object for components that need all plans
// (priceIds may be empty if env vars not set)
export const PLANS = {
  free: {
    name: "Free",
    description: "Perfect for trying out the platform",
    price: 0,
    priceId: "",
    features: [
      "Up to 3 projects",
      "Basic analytics",
      "Community support",
    ],
  },
  pro: {
    name: "Pro",
    description: "For professionals and growing teams",
    price: 1900,
    priceId: "", // Set via STRIPE_PRO_PRICE_ID
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Custom domains",
      "API access",
    ],
  },
  enterprise: {
    name: "Enterprise",
    description: "For large organizations",
    price: 4900,
    priceId: "", // Set via STRIPE_ENTERPRISE_PRICE_ID
    features: [
      "Everything in Pro",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "Audit logs",
      "SSO/SAML",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
