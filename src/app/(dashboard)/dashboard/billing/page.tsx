// ============================================================================
// BILLING PAGE
// ============================================================================
// Subscription management and billing information.
// ============================================================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { PLANS, PlanKey } from "@/lib/stripe";
import { Check, CreditCard } from "lucide-react";
import { BillingButton } from "./billing-button";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  // Get user with subscription info
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
    select: {
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
      stripeSubscriptionId: true,
    },
  });

  // Determine current plan
  const currentPlanKey = user?.stripePriceId
    ? (Object.entries(PLANS).find(
        ([_, plan]) => plan.priceId === user.stripePriceId
      )?.[0] as PlanKey) || "free"
    : "free";

  const isSubscribed = user?.stripeCurrentPeriodEnd
    ? user.stripeCurrentPeriodEnd > new Date()
    : false;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You are currently on the{" "}
            <span className="font-medium capitalize">{currentPlanKey}</span> plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubscribed && user?.stripeCurrentPeriodEnd && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <CreditCard className="h-4 w-4" />
              <span>
                Your subscription renews on{" "}
                {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isSubscribed ? (
            <BillingButton action="manage">Manage Subscription</BillingButton>
          ) : (
            <p className="text-sm text-zinc-500">
              Upgrade to a paid plan to unlock more features
            </p>
          )}
        </CardFooter>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.entries(PLANS) as [PlanKey, (typeof PLANS)[PlanKey]][]).map(
            ([key, plan]) => (
              <Card
                key={key}
                className={
                  key === currentPlanKey
                    ? "border-zinc-900 dark:border-zinc-50"
                    : ""
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {key === currentPlanKey && (
                      <span className="rounded-full bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-50 dark:text-zinc-900">
                        Current
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? "Free" : formatPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-zinc-500">/month</span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {key === currentPlanKey ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : key === "free" ? (
                    <Button variant="outline" disabled className="w-full">
                      Free Forever
                    </Button>
                  ) : (
                    <BillingButton action="checkout" priceId={plan.priceId}>
                      {isSubscribed ? "Switch Plan" : "Subscribe"}
                    </BillingButton>
                  )}
                </CardFooter>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
