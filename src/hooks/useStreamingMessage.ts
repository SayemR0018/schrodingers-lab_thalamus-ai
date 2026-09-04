"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore, type AnalysisStage, type ConversationMessage } from "@/store/app.store";
import { chatService } from "@/services/chat.service";
import type { ChatContext } from "@/lib/chat/types";

export interface UseStreamingMessage {
  streamingMessageId: string | null;
  streamingContent: string;
  start: (userMessage: string, context: ChatContext) => Promise<void>;
  cancel: () => void;
  isStreaming: boolean;
}

/**
 * Drives a streamed assistant message:
 *   - creates an empty "assistant" message immediately so the bubble
 *     appears in the conversation area
 *   - appends each token to that message's `content`
 *   - drives `analysis.stage` via the SSE `stage` events
 *
 * On error, it appends a short friendly error message and ends the
 * stream gracefully — never leaves the UI in a stuck state.
 */
export function useStreamingMessage(): UseStreamingMessage {
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const messages = useAppStore((s) => s.messages);
  const addMessage = useAppStore((s) => s.addMessage);
  const setAnalysisStage = useAppStore((s) => s.setAnalysisStage);
  const startAnalysis = useAppStore((s) => s.startAnalysis);
  const completeAnalysis = useAppStore((s) => s.completeAnalysis);
  const resetAnalysis = useAppStore((s) => s.resetAnalysis);

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const start = useCallback(
    async (userMessage: string, context: ChatContext) => {
      // 1. Reset any leftover state
      cancel();
      setStreamingContent("");

      // 2. Create the streaming message shell
      const id = `msg-streaming-${Date.now()}`;
      setStreamingMessageId(id);
      const shell: ConversationMessage = {
        id,
        role: "assistant",
        content: "",
        timestamp: "Just now",
      };
      addMessage(shell);

      // 3. AbortController for cancellation
      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);

      const conversationId = "conv-default";

      // Build a ConversationMessage[] history from current messages
      const history = messages.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      try {
        await chatService.stream({
          conversationId,
          userMessage,
          context: { ...context, history },
          signal: controller.signal,
          onStage: (stage: AnalysisStage, activeAgents: string[]) => {
            if (stage === "understanding") {
              startAnalysis(userMessage, activeAgents);
            } else if (stage === "complete") {
              // ignore — done event will follow
            } else {
              setAnalysisStage(stage);
            }
          },
          onToken: (delta) => {
            setStreamingContent((prev) => prev + delta);
            // Patch the in-shell message content via the store
            useAppStore.setState((state) => ({
              messages: state.messages.map((m) =>
                m.id === id ? { ...m, content: m.content + delta } : m
              ),
            }));
          },
          onComplete: (final, reportId) => {
            // Mark message as finished by clearing the streaming id
            useAppStore.setState((state) => ({
              messages: state.messages.map((m) =>
                m.id === id
                  ? {
                      ...m,
                      content: m.content || final.content,
                      action: final.action ??
                        (reportId
                          ? {
                              label: "Open report",
                              type: "report",
                              reportId,
                            }
                          : undefined),
                    }
                  : m
              ),
            }));
            if (reportId) {
              completeAnalysis(reportId);
            } else {
              completeAnalysis("");
            }
            setStreamingMessageId(null);
            setStreamingContent("");
            setIsStreaming(false);
          },
          onError: (err) => {
            // Append a friendly error message to the in-shell message
            useAppStore.setState((state) => ({
              messages: state.messages.map((m) =>
                m.id === id
                  ? {
                      ...m,
                      content:
                        m.content ||
                        (context.language === "bn"
                          ? "দুঃখিত, এই মুহূর্তে একটি ত্রুটি হয়েছে। আবার চেষ্টা করুন।"
                          : "Sorry, something went wrong. Please try again."),
                    }
                  : m
              ),
            }));
            resetAnalysis();
            setStreamingMessageId(null);
            setStreamingContent("");
            setIsStreaming(false);
            console.warn("[chat] stream error:", err);
          },
        });
      } catch (err) {
        console.warn("[chat] stream threw:", err);
        resetAnalysis();
        setStreamingMessageId(null);
        setIsStreaming(false);
      } finally {
        abortRef.current = null;
      }
    },
    [
      messages,
      addMessage,
      setAnalysisStage,
      startAnalysis,
      completeAnalysis,
      resetAnalysis,
      cancel,
    ]
  );

  return { streamingMessageId, streamingContent, start, cancel, isStreaming };
}
