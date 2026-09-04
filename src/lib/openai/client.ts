/**
 * OpenAI SDK singleton + model selectors.
 *
 * This module is SERVER-ONLY — never import from a client component.
 * The Next.js server runtime (Node) will throw if you try to instantiate
 * without OPENAI_API_KEY in env.
 *
 * The new GPT-5.6 family (per THALAMUS_Demo_Dataset_BD_v1):
 *   - gpt-5.6-luna  : default model for routine chat / agent responses.
 *   - gpt-5.6-terra : deep model for finance / policy / reports.
 *
 * Both models reject the legacy completion token cap and custom
 * temperature values. Completions must use `max_completion_tokens` and
 * omit `temperature` (API default = 1).
 */
import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

/**
 * Primary accessor — returns a memoised OpenAI client.
 * Throws lazily when the API key is missing so route handlers can decide
 * how to fall back instead of failing on import.
 */
export function getOpenAIClient(): OpenAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in environment variables.");
  }

  cachedClient = new OpenAI({
    apiKey,
    timeout: Number(process.env.OPENAI_TIMEOUT_MS ?? 30000),
    maxRetries: 2,
  });

  return cachedClient;
}

/**
 * Dynamic model selectors. These read the environment at call time so
 * model swaps don't require a rebuild.
 */
export const OPENAI_MODELS = {
  default: () => process.env.OPENAI_MODEL_DEFAULT ?? "gpt-5.6-luna",
  deep: () => process.env.OPENAI_MODEL_DEEP ?? "gpt-5.6-terra",
  struct: () => process.env.OPENAI_MODEL_STRUCT ?? "gpt-5.6-luna",
};

// ---------------------------------------------------------------------------
// Backwards-compatible aliases for the existing orchestrator / API routes.
// New code should prefer `getOpenAIClient` and `OPENAI_MODELS`.
// ---------------------------------------------------------------------------

/** @deprecated Use `getOpenAIClient`. */
export const openai: () => OpenAI = getOpenAIClient;

/** @deprecated Use `OPENAI_MODELS`. */
export const MODELS = OPENAI_MODELS;

export const LIMITS = {
  chat: () => Number(process.env.OPENAI_MAX_TOKENS_CHAT ?? 600),
  report: () => Number(process.env.OPENAI_MAX_TOKENS_REPORT ?? 1500),
};

/**
 * GPT-5.6 only accepts the default temperature (`1`). Kept for callers that
 * still read the env var; do **not** pass this into `chat.completions.create`.
 */
export const TEMPERATURE = () => 1;

/**
 * Build GPT-5.6-safe chat completion option fragments.
 *
 * Always emits `max_completion_tokens`. Never emits `temperature` — the
 * 5.6 family rejects any value other than the API default (`1`), and
 * omitting the field is the safest way to stay compatible with both
 * luna/terra and GA fallbacks (`gpt-4o` / `gpt-4o-mini`).
 */
export function completionBudget(opts: {
  maxCompletionTokens: number;
}): {
  max_completion_tokens: number;
} {
  return {
    max_completion_tokens: opts.maxCompletionTokens,
  };
}

/**
 * Whether the OpenAI integration is configured. Use this in route handlers
 * to gracefully fall back to mock data when no key is present.
 */
export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}
