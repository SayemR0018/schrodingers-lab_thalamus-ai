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
 * GPT-5.6 chat completions reject the legacy token cap and any temperature
 * other than the API default. Rewrite the JSON body so neither field can
 * leak through the SDK, a helper, or a future caller.
 */
function rewriteChatCompletionJson(raw: string): string {
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return raw;
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return raw;
  }

  let changed = false;

  if (Object.prototype.hasOwnProperty.call(payload, "max_tokens")) {
    if (
      payload.max_completion_tokens == null &&
      typeof payload.max_tokens === "number"
    ) {
      payload.max_completion_tokens = payload.max_tokens;
    }
    delete payload.max_tokens;
    changed = true;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "temperature")) {
    delete payload.temperature;
    changed = true;
  }

  return changed ? JSON.stringify(payload) : raw;
}

function requestUrl(input: string | URL | Request): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function gpt56SafeFetch(
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> {
  if (!requestUrl(input).includes("/chat/completions")) {
    return fetch(input, init);
  }
  if (typeof init?.body !== "string") {
    return fetch(input, init);
  }
  const body = rewriteChatCompletionJson(init.body);
  if (body === init.body) {
    return fetch(input, init);
  }
  return fetch(input, { ...init, body });
}

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
    fetch: gpt56SafeFetch,
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
  chat: () =>
    Number(
      process.env.OPENAI_MAX_COMPLETION_TOKENS_CHAT ??
        process.env.OPENAI_MAX_TOKENS_CHAT ??
        600
    ),
  report: () =>
    Number(
      process.env.OPENAI_MAX_COMPLETION_TOKENS_REPORT ??
        process.env.OPENAI_MAX_TOKENS_REPORT ??
        1500
    ),
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
