import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Create a more robust Prisma client initialization
let client: PrismaClient;

if (globalThis.prisma) {
  client = globalThis.prisma;
} else {
  // Initialize without datasources configuration to prevent build errors
  client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = client;
  }
}

// Connection validation (only at runtime, not build time)
if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
  client.$connect().catch((err) => {
    console.error('Failed to connect to database:', err);
  });
}

export default client;
