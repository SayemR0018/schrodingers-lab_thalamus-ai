/**
 * Composes the full ChatContextPayload from all slices. This is the
 * single source of truth for "what the LLM sees" per request.
 */
import { buildBusinessContextSlice, type BusinessContextSlice } from "./buildBusinessContext";
import {
  buildEntityContext,
  type EntityContextSlice,
} from "./buildEntityContext";
import { buildAgentsContext, type AgentsContextSlice } from "./buildAgentsContext";
import { buildDemoSummary, type DemoSummarySlice } from "./buildDemoSummary";
import {
  buildConversationContext,
  type ConversationContextSlice,
} from "./buildConversationContext";

export interface ChatContextPayload {
  business: BusinessContextSlice;
  datasetVersion: string;
  selectedAgent?: string;
  selectedEntity?: EntityContextSlice;
  agents: AgentsContextSlice;
  demo: DemoSummarySlice;
  conversation: ConversationContextSlice;
  language: "en" | "bn";
}

export interface BuildContextInput {
  selectedAgentId?: string | null;
  selectedEntityId?: string | null;
  selectedEntityType?: "product" | "customer" | "supplier" | null;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  language?: "en" | "bn";
}

export function buildChatContext(input: BuildContextInput = {}): ChatContextPayload {
  const business = buildBusinessContextSlice();
  const agents = buildAgentsContext();
  const demo = buildDemoSummary();
  const conversation = buildConversationContext(input.history ?? []);

  const selectedEntity =
    input.selectedEntityId && input.selectedEntityType
      ? buildEntityContext(input.selectedEntityId, input.selectedEntityType) ?? undefined
      : undefined;

  return {
    business,
    datasetVersion: business.datasetVersion,
    selectedAgent: input.selectedAgentId ?? undefined,
    selectedEntity,
    agents,
    demo,
    conversation,
    language: input.language ?? "en",
  };
}

/**
 * Serialize the context to a compact JSON string for injection into
 * system prompts. We use a deterministic key order to minimize token
 * churn across requests.
 */
export function serializeContext(ctx: ChatContextPayload): string {
  // Strip the conversation history (it goes in as separate messages, not
  // into the system prompt) and language (already part of instructions).
  const { conversation, language, ...payload } = ctx;
  void conversation;
  void language;
  return JSON.stringify(payload, null, 2);
}

export type { BusinessContextSlice, EntityContextSlice, AgentsContextSlice, DemoSummarySlice, ConversationContextSlice };
