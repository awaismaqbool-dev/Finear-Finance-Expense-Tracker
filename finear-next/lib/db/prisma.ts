import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL must be configured.");

  const parsedUrl = new URL(databaseUrl);
  if (parsedUrl.protocol !== "mysql:" && parsedUrl.protocol !== "mariadb:") {
    throw new Error("DATABASE_URL must use the mysql:// or mariadb:// protocol.");
  }

  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST || parsedUrl.hostname,
    port: Number(process.env.DATABASE_PORT || parsedUrl.port || 3306),
    user: process.env.DATABASE_USER || decodeURIComponent(parsedUrl.username),
    password: process.env.DATABASE_PASSWORD || decodeURIComponent(parsedUrl.password),
    database: process.env.DATABASE_NAME || decodeURIComponent(parsedUrl.pathname.replace(/^\//, "")),
    // The previous hard-coded pool of 5 was too small. Keep the pool reusable
    // across requests and allow the limit to be tuned for the database host.
    connectionLimit: Number(process.env.DATABASE_POOL_SIZE || 20),
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Reuse one client/pool for every API request in this Node.js process,
// including Next.js dev hot reloads and production module reloads.
globalForPrisma.prisma = prisma;
