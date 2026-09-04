/**
 * POST /api/agents/[id]/invoke
 *
 * Targeted agent invocation used by the Workforce page.
 * Routes through `runThalamusInference`, which enforces the strict
 * `THALAMUS_OUTPUT_SCHEMA` and selects between `gpt-5.6-luna` and
 * `gpt-5.6-terra` based on agent risk profile.
 *
 * Errors are mapped to structured JSON responses with appropriate
 * HTTP status codes (no generic 500s for upstream model-not-found).
 */
import { NextRequest, NextResponse } from "next/server";
import {
  runThalamusInference,
  ThalamusInferenceError,
} from "@/lib/openai/engine";
import { normalizeAgentId } from "@/lib/openai/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await req.json().catch(() => ({}))) as {
      task?: string;
      query?: string;
      userMessage?: string;
      message?: string;
      language?: "en" | "bn";
      isReport?: boolean;
    };
    const agentId = normalizeAgentId(id);
    const task = String(
      body.task ||
        body.query ||
        body.userMessage ||
        body.message ||
        "Run scheduled diagnostic review"
    ).trim();
    const language = body.language || "en";

    const result = await runThalamusInference({
      query: task,
      agentId,
      language,
      isReport: body.isReport || false,
    });

    return NextResponse.json({
      ...result,
      agentId,
      note: result.finding,
      messageId: `msg-${agentId}-${Date.now()}`,
    });
  } catch (error: unknown) {
    if (error instanceof ThalamusInferenceError) {
      console.warn(
        `[Agent Invoke] ${error.code} (model=${error.model}, status=${error.status}): ${error.message}`
      );
      return NextResponse.json(error.toJSON(), { status: error.status });
    }

    console.error("[Agent Invoke Error]:", error);
    return NextResponse.json(
      {
        error: "agent_invocation_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
