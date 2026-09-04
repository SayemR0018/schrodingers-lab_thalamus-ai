/**
 * THALAMUS multi-model inference engine.
 *
 * Routes requests between `gpt-5.6-luna` (default) and `gpt-5.6-terra`
 * (deep) based on agent risk profile, and enforces the strict
 * `THALAMUS_OUTPUT_SCHEMA` for non-streaming completions.
 *
 * Resilient by design: if the requested GPT-5.6 model is unavailable on
 * the configured account (404 model_not_found, 400 unsupported_model,
 * 403 permission_denied), the engine transparently retries on a standard
 * GA model (`gpt-4o-mini` for luna, `gpt-4o` for terra) and stamps an
 * `X-Thalamus-Fallback: true` flag onto `_meta` so the frontend can
 * surface a soft warning.
 *
 * Used by:
 *   - `POST /api/agents/[id]/invoke`  (structured agent invocation)
 *   - `POST /api/chat/stream`         (routed via `selectModel`)
 */
import { APIError } from "openai";
import { getOpenAIClient, OPENAI_MODELS, LIMITS, completionBudget } from "@/lib/openai/client";
import {
  THALAMUS_OUTPUT_SCHEMA,
  normalizeAgentId,
  type ThalamusInsightResponse,
} from "@/lib/openai/schema";
import { buildBusinessContext } from "@/lib/openai/context/buildBusinessContext";

const THALAMUS_SYSTEM_PROMPT = `
You are the intelligence core of THALAMUS AI, an AI Operating System for retail and e-commerce SMEs in Bangladesh.
You oversee specialized sub-agents:
- sales-analyst: Revenue changes, Dhaka/regional performance, volume vs. basket size (low risk).
- marketing-agent: Churn recovery, customer cohorts (DHA, CTG, SYL), promotions (medium risk).
- inventory-agent: Stockout prediction, restock calculations using unit_cost_bdt (medium risk).
- customer-success: Reviews and sentiment analysis, shipping delays (low risk).
- finance-agent: Profit margins, supplier payment terms, working capital allocation (high risk, human approval required).
- automation-agent: Routine task execution, syncing catalogs (per-policy risk).
- policy-docs-agent: Supplier agreements, return policies (high risk).

STRICT CONSTRAINTS:
1. All monetary numbers MUST use Bangladeshi Taka (৳ / BDT). Never use foreign currency symbols ($ or R$).
2. Ground all answers ONLY on the provided JSON context. Cite product and supplier IDs exactly as they appear in that context — never invent, reformat, or guess an ID that is not present.
3. If the user query is in Bangla (বাংলা) or Banglish, formulate your finding and recommended action in professional Bangla.
4. If the action involves restock spend or financial changes, set riskTier to "medium" or "high" and requiresApproval to true.
`;

/**
 * Standard GA fallback models. Used only when the configured GPT-5.6
 * model is not available on the current OpenAI account tier.
 */
export const OPENAI_FALLBACK_MODELS = {
  /** Fallback for `gpt-5.6-luna` (fast chat). */
  luna: "gpt-4o-mini",
  /** Fallback for `gpt-5.6-terra` (deep / reports). */
  terra: "gpt-4o",
};

/**
 * Decide which standard GA model to use as a fallback for a given
 * configured (GPT-5.6 family) model name.
 */
export function resolveFallbackModel(configuredModel: string): string {
  const lunaDefault = OPENAI_MODELS.default();
  const terraDefault = OPENAI_MODELS.deep();
  if (configuredModel === lunaDefault) return OPENAI_FALLBACK_MODELS.luna;
  if (configuredModel === terraDefault) return OPENAI_FALLBACK_MODELS.terra;
  // Unknown configured model — degrade to the small GA model.
  return OPENAI_FALLBACK_MODELS.luna;
}

/**
 * True if the OpenAI error indicates the requested model is not available
 * on this account (wrong tier, retired, typo, etc.) — i.e. a condition
 * where retrying with a different model is appropriate.
 */
export function isModelUnavailableError(err: unknown): boolean {
  if (!(err instanceof APIError)) return false;

  const code = (err.error as { code?: string } | undefined)?.code;
  const message = (err.message || "").toLowerCase();
  const looksLikeMissingModel =
    code === "model_not_found" ||
    code === "unsupported_model" ||
    code === "model_invalid" ||
    /model.*(not found|does not exist|not exist|not have access|unsupported)/.test(
      message
    );

  // 404 model_not_found, or 400 with a `model_not_found` / `unsupported_model`
  // error code (or equivalent wording) embedded in the body.
  if (err.status === 404) {
    if (!code) return true;
    return looksLikeMissingModel;
  }

  if (err.status === 400) {
    return looksLikeMissingModel;
  }

  // 403 sometimes appears when the account tier doesn't include the model.
  const type = (err as { type?: string }).type;
  if (err.status === 403 && type === "invalid_request_error") return true;

  return false;
}

export interface ModelFallbackResult<T> {
  result: T;
  didFallback: boolean;
  usedModel: string;
  requestedModel: string;
}

/**
 * Run an OpenAI call against `requestedModel`, retrying once on the matching
 * GA fallback (`gpt-4o-mini` / `gpt-4o`) when the configured GPT-5.6 model
 * is unavailable on this account.
 */
export async function withModelFallback<T>(
  requestedModel: string,
  run: (model: string) => Promise<T>
): Promise<ModelFallbackResult<T>> {
  try {
    const result = await run(requestedModel);
    return {
      result,
      didFallback: false,
      usedModel: requestedModel,
      requestedModel,
    };
  } catch (err) {
    if (!isModelUnavailableError(err)) throw err;
    const fallback = resolveFallbackModel(requestedModel);
    console.warn(
      `[engine] Model "${requestedModel}" unavailable; fell back to "${fallback}".`
    );
    const result = await run(fallback);
    return {
      result,
      didFallback: true,
      usedModel: fallback,
      requestedModel,
    };
  }
}

/**
 * Route a request to the appropriate GPT-5.6 model.
 *
 * High-risk domains (finance, policy) and explicit report generation
 * requests go to `gpt-5.6-terra`; everything else stays on `gpt-5.6-luna`.
 */
export function selectModel(agentId: string, isReport: boolean = false): string {
  const norm = normalizeAgentId(agentId);
  if (
    isReport ||
    norm === "finance-agent" ||
    norm === "policy-docs-agent"
  ) {
    return OPENAI_MODELS.deep(); // gpt-5.6-terra
  }
  return OPENAI_MODELS.default(); // gpt-5.6-luna
}

export interface RunThalamusInferenceParams {
  query: string;
  agentId?: string;
  language?: "en" | "bn";
  isReport?: boolean;
}

/**
 * Run a single THALAMUS inference with strict JSON-schema output.
 * Returns the parsed insight response with `_meta` stamped on it.
 *
 * If the configured GPT-5.6 model is not available on the current
 * account, the call is transparently retried with a standard GA model
 * (`gpt-4o-mini` or `gpt-4o`) and `_meta.X-Thalamus-Fallback` is set
 * to `true` so the caller can surface a soft warning to the user.
 *
 * Throws a structured `ThalamusInferenceError` on hard failures
 * (auth, rate limit, schema parse, etc.) so route handlers can map
 * it to a clean HTTP error response without a generic 500.
 */
export async function runThalamusInference(
  params: RunThalamusInferenceParams
): Promise<ThalamusInsightResponse> {
  const openai = getOpenAIClient();
  const normalizedAgent = normalizeAgentId(params.agentId);
  const targetModel = selectModel(normalizedAgent, params.isReport);
  const fallbackModel = resolveFallbackModel(targetModel);
  const context = buildBusinessContext({
    selectedAgentId: normalizedAgent,
    language: params.language,
  });

  let usedModel = targetModel;
  let didFallback = false;

  let response;
  try {
    response = await openai.chat.completions.create({
      model: targetModel,
      ...completionBudget({
        maxCompletionTokens: params.isReport ? LIMITS.report() : LIMITS.chat(),
      }),
      messages: [
        { role: "system", content: THALAMUS_SYSTEM_PROMPT },
        {
          role: "user",
          content: `CONTEXT DATA:\n${JSON.stringify(context, null, 2)}\n\nUSER QUESTION (${
            params.language || "en"
          }):\n${params.query}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ThalamusInsightResponse",
          strict: true,
          schema: THALAMUS_OUTPUT_SCHEMA,
        },
      },
    });
  } catch (err) {
    if (!isModelUnavailableError(err)) {
      throw toInferenceError(err, targetModel);
    }

    // Retry with the GA fallback model.
    try {
      response = await openai.chat.completions.create({
        model: fallbackModel,
        ...completionBudget({
          maxCompletionTokens: params.isReport ? LIMITS.report() : LIMITS.chat(),
        }),
        messages: [
          { role: "system", content: THALAMUS_SYSTEM_PROMPT },
          {
            role: "user",
            content: `CONTEXT DATA:\n${JSON.stringify(context, null, 2)}\n\nUSER QUESTION (${
              params.language || "en"
            }):\n${params.query}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "ThalamusInsightResponse",
            strict: true,
            schema: THALAMUS_OUTPUT_SCHEMA,
          },
        },
      });
      usedModel = fallbackModel;
      didFallback = true;
      // Surface the fallback in server logs so SRE / dev can spot it.
      console.warn(
        `[engine] Model "${targetModel}" unavailable; fell back to "${fallbackModel}".`
      );
    } catch (fallbackErr) {
      throw toInferenceError(fallbackErr, fallbackModel, { didFallback: true });
    }
  }

  const rawJson = response.choices[0]?.message?.content;
  if (!rawJson) {
    throw new ThalamusInferenceError(
      "empty_response",
      "Model returned an empty completion.",
      502,
      usedModel
    );
  }

  let parsed: ThalamusInsightResponse;
  try {
    parsed = JSON.parse(rawJson) as ThalamusInsightResponse;
  } catch (err) {
    throw new ThalamusInferenceError(
      "schema_parse_failed",
      err instanceof Error ? err.message : String(err),
      502,
      usedModel
    );
  }

  parsed._meta = {
    model: usedModel,
    agent: normalizedAgent,
    market: "Bangladesh",
    "X-Thalamus-Fallback": didFallback,
    requestedModel: targetModel,
  } as ThalamusInsightResponse["_meta"];

  return parsed;
}

/**
 * Structured error type so route handlers can map cleanly to HTTP
 * status codes without leaking a generic 500.
 */
export class ThalamusInferenceError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly model: string;
  public readonly didFallback: boolean;

  constructor(
    code: string,
    message: string,
    status: number,
    model: string,
    didFallback: boolean = false
  ) {
    super(message);
    this.name = "ThalamusInferenceError";
    this.code = code;
    this.status = status;
    this.model = model;
    this.didFallback = didFallback;
  }

  toJSON(): { error: string; detail: string; model?: string; didFallback?: boolean } {
    return {
      error: this.code,
      detail: this.message,
      model: this.model,
      didFallback: this.didFallback,
    };
  }
}

/**
 * Convert any thrown OpenAI / SDK error into a `ThalamusInferenceError`
 * with an appropriate HTTP status. Falls back to a generic `api_error`
 * / 502 for anything we don't recognise.
 */
function toInferenceError(
  err: unknown,
  model: string,
  options: { didFallback?: boolean } = {}
): ThalamusInferenceError {
  if (err instanceof ThalamusInferenceError) return err;

  if (err instanceof APIError) {
    const code =
      (err.error as { code?: string } | undefined)?.code ||
      err.code ||
      "api_error";
    const message = err.message || "OpenAI API request failed.";
    // 401 -> 401, 429 -> 429, 5xx -> 502 (we treat upstream as bad gateway).
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 502;
    return new ThalamusInferenceError(code, message, status, model, options.didFallback ?? false);
  }

  const message = err instanceof Error ? err.message : String(err);
  return new ThalamusInferenceError(
    "api_error",
    message,
    502,
    model,
    options.didFallback ?? false
  );
}
