/**
 * Lightweight sliding-window rate limiter using a per-IP Map bucket.
 * Zero external dependencies — runs entirely in Next.js process memory.
 *
 * Usage:
 *   const allowed = checkRateLimit(ip, { limit: 10, windowMs: 60_000 });
 *   if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

interface Bucket {
  count: number;
  windowStart: number;
}

// Global per-identifier buckets (scoped to the running Next.js server process)
const buckets = new Map<string, Bucket>();

// Garbage-collect old entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      if (now - bucket.windowStart > 300_000) {
        buckets.delete(key);
      }
    }
  }, 300_000);
}

interface RateLimitOptions {
  /** Maximum number of requests allowed per window */
  limit: number;
  /** Window duration in milliseconds (default: 60_000 = 1 minute) */
  windowMs?: number;
}

/**
 * Returns `true` if the request is within rate limits, `false` if it should be blocked.
 * @param identifier - Typically the client IP address or user ID
 */
export function checkRateLimit(
  identifier: string,
  { limit, windowMs = 60_000 }: RateLimitOptions
): boolean {
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket || now - bucket.windowStart >= windowMs) {
    // New window — reset counter
    buckets.set(identifier, { count: 1, windowStart: now });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

/**
 * Extracts the real client IP from Next.js request headers.
 * Handles proxies (Vercel, Cloudflare, nginx).
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
