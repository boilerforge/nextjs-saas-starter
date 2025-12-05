// ============================================================================
// LANDING PAGE
// ============================================================================
// The main marketing page for your SaaS. This is what visitors see first.
//
// CUSTOMIZATION TIPS:
// 1. Update the hero section with your value proposition
// 2. Replace feature descriptions with your actual features
// 3. Adjust pricing tiers to match your Stripe products
// 4. Add testimonials once you have customers
// ============================================================================

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLANS } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Code,
  Rocket,
  Check,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ================================================================== */}
      {/* NAVIGATION */}
      {/* ================================================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6" />
            <span className="font-bold text-xl">YourSaaS</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="#features"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ================================================================ */}
        {/* HERO SECTION */}
        {/* ================================================================ */}
        <section className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Build your next big idea{" "}
              <span className="text-zinc-500">faster than ever</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
              The complete SaaS starter kit with authentication, payments, and
              everything you need to launch your product in days, not months.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <Rocket className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* FEATURES SECTION */}
        {/* ================================================================ */}
        <section id="features" className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to launch
              </h2>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Stop reinventing the wheel. Start with a solid foundation.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Shield,
                  title: "Authentication",
                  description:
                    "Secure login with email/password, Google, and GitHub. Session management built-in.",
                },
                {
                  icon: BarChart3,
                  title: "Stripe Payments",
                  description:
                    "Subscriptions, one-time payments, and billing portal. Webhooks pre-configured.",
                },
                {
                  icon: Users,
                  title: "User Management",
                  description:
                    "User profiles, settings, and admin dashboard. CRUD operations ready.",
                },
                {
                  icon: Code,
                  title: "TypeScript First",
                  description:
                    "Full type safety from database to frontend. Catch errors before they happen.",
                },
                {
                  icon: Zap,
                  title: "Fast by Default",
                  description:
                    "Next.js App Router with server components. Optimized for Core Web Vitals.",
                },
                {
                  icon: Rocket,
                  title: "Deploy Anywhere",
                  description:
                    "Works with Vercel, Railway, Fly.io, or your own server. No vendor lock-in.",
                },
              ].map((feature) => (
                <Card key={feature.title} className="border-zinc-200 dark:border-zinc-800">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-zinc-900 dark:text-zinc-50" />
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* PRICING SECTION */}
        {/* ================================================================ */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Choose the plan that works for you. Upgrade or downgrade anytime.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
              {Object.entries(PLANS).map(([key, plan]) => (
                <Card
                  key={key}
                  className={`relative ${
                    key === "pro"
                      ? "border-zinc-900 shadow-lg dark:border-zinc-50"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  {key === "pro" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-50 dark:text-zinc-900">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        {plan.price === 0 ? "Free" : formatPrice(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-zinc-600 dark:text-zinc-400">
                          /month
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/register" className="w-full">
                      <Button
                        className="w-full"
                        variant={key === "pro" ? "default" : "outline"}
                      >
                        {plan.price === 0 ? "Get Started" : "Subscribe"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* CTA SECTION */}
        {/* ================================================================ */}
        <section className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
              Join thousands of developers who are building their SaaS products
              faster with our starter kit.
            </p>
            <div className="mt-10">
              <Link href="/register">
                <Button size="lg">
                  Start Building Today
                  <Rocket className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================================== */}
      {/* FOOTER */}
      {/* ==================================================================== */}
      <footer className="border-t border-zinc-200 py-12 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">YourSaaS</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} YourSaaS. All rights reserved.
            </p>
            <nav className="flex gap-4">
              <Link
                href="/privacy"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
