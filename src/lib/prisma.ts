// ============================================================================
// PRISMA CLIENT SINGLETON
// ============================================================================
// This file ensures we don't create multiple Prisma Client instances during
// development (hot reloading would otherwise create new instances each time).
//
// WHY THIS PATTERN:
// In development, Next.js clears the Node.js cache on every file change.
// Without this singleton pattern, each reload creates a new PrismaClient,
// eventually exhausting database connections.
// ============================================================================

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
