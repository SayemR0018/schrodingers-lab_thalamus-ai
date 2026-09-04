/**
 * Frontend chat service. Talks to /api/* route handlers via the
 * StreamClient. This is the only file UI components import to do
 * "real" chat work.
 */
import { StreamClient } from "@/lib/chat/stream-client";
import type {
  ChatContext,
  ChatService,
  ChatStreamHandlers,
  BusinessInfo,
  AgentId,
  SuggestedQuestion,
} from "@/lib/chat/types";
import type { ConversationMessage } from "@/services/types";
import type { AnalysisStage } from "@/store/app.store";

// Helper: turn a partial streamed content + meta into a final message
function makeAssistantMessage(
  content: string,
  id: string,
  reportId?: string
): ConversationMessage {
  return {
    id,
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    action: reportId
      ? { label: "Open report", type: "report", reportId }
      : undefined,
  };
}

export const chatService: ChatService = {
  async stream({
    conversationId,
    userMessage,
    context,
    signal,
    onStage,
    onToken,
    onComplete,
    onError,
  }: {
    conversationId: string;
    userMessage: string;
    context: ChatContext;
    signal?: AbortSignal;
  } & ChatStreamHandlers): Promise<void> {
    const messageId = `msg-${conversationId}-${Date.now()}`;

    const client = new StreamClient(
      "/api/chat/stream",
      {
        conversationId,
        userMessage,
        context,
        selectedAgentId: context.selectedAgentId ?? null,
        selectedEntityId: context.selectedEntityId ?? null,
        selectedEntityType: context.selectedEntityType ?? null,
        language: context.language ?? "en",
        history: context.history ?? [],
      },
      signal
    );

    let fullContent = "";
    let reportId: string | undefined;
    let hasErrored = false;

    client
      .on("stage", (data: { stage: string; activeAgents: string[] }) => {
        onStage(data.stage as AnalysisStage, data.activeAgents ?? []);
      })
      .on("token", (data: { delta: string }) => {
        fullContent += data.delta ?? "";
        onToken(data.delta ?? "");
      })
      .on("report", (data: { reportId?: string }) => {
        if (data.reportId) reportId = data.reportId;
      })
      .on("error", (data: { code: string; message: string }) => {
        hasErrored = true;
        onError({ code: data.code, message: data.message });
      })
      .on("done", (data: {
        messageId?: string;
        fullContent?: string;
        reportId?: string;
      }) => {
        if (hasErrored) return;
        const finalId = data.messageId ?? messageId;
        const finalContent = data.fullContent ?? fullContent;
        if (data.reportId) reportId = data.reportId;
        const msg = makeAssistantMessage(finalContent, finalId, reportId);
        onComplete(msg, reportId);
      });

    await client.run();
  },

  async invokeAgent({
    agentId,
    userMessage,
    context,
  }: {
    agentId: AgentId;
    userMessage: string;
    context: ChatContext;
  }) {
    const res = await fetch(`/api/agents/${agentId}/invoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage,
        language: context.language ?? "en",
        selectedEntityId: context.selectedEntityId ?? null,
        selectedEntityType: context.selectedEntityType ?? null,
      }),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as {
        message?: string;
        detail?: string;
        error?: string;
      };
      throw new Error(
        err.detail ?? err.message ?? err.error ?? `agent invoke failed (${res.status})`
      );
    }
    return (await res.json()) as {
      agentId: string;
      note: string;
      messageId: string;
    };
  },

  async getSuggestedQuestions(ctx: ChatContext): Promise<SuggestedQuestion[]> {
    const res = await fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedAgentId: ctx.selectedAgentId ?? null,
        selectedEntityId: ctx.selectedEntityId ?? null,
        selectedEntityType: ctx.selectedEntityType ?? null,
        language: ctx.language ?? "en",
      }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { questions: SuggestedQuestion[] };
    return data.questions ?? [];
  },

  async detectBusinessInfo(text: string): Promise<BusinessInfo | null> {
    const res = await fetch("/api/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<BusinessInfo> & {
      isBusinessInfo?: boolean;
    };
    if (!data?.isBusinessInfo || !data.key || !data.value) return null;
    return {
      key: data.key,
      value: data.value,
      category: data.category as BusinessInfo["category"],
      confidence: data.confidence,
    };
  },

  async getContextSummary(ctx: ChatContext): Promise<string> {
    const res = await fetch("/api/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedAgentId: ctx.selectedAgentId ?? null,
        selectedEntityId: ctx.selectedEntityId ?? null,
        selectedEntityType: ctx.selectedEntityType ?? null,
        language: ctx.language ?? "en",
      }),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return JSON.stringify(data, null, 2);
  },
};
