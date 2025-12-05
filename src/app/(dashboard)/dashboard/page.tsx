// ============================================================================
// DASHBOARD HOME PAGE
// ============================================================================
// Main dashboard view showing user stats and quick actions.
//
// CUSTOMIZATION:
// Replace the placeholder cards with your actual application metrics.
// ============================================================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { PLANS } from "@/lib/stripe";
import {
  Activity,
  CreditCard,
  Users,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Get user with subscription info
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
    select: {
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  // Determine current plan
  const currentPlan = user?.stripePriceId
    ? Object.entries(PLANS).find(([_, plan]) => plan.priceId === user.stripePriceId)?.[0] || "free"
    : "free";

  const isSubscribed = user?.stripeCurrentPeriodEnd
    ? user.stripeCurrentPeriodEnd > new Date()
    : false;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Welcome back, {session?.user?.name || "there"}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{currentPlan}</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isSubscribed ? "Active subscription" : "Free tier"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Activity className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Create your first project
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Zap className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Just you for now
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/projects/new" className="block">
              <Button className="w-full justify-between" variant="outline">
                Create New Project
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/settings" className="block">
              <Button className="w-full justify-between" variant="outline">
                Update Profile
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/billing" className="block">
              <Button className="w-full justify-between" variant="outline">
                {isSubscribed ? "Manage Subscription" : "Upgrade Plan"}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to get the most out of your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                  ✓
                </div>
                <span className="ml-3 text-sm">Create your account</span>
              </div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  2
                </div>
                <span className="ml-3 text-sm text-zinc-500">
                  Create your first project
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  3
                </div>
                <span className="ml-3 text-sm text-zinc-500">
                  Invite team members
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  4
                </div>
                <span className="ml-3 text-sm text-zinc-500">
                  Connect your first integration
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
