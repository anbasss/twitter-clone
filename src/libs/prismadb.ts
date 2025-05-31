import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma client with production-ready configuration
const client = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = client;
}

// Ensure the client is properly connected
if (process.env.NODE_ENV === "production") {
  client.$connect().catch((err) => {
    console.error('Failed to connect to database:', err);
  });
}

export default client;
