import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Prisma client with proper configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });
};

// Use global client in development to prevent hot reload issues
const client = globalThis.prisma || createPrismaClient();

// Store client globally only in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client;
}

export default client;
