import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function makeLimiter(requests: number, window: Parameters<typeof Ratelimit.slidingWindow>[1]) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: "itpark-feni",
  });
}

// Generous enough for a real shopper retrying a failed payment or fixing a
// typo'd field, tight enough to stop scripted spam / stock-reservation abuse.
export const checkoutLimiter = makeLimiter(8, "10 m");

// A real visitor submits the contact form once, maybe twice.
export const contactLimiter = makeLimiter(4, "10 m");

/** Resolves the caller's IP from the headers Vercel sets on every request. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Checks a rate limiter. Always allows the request (no-op) when Upstash
 * hasn't been configured yet — so these endpoints keep working normally
 * before/without that setup, rather than blocking everyone or crashing.
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<{ allowed: true } | { allowed: false; retryAfterSeconds: number }> {
  if (!limiter) return { allowed: true };

  const result = await limiter.limit(identifier);
  if (result.success) return { allowed: true };

  const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
  return { allowed: false, retryAfterSeconds };
}
