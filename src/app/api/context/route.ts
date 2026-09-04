/**
 * POST /api/context
 *
 * Build & return the full ChatContextPayload derived from demo data.
 * Useful for debugging and for clients that want to inspect the
 * context the LLM will see.
 *
 * Body: { selectedAgentId?, selectedEntityId?, selectedEntityType?, language? }
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { buildChatContext } from "@/lib/openai/context";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let body: {
      selectedAgentId?: string | null;
      selectedEntityId?: string | null;
      selectedEntityType?: "product" | "customer" | "supplier";
      language?: "en" | "bn";
    };
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const ctx = buildChatContext({
      selectedAgentId: body.selectedAgentId ?? null,
      selectedEntityId: body.selectedEntityId ?? null,
      selectedEntityType: body.selectedEntityType ?? null,
      language: body.language ?? "en",
    });

    return NextResponse.json(ctx);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "context_build_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
