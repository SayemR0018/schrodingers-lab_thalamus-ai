/**
 * Wire types for the chat layer. The frontend talks to /api/* through
 * `chat.service.ts`; this module only defines the shapes.
 */
import type { AnalysisStage } from "@/store/app.store";
import type { ConversationMessage, SuggestedQuestion } from "@/services/types";

export type AgentId =
  | "sales-analyst"
  | "marketing-agent"
  | "inventory-agent"
  | "customer-success"
  | "finance-agent"
  | "automation-agent"
  | "policy-docs-agent";

export interface ChatContext {
  /** Active agent if the user clicked one in the Business Brain. */
  selectedAgentId?: AgentId | string | null;
  /** Active entity if the user clicked a node. */
  selectedEntityId?: string | null;
  selectedEntityType?: "product" | "customer" | "supplier";
  /** Recent conversation history (last 10 turns). */
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  /** User-typed language. Drives the response script. */
  language?: "en" | "bn";
}

export interface BusinessInfo {
  key: string;
  value: string;
  category?:
    | "supplier"
    | "return"
    | "shipping"
    | "market"
    | "order"
    | "discount"
    | "other";
  confidence?: number;
}

export interface ChatStreamHandlers {
  onStage: (stage: AnalysisStage, activeAgents: string[]) => void;
  onToken: (delta: string) => void;
  onComplete: (final: ConversationMessage, reportId?: string) => void;
  onError: (err: ChatError) => void;
}

export interface ChatError {
  code: string;
  message: string;
}

export interface ChatService {
  stream(
    params: {
      conversationId: string;
      userMessage: string;
      context: ChatContext;
      signal?: AbortSignal;
    } & ChatStreamHandlers
  ): Promise<void>;

  invokeAgent(params: {
    agentId: AgentId;
    userMessage: string;
    context: ChatContext;
  }): Promise<{ agentId: string; note: string; messageId: string }>;

  getSuggestedQuestions(ctx: ChatContext): Promise<SuggestedQuestion[]>;

  detectBusinessInfo(text: string): Promise<BusinessInfo | null>;

  getContextSummary(ctx: ChatContext): Promise<string>;
}

export type { SuggestedQuestion };
