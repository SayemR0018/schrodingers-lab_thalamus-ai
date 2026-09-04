/**
 * Server-side safety primitives:
 *   - in-memory token bucket rate limiter (per IP)
 *   - conversation length cap
 *   - token budget guardrail
 *
 * These are best-effort guards for a demo / prototype. A production
 * deployment should use a real rate-limiter (Upstash / Redis) and a
 * server-side moderation layer.
 */

interface Bucket {
  tokens: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const RATE_LIMIT_PER_MIN = Number(
  process.env.OPENAI_RATE_LIMIT_PER_MIN ?? "30"
);

export function rateLimit(key: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? {
    tokens: RATE_LIMIT_PER_MIN,
    resetAt: now + 60_000,
  };

  if (now > bucket.resetAt) {
    bucket.tokens = RATE_LIMIT_PER_MIN;
    bucket.resetAt = now + 60_000;
  }

  if (bucket.tokens <= 0) {
    buckets.set(key, bucket);
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { ok: true };
}

export function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "anonymous";
}

/** Cap conversation history to a max number of turns. */
export function capConversation<T>(items: T[], max = 50): T[] {
  if (items.length <= max) return items;
  return items.slice(-max);
}

/**
 * Coarse token-budget estimation. We don't need exact counts — the goal
 * is to abort early when a request would clearly exceed our budget.
 */
export function estimateTokens(text: string): number {
  // ~4 chars per token is a safe upper bound for English/Bengali.
  return Math.ceil(text.length / 4);
}

export function withinBudget(text: string, max = 12000): boolean {
  return estimateTokens(text) <= max;
}

/**
 * Returns the categories we redact from any customer-record payload that
 * is forwarded to the LLM. Customer emails, phones, and addresses should
 * never leave the server boundary.
 */
export const REDACTED_FIELDS = new Set([
  "email",
  "phone",
  "address",
  "ip",
  "ipAddress",
  "ssn",
]);

export function redact<T extends Record<string, unknown>>(record: T): T {
  const copy: Record<string, unknown> = { ...record };
  for (const key of Object.keys(copy)) {
    if (REDACTED_FIELDS.has(key)) {
      copy[key] = "[REDACTED]";
    }
  }
  return copy as T;
}
