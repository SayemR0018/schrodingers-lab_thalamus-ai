/**
 * Thalamus orchestrator — planner + synthesizer.
 *
 * Planner:    decides which agents to route to (single, fast, structured).
 * Per-agent:  runs each routed agent's completion in parallel (or sequentially
 *             if we want predictable token usage).
 * Synthesizer: takes agent notes + user question and produces the final
 *               streamed user-facing message.
 *
 * The orchestrator yields SSE chunks via the AsyncGenerator API.
 */
import OpenAI from "openai";
import { openai, MODELS, LIMITS, completionBudget } from "./client";
import { withModelFallback } from "./engine";
import {
  THALAMUS_PLANNER_INSTRUCTIONS,
  THALAMUS_SYNTHESIZER_INSTRUCTIONS,
} from "./prompts/thalamus.system";
import { SALES_ANALYST_INSTRUCTIONS } from "./prompts/sales-analyst.system";
import { MARKETING_AGENT_INSTRUCTIONS } from "./prompts/marketing-agent.system";
import { INVENTORY_AGENT_INSTRUCTIONS } from "./prompts/inventory-agent.system";
import { CUSTOMER_SUCCESS_INSTRUCTIONS } from "./prompts/customer-success.system";
import { FINANCE_AGENT_INSTRUCTIONS } from "./prompts/finance-agent.system";
import { AUTOMATION_AGENT_INSTRUCTIONS } from "./prompts/automation-agent.system";
import { POLICY_DOCS_AGENT_INSTRUCTIONS } from "./prompts/policy-docs-agent.system";
import { serializeContext, type ChatContextPayload } from "./context";

interface CompletionRequestBase {
  model: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  /** GPT-5.6-safe completion budget. Never send the legacy token-cap field. */
  max_completion_tokens?: number;
  response_format?: {
    type: "json_schema";
    json_schema: {
      name: string;
      strict: boolean;
      schema: Record<string, unknown>;
    };
  };
}

type NonStreamingCompletionRequest = CompletionRequestBase & {
  stream?: false;
};
type StreamingCompletionRequest = CompletionRequestBase & {
  stream: true;
};

interface FallbackResult<T> {
  result: T;
  didFallback: boolean;
  usedModel: string;
  requestedModel: string;
}

/**
 * Issue a non-streaming chat completion with transparent model fallback.
 * If the configured GPT-5.6 model is unavailable on the current account
 * (404 / 400 / 403 with the right error code), the call is retried with
 * `gpt-4o-mini` (luna) or `gpt-4o` (terra). Returns the resolved
 * completion along with a `didFallback` flag so the caller can stamp
 * `X-Thalamus-Fallback: true` onto the response payload.
 */
async function completionWithFallback(
  client: OpenAI,
  request: NonStreamingCompletionRequest
): Promise<FallbackResult<OpenAI.Chat.ChatCompletion>> {
  return withModelFallback(request.model, (model) =>
    client.chat.completions.create({ ...request, model })
  );
}

/**
 * Streaming variant of `completionWithFallback`. The SDK returns a
 * `Stream<ChatCompletionChunk>` for streaming requests so we narrow
 * the return type accordingly.
 */
async function streamingCompletionWithFallback(
  client: OpenAI,
  request: StreamingCompletionRequest
): Promise<FallbackResult<AsyncIterable<OpenAI.Chat.ChatCompletionChunk>>> {
  return withModelFallback(request.model, async (model) => {
    const result = await client.chat.completions.create({
      ...request,
      model,
    });
    return result as unknown as AsyncIterable<OpenAI.Chat.ChatCompletionChunk>;
  });
}

export type StageName =
  | "understanding"
  | "context"
  | "analysis"
  | "synthesis"
  | "complete";

export type AgentId =
  | "sales-analyst"
  | "marketing-agent"
  | "inventory-agent"
  | "customer-success"
  | "finance-agent"
  | "automation-agent"
  | "policy-docs-agent";

const AGENT_PROMPTS: Record<AgentId, string> = {
  "sales-analyst": SALES_ANALYST_INSTRUCTIONS,
  "marketing-agent": MARKETING_AGENT_INSTRUCTIONS,
  "inventory-agent": INVENTORY_AGENT_INSTRUCTIONS,
  "customer-success": CUSTOMER_SUCCESS_INSTRUCTIONS,
  "finance-agent": FINANCE_AGENT_INSTRUCTIONS,
  "automation-agent": AUTOMATION_AGENT_INSTRUCTIONS,
  "policy-docs-agent": POLICY_DOCS_AGENT_INSTRUCTIONS,
};

export interface OrchestratorInput {
  conversationId: string;
  userMessage: string;
  context: ChatContextPayload;
  selectedAgentId?: AgentId | null;
  selectedEntityId?: string | null;
}

export interface OrchestratorResult {
  agentNotes: Record<AgentId, string>;
  finalContent: string;
  needsReport: boolean;
  routedAgents: AgentId[];
}

/** Map our domain id to OpenAI chat-role "tool" names if ever needed. */
/**
 * Agents the planner is allowed to route to. `automation-agent` is omitted
 * because it executes workflows on request rather than answering questions.
 */
export const AGENT_IDS: AgentId[] = [
  "sales-analyst",
  "marketing-agent",
  "inventory-agent",
  "customer-success",
  "finance-agent",
  "policy-docs-agent",
];

/**
 * Plan: which agents to invoke.
 * Uses a tiny structured-output call. Falls back to a sensible default
 * if the LLM call fails or the response is malformed.
 */
export async function planRouting(input: OrchestratorInput): Promise<{
  routedAgents: AgentId[];
  needsReport: boolean;
}> {
  // If a single agent is explicitly selected, route only there.
  if (
    input.selectedAgentId &&
    AGENT_IDS.includes(input.selectedAgentId as AgentId)
  ) {
    return { routedAgents: [input.selectedAgentId as AgentId], needsReport: false };
  }

  const client = openai();
  const ctxString = serializeContext(input.context);
  try {
    const { result: completion } = await completionWithFallback(client, {
      model: MODELS.struct(),
      messages: [
        { role: "system", content: THALAMUS_PLANNER_INSTRUCTIONS },
        {
          role: "user",
          content:
            `User question: "${input.userMessage}"\n\n` +
            `Language: ${input.context.language}\n\n` +
            `Available context (truncated): ${ctxString.slice(0, 4000)}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "thalamus_plan",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              routeToAgents: {
                type: "array",
                items: {
                  type: "string",
                  enum: [...AGENT_IDS],
                },
                minItems: 1,
                maxItems: 3,
              },
              needsReport: { type: "boolean" },
            },
            required: ["routeToAgents", "needsReport"],
          },
        },
      },
      ...completionBudget({ maxCompletionTokens: 200 }),
    });

    const raw = completion.choices?.[0]?.message?.content;
    if (!raw) throw new Error("planner returned no content");
    const parsed = JSON.parse(raw) as {
      routeToAgents?: string[];
      needsReport?: boolean;
    };
    const routed = (parsed.routeToAgents ?? [])
      .filter((id): id is AgentId => AGENT_IDS.includes(id as AgentId));
    return {
      routedAgents: routed.length > 0 ? routed : ["sales-analyst"],
      needsReport: Boolean(parsed.needsReport),
    };
  } catch (err) {
    console.warn("[orchestrator] planner failed, using fallback:", err);
    // Heuristic fallback: keyword routing.
    const q = input.userMessage.toLowerCase();
    const routed: AgentId[] = [];
    if (q.match(/sale|revenue|order|trend|drop|growth|top/)) routed.push("sales-analyst");
    if (q.match(/stock|inventory|reorder|supplier|sku|warehouse/)) routed.push("inventory-agent");
    if (q.match(/customer|churn|retention|segment/)) routed.push("customer-success");
    if (q.match(/finance|cash|margin|budget|payment/)) routed.push("finance-agent");
    if (q.match(/market|campaign|channel|attribution/)) routed.push("marketing-agent");
    if (routed.length === 0) routed.push("sales-analyst");
    return { routedAgents: routed.slice(0, 3), needsReport: false };
  }
}

/**
 * Run a single agent's completion. Returns the agent's note (markdown text).
 * The completion transparently falls back to `gpt-4o-mini` if the configured
 * `gpt-5.6-luna` model is unavailable on the current account.
 */
export async function runAgent(
  agentId: AgentId,
  userMessage: string,
  context: ChatContextPayload
): Promise<string> {
  const client = openai();
  const ctxString = serializeContext(context);

  const systemPrompt = `${AGENT_PROMPTS[agentId]}\n\nBusiness context:\n${ctxString.slice(0, 8000)}`;

  const { result: completion } = await completionWithFallback(client, {
    model: MODELS.default(),
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content:
          `User question (language: ${context.language}): ${userMessage}\n\n` +
          `Respond in the user's language. Be specific — cite SKUs, regions, numbers from the context. ` +
          `Keep your note under ~250 words.`,
      },
    ],
    ...completionBudget({ maxCompletionTokens: LIMITS.chat() }),
  });

  return completion.choices?.[0]?.message?.content ?? "";
}

/**
 * Run the synthesizer to produce the final user-facing reply.
 * Returns a streaming OpenAI completion that the caller can pipe to the
 * browser as SSE. The completion transparently falls back to
 * `gpt-4o-mini` if the configured `gpt-5.6-luna` model is unavailable
 * on the current account.
 */
export function synthesizeStream(
  userMessage: string,
  context: ChatContextPayload,
  agentNotes: Record<AgentId, string>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _messageId: string
): Promise<{
  stream: AsyncIterable<OpenAI.Chat.ChatCompletionChunk>;
  didFallback: boolean;
  usedModel: string;
  requestedModel: string;
}> {
  const client = openai();
  const ctxString = serializeContext(context);

  const agentNotesText = Object.entries(agentNotes)
    .filter(([, note]) => note && note.trim().length > 0)
    .map(([id, note]) => `### ${id}\n${note}`)
    .join("\n\n");

  const systemPrompt = `${THALAMUS_SYNTHESIZER_INSTRUCTIONS}\n\nBusiness context (truncated):\n${ctxString.slice(0, 6000)}`;

  const userPrompt =
    `Original user question (language: ${context.language}): ${userMessage}\n\n` +
    `Agent notes:\n${agentNotesText || "(no agent notes — answer directly)"}`;

  // The OpenAI SDK returns APIPromise<Stream<...>> — we cast through unknown
  // to AsyncIterable so the caller can `for await` over it. The Stream class
  // itself implements [Symbol.asyncIterator].
  return streamingCompletionWithFallback(client, {
    model: MODELS.default(),
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    ...completionBudget({ maxCompletionTokens: LIMITS.chat() }),
    stream: true,
  }).then(
    ({ result, didFallback, usedModel, requestedModel }) => ({
      stream: result,
      didFallback,
      usedModel,
      requestedModel,
    })
  );
}

/**
 * High-level orchestrator that yields SSE Uint8Array chunks ready to
 * write to the response stream. Handles all 4 stages and emits
 * `stage`, `agent`, `token`, and `done` events.
 */
export async function* runOrchestrator(
  input: OrchestratorInput,
  emit: {
    stage: (stage: StageName, activeAgents: string[]) => Uint8Array;
    agent: (id: string, state: "working" | "done") => Uint8Array;
    token: (delta: string) => Uint8Array;
    done: (
      messageId: string,
      fullContent: string,
      reportId?: string,
      meta?: Record<string, unknown>
    ) => Uint8Array;
    error: (code: string, message: string) => Uint8Array;
  }
): AsyncGenerator<Uint8Array> {
  const messageId = `msg-${input.conversationId}-${Date.now()}`;

  try {
    // 1. Understanding — plan
    yield emit.stage("understanding", []);
    const { routedAgents, needsReport } = await planRouting(input);

    // 2. Context — agents load their slice (we already serialized it)
    yield emit.stage("context", routedAgents);
    for (const id of routedAgents) yield emit.agent(id, "working");

    // 3. Analysis — run agents in parallel
    yield emit.stage("analysis", routedAgents);
    const agentNotes: Record<string, string> = {};
    await Promise.all(
      routedAgents.map(async (id) => {
        try {
          agentNotes[id] = await runAgent(id, input.userMessage, input.context);
        } catch (err) {
          agentNotes[id] =
            `(${id} could not complete: ${err instanceof Error ? err.message : String(err)})`;
        }
      })
    );
    // Emit agent "done" events sequentially after all agents have completed.
    for (const id of routedAgents) {
      yield emit.agent(id, "done");
    }

    // 4. Synthesis — stream the final user-facing message
    yield emit.stage("synthesis", routedAgents);
    const { stream, didFallback, usedModel, requestedModel } = await synthesizeStream(
      input.userMessage,
      input.context,
      agentNotes as Record<AgentId, string>,
      messageId
    );

    let full = "";
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        full += delta;
        yield emit.token(delta);
      }
      if (chunk.choices?.[0]?.finish_reason) {
        // Optional: emit a report event if needed
        if (needsReport) {
          // Minimal report payload — wired up in Phase 8.
          // The frontend treats `reportId` as opaque.
        }
        yield emit.done(messageId, full, undefined, {
          "X-Thalamus-Fallback": didFallback,
          model: usedModel,
          requestedModel,
        });
      }
    }

    yield emit.stage("complete", routedAgents);
  } catch (err) {
    yield emit.error(
      "orchestrator_failed",
      err instanceof Error ? err.message : String(err)
    );
  }
}

/**
 * Adapter: bridge `sseEventBytes` (Uint8Array) into the orchestrator's
 * `emit` callbacks so route handlers can pass simple string-returning
 * helpers without losing type compatibility.
 */
export function byteEmitters(emit: {
  stage: (stage: StageName, activeAgents: string[]) => string;
  agent: (id: string, state: "working" | "done") => string;
  token: (delta: string) => string;
  done: (
    messageId: string,
    fullContent: string,
    reportId?: string,
    meta?: Record<string, unknown>
  ) => string;
  error: (code: string, message: string) => string;
}): {
  stage: (stage: StageName, activeAgents: string[]) => Uint8Array;
  agent: (id: string, state: "working" | "done") => Uint8Array;
  token: (delta: string) => Uint8Array;
  done: (
    messageId: string,
    fullContent: string,
    reportId?: string,
    meta?: Record<string, unknown>
  ) => Uint8Array;
  error: (code: string, message: string) => Uint8Array;
} {
  return {
    stage: (s, a) => new TextEncoder().encode(emit.stage(s, a)),
    agent: (id, state) => new TextEncoder().encode(emit.agent(id, state)),
    token: (delta) => new TextEncoder().encode(emit.token(delta)),
    done: (m, f, r, meta) => new TextEncoder().encode(emit.done(m, f, r, meta)),
    error: (c, m) => new TextEncoder().encode(emit.error(c, m)),
  };
}
