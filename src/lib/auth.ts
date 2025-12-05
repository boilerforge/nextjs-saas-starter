// ============================================================================
// NEXTAUTH.JS CONFIGURATION
// ============================================================================
// This file configures authentication for your SaaS application.
//
// SUPPORTED AUTH METHODS (out of the box):
// 1. Email/Password (credentials provider)
// 2. Google OAuth
// 3. GitHub OAuth
//
// TO ADD MORE PROVIDERS:
// See https://next-auth.js.org/providers for the full list.
// Simply add the provider to the `providers` array below.
// ============================================================================

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Use Prisma adapter to persist users/sessions in your database
  adapter: PrismaAdapter(prisma),

  // Configure session strategy
  // WHY JWT: More scalable than database sessions, works better with
  // serverless deployments (no database lookup on every request)
  session: {
    strategy: "jwt",
  },

  // Define authentication pages (these are custom routes you control)
  pages: {
    signIn: "/login",
    // signUp: "/register", // Uncomment if using separate registration page
  },

  // Configure authentication providers
  providers: [
    // ========================================================================
    // EMAIL/PASSWORD AUTHENTICATION
    // ========================================================================
    // Enable this for traditional email/password login.
    // Users must register first (see /api/auth/register route).
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),

    // ========================================================================
    // GOOGLE OAUTH
    // ========================================================================
    // To enable:
    // 1. Go to https://console.cloud.google.com/apis/credentials
    // 2. Create OAuth 2.0 credentials
    // 3. Set authorized redirect URI to: {YOUR_DOMAIN}/api/auth/callback/google
    // 4. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // ========================================================================
    // GITHUB OAUTH
    // ========================================================================
    // To enable:
    // 1. Go to https://github.com/settings/developers
    // 2. Create a new OAuth App
    // 3. Set Authorization callback URL to: {YOUR_DOMAIN}/api/auth/callback/github
    // 4. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],

  // ========================================================================
  // CALLBACKS
  // ========================================================================
  // Customize the JWT and session objects
  callbacks: {
    // Add user ID to the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Add user ID to the session object (accessible via useSession())
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
