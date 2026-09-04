/**
 * Server-Sent Events (SSE) helpers for streaming OpenAI completions
 * back to the browser.
 *
 * The frontend hook subscribes to the named events:
 *   - stage     {stage: AnalysisStage, activeAgents: string[]}
 *   - agent     {id: string, state: "working" | "done"}
 *   - token     {delta: string}
 *   - business_info {key, value}
 *   - report    {reportId, payload?}
 *   - done      {messageId, fullContent, reportId?}
 *   - error     {code, message}
 *
 * Two flavours of every helper exist:
 *   - `sseEvent` / `sseError`         → string  (per spec for new BD routes)
 *   - `sseEventBytes` / `sseErrorBytes` → Uint8Array (legacy orchestrator path)
 */
export type SseEventName =
  | "stage"
  | "agent"
  | "token"
  | "business_info"
  | "report"
  | "done"
  | "error";

function encode(name: string, data: unknown): string {
  return `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;
}

/** Primary helper used by `/api/chat/stream` and `/api/agents/[id]/invoke`. */
export function sseEvent(name: SseEventName, data: unknown): string {
  return encode(name, data);
}

/** Primary helper used by `/api/chat/stream` and `/api/agents/[id]/invoke`. */
export function sseError(code: string, message: string): string {
  return sseEvent("error", { code, message });
}

/**
 * Byte-returning variants for callers that pipe directly to a
 * `ReadableStream<Uint8Array>` controller.
 */
export function sseEventBytes(name: SseEventName, data: unknown): Uint8Array {
  return new TextEncoder().encode(encode(name, data));
}

export function sseErrorBytes(code: string, message: string): Uint8Array {
  return sseEventBytes("error", { code, message });
}

/**
 * Convert an async-iterable OpenAI stream into SSE-encoded Uint8Array
 * chunks. Each delta becomes a `token` event; a finish_reason becomes a
 * `done` event (we also send the final `done` with reason=stop at the end).
 */
export async function* streamChatCompletion(
  openaiStream: AsyncIterable<{
    choices?: Array<{
      delta?: { content?: string | null };
      finish_reason?: string | null;
    }>;
  }>,
  messageId: string
): AsyncGenerator<Uint8Array> {
  let fullContent = "";
  try {
    for await (const chunk of openaiStream) {
      const choice = chunk.choices?.[0];
      const delta = choice?.delta?.content;
      if (delta) {
        fullContent += delta;
        yield sseEventBytes("token", { delta });
      }
      if (choice?.finish_reason) {
        yield sseEventBytes("done", {
          messageId,
          reason: choice.finish_reason,
          fullContent,
        });
      }
    }
  } catch (err) {
    yield sseErrorBytes(
      "stream_failed",
      err instanceof Error ? err.message : String(err)
    );
  }
}

/**
 * Build a ReadableStream that yields SSE chunks. The producer can be an
 * async generator (preferred) or an async function that pushes chunks.
 */
export function toSseStream(
  producer: AsyncGenerator<Uint8Array>
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { value, done } = await producer.next();
      if (done) {
        controller.close();
        return;
      }
      if (value) controller.enqueue(value);
    },
    async cancel() {
      await producer.return(undefined);
    },
  });
}