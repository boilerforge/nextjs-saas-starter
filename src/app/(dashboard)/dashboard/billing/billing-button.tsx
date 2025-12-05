// ============================================================================
// BILLING BUTTON COMPONENT
// ============================================================================
// Client component that handles Stripe checkout and billing portal redirects.
// ============================================================================

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BillingButtonProps {
  children: React.ReactNode;
  action: "checkout" | "manage";
  priceId?: string;
}

export function BillingButton({ children, action, priceId }: BillingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Billing error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="w-full"
      variant={action === "manage" ? "outline" : "default"}
    >
      {isLoading ? "Loading..." : children}
    </Button>
  );
}
