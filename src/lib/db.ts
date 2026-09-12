import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

let client = globalForPrisma.prisma;
if (!client || !(client as any).occasionCategory) {
  client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

// Attach singleton unconditionally in ALL environments (including production)
// to prevent connection pool churn across warm serverless worker invocations
globalForPrisma.prisma = client;

export const prisma = client;
export default prisma;

