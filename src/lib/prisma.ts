
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export let prisma: PrismaClient;

try {
    prisma =
        globalForPrisma.prisma ||
        new PrismaClient({
            log: ['query'],
        });
} catch (e) {
    console.warn('Failed to initialize Prisma Client:', e);
    // Fallback to a proxy that throws when accessed, to allow build to pass static analysis
    prisma = new Proxy({}, {
        get() {
            throw new Error('Prisma Client failed to initialize. Check your DATABASE_URL.');
        },
    }) as unknown as PrismaClient;
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
