// ============================================================================
// DASHBOARD LAYOUT
// ============================================================================
// Shared layout for all dashboard pages. Includes sidebar navigation
// and authentication check.
//
// WHY A LAYOUT:
// - Consistent UI across all dashboard routes
// - Auth check happens once at layout level
// - Navigation state persists between page transitions
// ============================================================================

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Zap,
  LayoutDashboard,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import { UserNav } from "@/components/layout/user-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protect all dashboard routes
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* ================================================================== */}
      {/* SIDEBAR */}
      {/* ================================================================== */}
      <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:flex">
        <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6" />
            <span className="font-bold text-xl">YourSaaS</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/billing">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <form action="/api/auth/signout" method="POST">
            <Button variant="ghost" className="w-full justify-start" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* ================================================================== */}
      {/* MAIN CONTENT */}
      {/* ================================================================== */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6" />
              <span className="font-bold">YourSaaS</span>
            </Link>
          </div>
          <div className="ml-auto">
            <UserNav user={session.user} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 bg-zinc-50 p-6 dark:bg-zinc-900">
          {children}
        </main>
      </div>
    </div>
  );
}
