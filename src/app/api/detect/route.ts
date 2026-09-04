/**
 * POST /api/detect
 *
 * Structured business-info extractor. Replaces the brittle regex
 * detector that previously lived in AssistantPanel.tsx.
 *
 * Body: { text: string }
 *
 * Response: { isBusinessInfo: boolean, key?, value?, category?, confidence? }
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { openai, MODELS } from "@/lib/openai/client";
import { withModelFallback } from "@/lib/openai/engine";
import { DETECTION_INSTRUCTIONS, DETECTION_JSON_SCHEMA } from "@/lib/openai/prompts/detection.system";
import { rateLimit, getClientIp } from "@/lib/openai/safety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`detect:${ip}`);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const text = (body.text ?? "").trim();
  if (!text) {
    return NextResponse.json({ isBusinessInfo: false });
  }

  // Fast-path: if no OpenAI key, return false
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ isBusinessInfo: false });
  }

  try {
    const client = openai();
    const { result: completion } = await withModelFallback(
      MODELS.struct(),
      (model) =>
        client.chat.completions.create({
          model,
          messages: [
            { role: "system", content: DETECTION_INSTRUCTIONS },
            { role: "user", content: text },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "business_info_detection",
              strict: true,
              schema: DETECTION_JSON_SCHEMA,
            },
          },
          max_completion_tokens: 200,
        })
    );

    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch (err) {
    console.warn("[detect] failed:", err);
    return NextResponse.json({ isBusinessInfo: false });
  }
}
