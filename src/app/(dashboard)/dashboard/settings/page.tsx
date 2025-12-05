// ============================================================================
// SETTINGS PAGE
// ============================================================================
// User account settings and profile management.
// NOTE: Profile editing functionality is a placeholder for you to implement.
// ============================================================================

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
                <User className="h-8 w-8 text-zinc-500" />
              </div>
            )}
            <div>
              <p className="font-medium">{session?.user?.name || "User"}</p>
              <p className="text-sm text-zinc-500">{session?.user?.email}</p>
            </div>
          </div>

          {/* Info about editing */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <strong>Developer Note:</strong> Profile editing, password changes,
              and account deletion can be implemented by adding server actions or
              API routes. See the{" "}
              <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
                /api/auth/register
              </code>{" "}
              route for an example pattern.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Manage your subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Visit the{" "}
            <a
              href="/dashboard/billing"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Billing page
            </a>{" "}
            to manage your subscription, update payment methods, or view invoices.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
