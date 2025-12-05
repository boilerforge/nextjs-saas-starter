// ============================================================================
// ENVIRONMENT VARIABLE VALIDATION
// ============================================================================
// This file validates that required environment variables are set.
// It provides early, clear errors instead of cryptic runtime failures.
//
// WHY THIS MATTERS:
// - Empty strings as defaults = silent failures in production
// - Catching misconfiguration at startup saves debugging time
// - Type-safe access to environment variables
// ============================================================================

/**
 * Required environment variables for the application to function.
 * The app will fail to start if these are missing.
 */
const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
] as const;

/**
 * Environment variables required for Stripe functionality.
 * These are only required if you're using Stripe payments.
 */
const stripeEnvVars = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
] as const;

/**
 * Validates that required environment variables are set.
 * Call this at application startup.
 */
export function validateEnv(): void {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((v) => `  - ${v}`).join("\n")}\n\nPlease check your .env file.`
    );
  }
}

/**
 * Validates Stripe environment variables.
 * Call this before using any Stripe functionality.
 */
export function validateStripeEnv(): void {
  const missing: string[] = [];

  for (const envVar of stripeEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing Stripe environment variables:\n${missing.map((v) => `  - ${v}`).join("\n")}\n\nStripe payments will not work until these are configured.`
    );
  }
}

/**
 * Type-safe environment variable access.
 * Throws if the variable is not set (use for required vars only).
 */
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

/**
 * Checks if Stripe is properly configured.
 */
export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

/**
 * Checks if a specific OAuth provider is configured.
 */
export function isOAuthConfigured(provider: "google" | "github"): boolean {
  if (provider === "google") {
    return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  }
  if (provider === "github") {
    return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
  }
  return false;
}
