/**
 * Per-agent invoke service. Lightweight facade over chatService.invokeAgent
 * for pages that want to talk directly to a single agent (e.g. the
 * workforce detail page).
 */
import { chatService } from "./chat.service";
import type { AgentId, ChatContext } from "@/lib/chat/types";

export const agentInvokeService = {
  async invoke(
    agentId: AgentId,
    userMessage: string,
    context: ChatContext
  ): Promise<{ agentId: string; note: string; messageId: string }> {
    return chatService.invokeAgent({ agentId, userMessage, context });
  },
};
