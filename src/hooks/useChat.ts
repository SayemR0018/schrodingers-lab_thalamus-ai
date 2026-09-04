"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/app.store";
import { useDataStore } from "@/store/data.store";
import { chatService } from "@/services/chat.service";
import { useStreamingMessage } from "./useStreamingMessage";
import type { ChatContext } from "@/lib/chat/types";

/**
 * High-level chat hook used by the AssistantPanel. Encapsulates:
 *   - sending a user message
 *   - streaming the response
 *   - business-info detection
 *   - error handling
 */
export function useChat() {
  const language = useAppStore((s) => s.language);
  const selectedAgentId = useAppStore((s) => s.selectedAgentId);
  const selectedEntityId = useAppStore((s) => s.selectedEntityId);
  const addMessage = useAppStore((s) => s.addMessage);
  const addBusinessInfo = useDataStore((s) => s.addBusinessInfo);
  const stream = useStreamingMessage();

  const buildContext = useCallback(
    (): ChatContext => ({
      selectedAgentId,
      selectedEntityId,
      language,
    }),
    [selectedAgentId, selectedEntityId, language]
  );

  /**
   * Send a free-form message. Adds the user bubble, then attempts
   * business-info detection, then runs the orchestrator stream.
   */
  const sendMessage = useCallback(
    async (content: string) => {
      // 1. Add the user message
      addMessage({
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: "Just now",
      });

      // 2. Detect business info (server-side, LLM-driven)
      try {
        const detected = await chatService.detectBusinessInfo(content);
        if (detected) {
          addMessage({
            id: `assistant-info-${Date.now()}`,
            role: "assistant",
            content:
              (language === "bn"
                ? "আমি একটি নতুন ব্যবসায়িক তথ্য সনাক্ত করেছি:\n\n"
                : "I detected new business information:\n\n") +
              `**${detected.key}**\n${detected.value}`,
            timestamp: "Just now",
            action: {
              label: language === "bn" ? "ব্যবসায়িক ডেটায় যোগ করুন" : "Add to Business Data",
              type: "action",
            },
            dataContribution: { key: detected.key, value: detected.value },
          });
          return;
        }
      } catch (err) {
        console.warn("[chat] detectBusinessInfo failed:", err);
      }

      // 3. Otherwise, run the orchestrator stream
      await stream.start(content, buildContext());
    },
    [addMessage, language, stream, buildContext]
  );

  /**
   * Send a click from a suggested question.
   * Behaves like sendMessage but with a pre-set report mapping for
   * the static suggested-questions that have one.
   */
  const sendSuggested = useCallback(
    async (text: string) => {
      await sendMessage(text);
    },
    [sendMessage]
  );

  return {
    sendMessage,
    sendSuggested,
    cancel: stream.cancel,
    isStreaming: stream.isStreaming,
    streamingMessageId: stream.streamingMessageId,
    streamingContent: stream.streamingContent,
    addBusinessInfo,
  };
}
