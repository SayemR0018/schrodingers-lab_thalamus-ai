/**
 * GET /api/agents — list the active/locked agent roster.
 */
import { NextResponse } from "next/server";
import { mockAgents } from "@/data/mock/agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({
      agents: mockAgents.map((a) => ({
        id: a.id,
        name: a.name,
        nameBn: a.nameBn,
        status: a.status,
        description: a.description,
        descriptionBn: a.descriptionBn,
        capabilities: a.capabilities,
        colorKey: a.colorKey,
        metrics: a.metrics,
      })),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "agents_list_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
