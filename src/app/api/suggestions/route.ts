/**
 * POST /api/suggestions
 *
 * Dynamic suggested-questions endpoint. Returns 2-3 contextual
 * questions based on the supplied agent/entity context.
 *
 * Body: { selectedAgentId?, selectedEntityId?, selectedEntityType?, language? }
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { openai, MODELS, completionBudget } from "@/lib/openai/client";
import { withModelFallback } from "@/lib/openai/engine";
import { SUGGESTIONS_INSTRUCTIONS, SUGGESTIONS_JSON_SCHEMA } from "@/lib/openai/prompts/suggestions.system";
import { rateLimit, getClientIp } from "@/lib/openai/safety";
import { buildChatContext, serializeContext } from "@/lib/openai/context";
import { mockAgents } from "@/data/mock/agents";
import { contextualQuestions } from "@/data/mock/conversation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`sugg:${ip}`);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: {
    selectedAgentId?: string | null;
    selectedEntityId?: string | null;
    selectedEntityType?: "product" | "customer" | "supplier";
    language?: "en" | "bn";
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const language = body.language ?? "en";

  // Fast-path: if no OpenAI key, return the static suggestions
  if (!process.env.OPENAI_API_KEY) {
    if (body.selectedAgentId && contextualQuestions[body.selectedAgentId]) {
      return NextResponse.json({ questions: contextualQuestions[body.selectedAgentId] });
    }
    return NextResponse.json({ questions: [] });
  }

  // If no agent selected, return empty
  if (!body.selectedAgentId && !body.selectedEntityId) {
    return NextResponse.json({ questions: [] });
  }

  const ctx = buildChatContext({
    selectedAgentId: body.selectedAgentId ?? null,
    selectedEntityId: body.selectedEntityId ?? null,
    selectedEntityType: body.selectedEntityType ?? null,
    language,
  });

  const agentName =
    mockAgents.find((a) => a.id === body.selectedAgentId)?.name ?? "Unknown";

  try {
    const client = openai();
    const ctxString = serializeContext(ctx);

    const { result: completion } = await withModelFallback(
      MODELS.struct(),
      (model) =>
        client.chat.completions.create({
          model,
          messages: [
            { role: "system", content: SUGGESTIONS_INSTRUCTIONS },
            {
              role: "user",
              content:
                `Selected agent: ${agentName}\n` +
                `Selected entity: ${body.selectedEntityId ?? "(none)"}\n` +
                `Language: ${language}\n\n` +
                `Context payload (truncated):\n${ctxString.slice(0, 5000)}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "suggested_questions",
              strict: true,
              schema: SUGGESTIONS_JSON_SCHEMA,
            },
          },
          ...completionBudget({ maxCompletionTokens: 600 }),
        })
    );

    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as {
      questions?: Array<{
        id: string;
        text: string;
        category: string;
        reportType?: string;
        involvedAgents: string[];
      }>;
    };

    return NextResponse.json({ questions: parsed.questions ?? [] });
  } catch (err) {
    // Fallback to static suggestions on any LLM error
    console.warn("[suggestions] LLM failed, falling back to static:", err);
    if (body.selectedAgentId && contextualQuestions[body.selectedAgentId]) {
      return NextResponse.json({ questions: contextualQuestions[body.selectedAgentId] });
    }
    return NextResponse.json({ questions: [] });
  }
}
