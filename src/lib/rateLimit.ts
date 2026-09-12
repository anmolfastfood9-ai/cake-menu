import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import crypto from "crypto";

// Maximum failed login attempts allowed per IP before blocking
export const MAX_LOGIN_ATTEMPTS_PER_IP = 5;

// Maximum failed login attempts across all IPs for a single account
// (Higher ceiling to prevent distributed attacker from causing DoS on the admin)
export const MAX_LOGIN_ATTEMPTS_PER_ACCOUNT = 25;

// Cooldown window in seconds (15 minutes)
export const LOGIN_WINDOW_SECONDS = 15 * 60;

export interface RateLimitResult {
  success: boolean;
  remaining?: number;
  retryAfter?: number; // seconds
}

let redisInstance: Redis | null = null;
let hasLoggedMissingEnv = false;

/**
 * Returns a singleton Upstash Redis client.
 * Fails safely if environment variables are not configured.
 */
export function getRedisClient(): Redis | null {
  if (redisInstance) return redisInstance;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (!hasLoggedMissingEnv) {
      console.warn(
        "[RateLimit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing. Distributed rate limiting is inactive (fail-safe open)."
      );
      hasLoggedMissingEnv = true;
    }
    return null;
  }

  try {
    redisInstance = new Redis({ url, token });
    return redisInstance;
  } catch (error: any) {
    console.error("[RateLimit] Failed to initialize Redis client:", error?.message || "Unknown error");
    return null;
  }
}

/**
 * Allow injection of custom Redis instance for testing purposes.
 */
export function setRedisClientForTesting(client: Redis | null) {
  redisInstance = client;
}

/**
 * Validates whether a candidate string is a valid IPv4 or IPv6 address.
 */
function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string" || ip.length > 45) return false;

  // IPv4 validation
  const ipv4Parts = ip.split(".");
  if (ipv4Parts.length === 4) {
    return ipv4Parts.every((part) => {
      const num = Number(part);
      return /^\d+$/.test(part) && num >= 0 && num <= 255;
    });
  }

  // IPv6 validation
  if (ip.includes(":")) {
    return /^[0-9a-fA-F:.]+$/.test(ip);
  }

  return false;
}

/**
 * Extracts a trusted client IP address appropriate for Vercel's proxy environment.
 *
 * Security rationale:
 * 1. `x-vercel-forwarded-for`: Injected by Vercel edge nodes directly from the socket connection.
 *    Any client-supplied value is stripped or overwritten by Vercel before reaching serverless functions.
 * 2. `x-real-ip`: Standard reverse proxy client IP header, set by trusted upstream proxies.
 * 3. `req.ip`: Next.js internal property resolved from trusted proxy headers in Vercel Serverless.
 * 4. `x-forwarded-for`: When traversing reverse proxies, proxies APPEND the real remote address.
 *    Blindly reading the first IP (`split(",")[0]`) allows trivial client spoofing if an attacker sends
 *    `x-forwarded-for: fake-ip`. To mitigate spoofing, we inspect from right to left (closest trusted proxy).
 * 5. Fallback: Defaults to "127.0.0.1" for local offline testing.
 */
export function getClientIp(req: NextRequest): string {
  // 1. Vercel edge proxy header (highest trust in Vercel deployments)
  const vercelIp = req.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const candidate = vercelIp.split(",")[0].trim();
    if (isValidIp(candidate)) return candidate;
  }

  // 2. Standard reverse proxy header
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    const candidate = realIp.trim();
    if (isValidIp(candidate)) return candidate;
  }

  // 3. Next.js internal resolved property
  const nextIp = (req as any).ip;
  if (nextIp && typeof nextIp === "string" && isValidIp(nextIp.trim())) {
    return nextIp.trim();
  }

  // 4. Fallback: Parse x-forwarded-for from right to left to avoid client-forged leading entries
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((s) => s.trim()).filter(Boolean);
    for (let i = ips.length - 1; i >= 0; i--) {
      if (isValidIp(ips[i])) {
        return ips[i];
      }
    }
  }

  return "127.0.0.1";
}

/**
 * Sanitizes IP string for use in Redis keys.
 */
function getIpKey(ip: string): string {
  const sanitized = ip.replace(/[^a-zA-Z0-9_.-]/g, "_");
  return `ratelimit:login:fail:ip:${sanitized}`;
}

/**
 * Produces a one-way normalized account hash for Redis keys.
 * Ensures PII/emails are never stored in cleartext keys.
 */
function getAccountKey(email: string): string {
  const normalized = email.toLowerCase().trim();
  const hash = crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 16);
  return `ratelimit:login:fail:account:${hash}`;
}

/**
 * Checks if the incoming login request exceeds IP or Account failure limits.
 * Safe fail-open: If Redis is unavailable, returns success: true so admin is not locked out.
 */
export async function checkLoginRateLimit(
  req: NextRequest,
  email?: string
): Promise<RateLimitResult> {
  try {
    const redis = getRedisClient();
    if (!redis) {
      return { success: true, remaining: MAX_LOGIN_ATTEMPTS_PER_IP };
    }

    const ip = getClientIp(req);
    const ipKey = getIpKey(ip);

    // Fetch IP failure count
    const ipFailures = (await redis.get<number>(ipKey)) || 0;

    if (ipFailures >= MAX_LOGIN_ATTEMPTS_PER_IP) {
      const ttl = await redis.ttl(ipKey);
      const retryAfter = ttl > 0 ? ttl : LOGIN_WINDOW_SECONDS;
      return {
        success: false,
        remaining: 0,
        retryAfter,
      };
    }

    // Account-aware check (if email is provided)
    if (email && typeof email === "string" && email.trim()) {
      const accountKey = getAccountKey(email);
      const accountFailures = (await redis.get<number>(accountKey)) || 0;

      if (accountFailures >= MAX_LOGIN_ATTEMPTS_PER_ACCOUNT) {
        const ttl = await redis.ttl(accountKey);
        const retryAfter = ttl > 0 ? ttl : LOGIN_WINDOW_SECONDS;
        return {
          success: false,
          remaining: 0,
          retryAfter,
        };
      }
    }

    return {
      success: true,
      remaining: Math.max(0, MAX_LOGIN_ATTEMPTS_PER_IP - ipFailures),
    };
  } catch (error: any) {
    console.error("[RateLimit] Distributed rate limit check failed:", error?.message || "Unknown error");
    // Fail-safe open: continue authentication
    return { success: true, remaining: MAX_LOGIN_ATTEMPTS_PER_IP };
  }
}

/**
 * Records a failed login attempt for the IP and account.
 * Sets a 15-minute TTL on initial failure or refreshes expired keys.
 */
export async function recordLoginFailure(req: NextRequest, email?: string): Promise<void> {
  try {
    const redis = getRedisClient();
    if (!redis) return;

    const ip = getClientIp(req);
    const ipKey = getIpKey(ip);

    // Atomically increment IP failure count
    const ipCount = await redis.incr(ipKey);
    if (ipCount === 1) {
      await redis.expire(ipKey, LOGIN_WINDOW_SECONDS);
    } else {
      const ttl = await redis.ttl(ipKey);
      if (ttl < 0) {
        await redis.expire(ipKey, LOGIN_WINDOW_SECONDS);
      }
    }

    // Record account failure if email was submitted
    if (email && typeof email === "string" && email.trim()) {
      const accountKey = getAccountKey(email);
      const accCount = await redis.incr(accountKey);
      if (accCount === 1) {
        await redis.expire(accountKey, LOGIN_WINDOW_SECONDS);
      } else {
        const ttl = await redis.ttl(accountKey);
        if (ttl < 0) {
          await redis.expire(accountKey, LOGIN_WINDOW_SECONDS);
        }
      }
    }
  } catch (error: any) {
    console.error("[RateLimit] Failed to record login failure:", error?.message || "Unknown error");
  }
}

/**
 * Resets the login failure counters for IP and account upon successful authentication.
 */
export async function resetLoginRateLimit(req: NextRequest, email?: string): Promise<void> {
  try {
    const redis = getRedisClient();
    if (!redis) return;

    const ip = getClientIp(req);
    const ipKey = getIpKey(ip);

    const keysToDelete: string[] = [ipKey];

    if (email && typeof email === "string" && email.trim()) {
      keysToDelete.push(getAccountKey(email));
    }

    await redis.del(...keysToDelete);
  } catch (error: any) {
    console.error("[RateLimit] Failed to reset login rate limit:", error?.message || "Unknown error");
  }
}

/**
 * Future-ready rate limiter creator for additional endpoints
 * (e.g. /api/auth/profile, /api/images, mutation endpoints).
 * Uses Upstash sliding window algorithm.
 */
export function createRateLimiter(options: {
  requests: number;
  window: `${number} s` | `${number} m` | `${number} h` | `${number} d`;
  prefix?: string;
}) {
  const redis = getRedisClient();
  if (!redis) {
    return {
      limit: async (_id: string) => ({
        success: true,
        limit: options.requests,
        remaining: options.requests,
        reset: 0,
      }),
    };
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(options.requests, options.window),
    prefix: options.prefix || "ratelimit:generic",
    analytics: false,
  });
}
