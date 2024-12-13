import { PrismaClient } from "@prisma/client";

// 'unknown' is used to avoid type errors when accessing the global object
const globalForPrisma = global as unknown as {
  // create a global variable to store our single Prisma instance
  prisma: PrismaClient | undefined;
};
// create a new PrismaClient instance if it doesn't exist, otherwise use the existing one
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// if the environment is not production, set the global prisma instance to the prisma client
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; // in development, save the instance for reuse
