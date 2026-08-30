import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';
import { env } from './env.js';

let prismaInstance = null;

export function getPrisma() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
    });
  }
  return prismaInstance;
}

export const prisma = getPrisma();

export async function connectDB() {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected successfully via Prisma');
    return true;
  } catch (error) {
    logger.error({ err: error.message }, '❌ Database connection failed');
    return false;
  }
}

export async function disconnectDB() {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    logger.info('PostgreSQL disconnected');
  }
}
