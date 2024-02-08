import { PrismaClient } from '@prisma/client';

// Deployment config
// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }

// export const db = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') {
//   globalThis.prisma = db;
// }

// Development config
export const db = new PrismaClient();
