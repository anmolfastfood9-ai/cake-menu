import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRedisClient } from "@/lib/rateLimit";
import { verifyAdminToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Health check with a strict timeout wrapper to prevent deadlocks or hung serverless lambdas.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timeout")), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

export async function GET(req: NextRequest) {
  // Check whether caller is authenticated admin
  let isAdmin = false;
  try {
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const token = bearerToken || cookieToken;

    if (token) {
      const payload = verifyAdminToken(token);
      if (payload) {
        isAdmin = true;
      }
    }
  } catch {
    isAdmin = false;
  }

  let dbOk = false;
  let redisOk = false;

  // 1. Check Database connectivity (lightweight SELECT 1 with 5s timeout to accommodate serverless cold starts)
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, 5000);
    dbOk = true;
  } catch {
    dbOk = false;
  }

  // 2. Check Redis connectivity (lightweight ping with 3s timeout)
  try {
    const redis = getRedisClient();
    if (redis) {
      const res = await withTimeout(redis.ping(), 3000);
      redisOk = res === "PONG" || res === "pong" || typeof res === "string";
    } else {
      // If redis is not configured, rate limiting fails open gracefully
      redisOk = false;
    }
  } catch {
    redisOk = false;
  }

  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Content-Type": "application/json",
  };

  // Failure safety: if database fails, return 503 degraded
  if (!dbOk) {
    if (isAdmin) {
      return NextResponse.json(
        {
          status: "degraded",
          checks: {
            database: "failed",
            redis: redisOk ? "ok" : "unreachable",
          },
        },
        { status: 503, headers }
      );
    }

    return NextResponse.json(
      { status: "degraded" },
      { status: 503, headers }
    );
  }

  // Healthy: HTTP 200
  if (isAdmin) {
    return NextResponse.json(
      {
        status: "ok",
        checks: {
          database: "ok",
          redis: redisOk ? "ok" : "unreachable",
        },
      },
      { status: 200, headers }
    );
  }

  return NextResponse.json(
    { status: "ok" },
    { status: 200, headers }
  );
}
