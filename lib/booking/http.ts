/**
 * Route-handler helpers: response envelopes, client IP, constant-time
 * Bearer auth, and the per-instance rate limiter.
 *
 * Envelope conventions (ported from the suit store — the front end depends
 * on them): public booking/availability endpoints wrap success in
 * { ok:true, data } and errors in { ok:false, error, code }; staff/cron
 * endpoints use flat { ok:true, ...fields } / { ok:false, error:"CODE" }.
 */

import { timingSafeEqual } from "node:crypto";

export function ok<T>(data: T): { ok: true; data: T } {
  return { ok: true, data };
}

export function err(
  error: string,
  code: string | null = null,
): { ok: false; error: string; code: string | null } {
  return { ok: false, error, code };
}

/** First hop of x-forwarded-for; NextRequest.ip was removed in Next 15+. */
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}

const MIN_SECRET_LENGTH = 16;

/**
 * Verify `Authorization: Bearer <secret>` against process.env[envName].
 * Constant-time compare; a missing or short (<16 chars) secret always fails.
 */
export function verifyBearer(headers: Headers, envName: string): boolean {
  const secret = process.env[envName];
  if (!secret || secret.length < MIN_SECRET_LENGTH) return false;

  const header = headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return false;
  const token = header.slice("Bearer ".length);

  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** In-memory rate limit: per-IP sliding window, resets on cold start. */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

export function checkRateLimit(ip: string, now: number = Date.now()): boolean {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (hits.get(ip) ?? []).filter((t) => t > windowStart);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return false;
  }
  hits.set(ip, [...recent, now]);
  return true;
}

/** Test helper. */
export function resetRateLimitForTests(): void {
  hits.clear();
}
