// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
// Common utilities used throughout the application.
// ============================================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS conflict resolution.
 *
 * WHY THIS FUNCTION:
 * When combining Tailwind classes dynamically, conflicts can occur
 * (e.g., "px-2" and "px-4"). twMerge intelligently resolves these,
 * keeping only the last conflicting class. clsx handles conditional
 * class names cleanly.
 *
 * @example
 * cn("px-2 py-1", isLarge && "px-4", className)
 * // With isLarge=true: "py-1 px-4" (px-2 is removed)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price in cents to a display string.
 *
 * WHY CENTS:
 * Stripe and most payment processors work in cents to avoid
 * floating-point precision issues. Always store prices as integers.
 *
 * @example
 * formatPrice(4999) // "$49.99"
 * formatPrice(4999, "EUR") // "€49.99"
 */
export function formatPrice(
  priceInCents: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceInCents / 100);
}

/**
 * Returns the absolute URL for a given path.
 * Useful for generating URLs in emails, webhooks, and meta tags.
 */
export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
