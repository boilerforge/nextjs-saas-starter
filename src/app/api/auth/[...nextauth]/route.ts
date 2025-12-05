// ============================================================================
// NEXTAUTH API ROUTE
// ============================================================================
// This catch-all route handles all NextAuth.js authentication endpoints:
// - GET /api/auth/signin - Sign in page
// - POST /api/auth/signin/* - Sign in with provider
// - GET /api/auth/signout - Sign out
// - GET /api/auth/session - Get current session
// - GET /api/auth/providers - List available providers
// ============================================================================

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
