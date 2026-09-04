/**
 * Conversation-history slice: the last N turns to send to the LLM for
 * multi-turn memory. We keep turns short and capped.
 */
export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationContextSlice {
  history: ConversationTurn[];
}

const MAX_TURNS = 10;

export function buildConversationContext(
  history: ConversationTurn[]
): ConversationContextSlice {
  const lastN = history.slice(-MAX_TURNS);
  return { history: lastN };
}
