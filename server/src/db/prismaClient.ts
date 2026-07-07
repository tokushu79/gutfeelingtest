import { PrismaClient } from "@prisma/client";

// Single shared Prisma client for the whole process. Prisma manages its own
// connection pool internally, so one instance is all that's needed.
export const prisma = new PrismaClient();
