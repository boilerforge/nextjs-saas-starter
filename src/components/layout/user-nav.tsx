// ============================================================================
// USER NAVIGATION COMPONENT
// ============================================================================
// Displays user avatar and dropdown menu with account options.
// ============================================================================

"use client";

import { User } from "lucide-react";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="hidden text-right text-sm md:block">
        <p className="font-medium">{user.name || "User"}</p>
        <p className="text-zinc-500 dark:text-zinc-400">{user.email}</p>
      </div>
      <div className="relative">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User avatar"}
            className="h-9 w-9 rounded-full"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
            <User className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}
