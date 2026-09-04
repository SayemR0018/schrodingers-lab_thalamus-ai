/**
 * Lightweight SSE client. Reads an `event:` / `data:` chunked stream
 * and dispatches named events to the supplied handler.
 *
 * Usage:
 *   const controller = new AbortController();
 *   const client = new StreamClient("/api/chat/stream", body, controller.signal);
 *   client.on("token", (data) => ...);
 *   await client.run();
 */
import type { ChatError } from "./types";

// Generic event handler — accepts any payload shape.
export type Handler<T = unknown> = (data: T) => void;

export class StreamClient {
  private handlers: Record<string, Handler<unknown>[]> = {};
  private controller: AbortController;

  constructor(
    private url: string,
    private body: unknown,
    signal?: AbortSignal
  ) {
    this.controller = new AbortController();
    if (signal) {
      signal.addEventListener("abort", () => this.controller.abort());
    }
  }

  on<T>(event: string, handler: Handler<T>): this {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler as Handler<unknown>);
    return this;
  }

  abort(): void {
    this.controller.abort();
  }

  private emit(event: string, data: unknown): void {
    const list = this.handlers[event] ?? [];
    for (const h of list) h(data);
  }

  async run(): Promise<void> {
    let response: Response;
    try {
      response = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.body),
        signal: this.controller.signal,
      });
    } catch (err) {
      const chatErr: ChatError = {
        code: "network_error",
        message: err instanceof Error ? err.message : String(err),
      };
      this.emit("error", chatErr);
      return;
    }

    if (!response.ok) {
      // Try to parse a structured error
      let code = "http_error";
      let message = `HTTP ${response.status}`;
      try {
        const text = await response.text();
        const parsed = JSON.parse(text);
        code = parsed.error ?? code;
        message = parsed.message ?? message;
      } catch {
        // ignore
      }
      const chatErr: ChatError = { code, message };
      this.emit("error", chatErr);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      this.emit("error", {
        code: "no_stream",
        message: "Response has no readable body",
      });
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE event blocks are separated by blank lines
        const blocks = buffer.split("\n\n");
        // Keep the last (possibly incomplete) block in the buffer
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          this.parseBlock(block);
        }
      }
    } catch (err) {
      this.emit("error", {
        code: "stream_error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  private parseBlock(block: string): void {
    let eventName = "message";
    const dataLines: string[] = [];

    for (const raw of block.split("\n")) {
      if (!raw) continue;
      if (raw.startsWith(":")) continue; // comment
      const colonIdx = raw.indexOf(":");
      const field = colonIdx === -1 ? raw : raw.slice(0, colonIdx);
      const value = colonIdx === -1 ? "" : raw.slice(colonIdx + 1).trimStart();

      if (field === "event") {
        eventName = value || "message";
      } else if (field === "data") {
        dataLines.push(value);
      }
    }

    if (dataLines.length === 0) return;
    const dataStr = dataLines.join("\n");

    let parsed: unknown = dataStr;
    try {
      parsed = JSON.parse(dataStr);
    } catch {
      // keep raw string
    }

    this.emit(eventName, parsed);
  }
}
