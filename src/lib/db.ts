import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let client = globalForPrisma.prisma;
if (!client || !(client as any).occasionCategory) {
  client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;

export const prisma = client;
export default prisma;

