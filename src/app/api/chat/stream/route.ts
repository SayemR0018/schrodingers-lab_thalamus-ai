/**
 * POST /api/chat/stream
 *
 * Streams a THALAMUS AI completion via Server-Sent Events.
 *
 * Body:
 *   {
 *     message: string,
 *     selectedAgentId?: string,
 *     language?: "en" | "bn"
 *   }
 *
 * Response: `text/event-stream` emitting `stage`, `token`, `done`, `error`.
 * Drives `ProcessingIndicator` and `AgentActivityLog` on the frontend.
 */
import { NextRequest } from "next/server";
import { getOpenAIClient, LIMITS, completionBudget } from "@/lib/openai/client";
import { selectModel, withModelFallback } from "@/lib/openai/engine";
import { normalizeAgentId } from "@/lib/openai/schema";
import { sseEvent, sseError } from "@/lib/openai/stream";
import { buildBusinessContext } from "@/lib/openai/context/buildBusinessContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message, selectedAgentId, language = "en" } = await req.json();

    if (!message?.trim()) {
      return new Response(sseError("bad_request", "Query is required"), {
        status: 400,
        headers: { "Content-Type": "text/event-stream; charset=utf-8" },
      });
    }

    const agent = normalizeAgentId(selectedAgentId);
    const targetModel = selectModel(agent);
    const openai = getOpenAIClient();
    const context = buildBusinessContext({
      selectedAgentId: agent,
      language,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(
              sseEvent("stage", {
                stage: "understanding",
                activeAgents: [agent],
                model: targetModel,
              })
            )
          );
          controller.enqueue(
            encoder.encode(
              sseEvent("stage", { stage: "context", activeAgents: [agent] })
            )
          );
          controller.enqueue(
            encoder.encode(sseEvent("stage", { stage: "analysis" }))
          );

          const {
            result: completionStream,
            didFallback,
            usedModel,
          } = await withModelFallback(targetModel, (model) =>
            openai.chat.completions.create({
              model,
              stream: true,
              ...completionBudget({
                maxCompletionTokens: LIMITS.chat(),
              }),
              messages: [
                {
                  role: "system",
                  content: `You are THALAMUS (${agent}). Answer using Bangladeshi Taka (৳/BDT), referencing local entities in ${
                    language === "bn" ? "Bangla" : "English"
                  }.`,
                },
                {
                  role: "user",
                  content: `BUSINESS CONTEXT:\n${JSON.stringify(
                    context
                  )}\n\nUSER QUERY:\n${message}`,
                },
              ],
            })
          );

          controller.enqueue(
            encoder.encode(sseEvent("stage", { stage: "synthesis" }))
          );

          let fullText = "";
          for await (const chunk of completionStream) {
            const token = chunk.choices[0]?.delta?.content || "";
            if (token) {
              fullText += token;
              controller.enqueue(
                encoder.encode(sseEvent("token", { delta: token }))
              );
            }
          }

          controller.enqueue(
            encoder.encode(
              sseEvent("done", {
                fullContent: fullText,
                agent,
                model: usedModel,
                requestedModel: targetModel,
                "X-Thalamus-Fallback": didFallback,
              })
            )
          );
          controller.close();
        } catch (err: unknown) {
          controller.enqueue(
            encoder.encode(
              sseError(
                "stream_failure",
                err instanceof Error ? err.message : String(err)
              )
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    return new Response(
      sseError(
        "server_error",
        error instanceof Error ? error.message : String(error)
      ),
      {
        status: 500,
        headers: { "Content-Type": "text/event-stream; charset=utf-8" },
      }
    );
  }
}
