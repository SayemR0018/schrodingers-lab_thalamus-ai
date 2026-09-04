/**
 * POST /api/chat/message
 *
 * Non-streaming chat completion fallback. Same orchestrator logic but
 * returns a single JSON blob. Used by older browsers / proxies that
 * block SSE and as the offline fallback.
 */
import type { NextRequest } from "next/server";
import {
  planRouting,
  runAgent,
  type AgentId,
} from "@/lib/openai/orchestrator";
import { openai, MODELS, LIMITS, completionBudget } from "@/lib/openai/client";
import { withModelFallback } from "@/lib/openai/engine";
import {
  THALAMUS_SYNTHESIZER_INSTRUCTIONS,
} from "@/lib/openai/prompts/thalamus.system";
import { rateLimit, getClientIp, capConversation } from "@/lib/openai/safety";
import { buildChatContext, serializeContext, type ChatContextPayload } from "@/lib/openai/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`chat:${ip}`);
  if (!rl.ok) {
    return new Response(
      JSON.stringify({ error: "rate_limited", retryAfter: rl.retryAfter }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: {
    conversationId?: string;
    userMessage?: string;
    message?: string;
    context?: unknown;
    selectedAgentId?: string | null;
    selectedEntityId?: string | null;
    selectedEntityType?: "product" | "customer" | "supplier";
    language?: "en" | "bn";
    history?: Array<{ role: "user" | "assistant"; content: string }>;
  };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
    });
  }

  const userMessage = (body.userMessage ?? body.message ?? "").trim();
  if (!userMessage) {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
    });
  }

  const context: ChatContextPayload =
    (body.context as ChatContextPayload | undefined) ??
    buildChatContext({
      selectedAgentId: (body.selectedAgentId as AgentId | null) ?? null,
      selectedEntityId: body.selectedEntityId ?? null,
      selectedEntityType: body.selectedEntityType ?? null,
      language: body.language ?? "en",
      history: capConversation(body.history ?? []),
    });

  try {
    const { routedAgents } = await planRouting({
      conversationId: body.conversationId ?? "fallback",
      userMessage,
      context,
      selectedAgentId: (body.selectedAgentId as AgentId | null) ?? null,
      selectedEntityId: body.selectedEntityId ?? null,
    });

    const agentNotes: Record<string, string> = {};
    await Promise.all(
      routedAgents.map(async (id) => {
        agentNotes[id] = await runAgent(id, userMessage, context);
      })
    );

    // Synthesize — non-streaming version of synthesizeStream
    const client = openai();
    const ctxString = serializeContext(context);
    const agentNotesText = Object.entries(agentNotes)
      .filter(([, note]) => note && note.trim().length > 0)
      .map(([id, note]) => `### ${id}\n${note}`)
      .join("\n\n");

    const { result: completion, didFallback, usedModel, requestedModel } =
      await withModelFallback(MODELS.default(), (model) =>
        client.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content: `${THALAMUS_SYNTHESIZER_INSTRUCTIONS}\n\nContext:\n${ctxString.slice(0, 6000)}`,
            },
            {
              role: "user",
              content: `Question (${context.language}): ${userMessage}\n\nAgent notes:\n${agentNotesText}`,
            },
          ],
          ...completionBudget({ maxCompletionTokens: LIMITS.chat() }),
        })
      );

    const fullContent = completion.choices?.[0]?.message?.content ?? "";

    return new Response(
      JSON.stringify({
        messageId: `msg-${Date.now()}`,
        fullContent,
        routedAgents,
        agentNotes,
        model: usedModel,
        requestedModel,
        "X-Thalamus-Fallback": didFallback,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "orchestrator_failed",
        detail: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
