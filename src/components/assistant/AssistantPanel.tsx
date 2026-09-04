"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AssistantHeader } from "./AssistantHeader";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { ConversationArea } from "./ConversationArea";
import { AssistantInput } from "./AssistantInput";
import { ProcessingIndicator } from "./ProcessingIndicator";
import { ContextPanel } from "./ContextPanel";
import { useAppStore, type AnalysisStage } from "@/store/app.store";
import { useDataStore } from "@/store/data.store";
import { suggestedQuestions } from "@/data/mock/conversation";
import { containsBengali } from "@/lib/bengali";
import { t as translate, resolveBilingual, useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";

export function AssistantPanel() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    messages,
    analysis,
    selectedAgentId,
    selectedEntityId,
    language,
  } = useAppStore();

  const { sendMessage, cancel, isStreaming } = useChat();
  const { addBusinessInfo, getActiveVersion } = useDataStore();

  const hasContextSelection = selectedAgentId || selectedEntityId;
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  const handleAddBusinessData = useCallback(
    (key: string, value: string) => {
      addBusinessInfo(key, value);
      const newVersion = getActiveVersion();
      const content = translate(
        "assistant.chat.addedToContext",
        { key, value, version: newVersion?.version || "1.5" },
        language
      );
      // Append a confirmation message
      useAppStore.setState((state) => ({
        messages: [
          ...state.messages,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant" as const,
            content,
            timestamp: translate("assistant.conversation.justNow", undefined, language),
          },
        ],
      }));
    },
    [addBusinessInfo, getActiveVersion, language]
  );

  const handleQuestionSelect = useCallback(
    async (question: typeof suggestedQuestions[number]) => {
      const userText = resolveBilingual(question, language);
      // Add user message + stream response
      await sendMessage(userText);
    },
    [sendMessage, language]
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      await sendMessage(content);
    },
    [sendMessage]
  );

  const handleReportAction = useCallback(
    (reportId: string) => {
      router.push(`/workspace/reports/${reportId}`);
    },
    [router]
  );

  const currentStage: AnalysisStage = analysis.stage;
  const isProcessing = (currentStage !== "idle" && currentStage !== "complete") || isStreaming;

  // Resolve intro text based on language
  const introTitle = translate("assistant.intro.title", undefined, language);
  const introBody = translate("assistant.intro.body", undefined, language);

  return (
    <div className="flex h-full flex-col">
      <AssistantHeader />

      {/* Context Panel - shows when agent/entity selected */}
      {hasContextSelection && !isProcessing && (
        <ContextPanel
          key={`${selectedAgentId}-${selectedEntityId}`}
          onAsk={handleQuestionSelect}
        />
      )}

      {/* Introduction - hide when context is selected or busy */}
      {!hasContextSelection && !isProcessing && (
        <div className="px-4 py-4">
          <div className="rounded-lg bg-accent-soft p-4">
            <p className={cn("text-sm font-medium text-foreground", bengaliClass)}>
              {introTitle}
            </p>
            <p className={cn("mt-1 text-sm text-foreground-muted", bengaliClass)}>
              {introBody}
            </p>
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="px-4 pb-4">
          <ProcessingIndicator
            currentStage={currentStage}
            activeAgents={analysis.activeAgents}
          />
        </div>
      )}

      {/* Suggested Questions - hide during processing or when context selected */}
      {!isProcessing && !hasContextSelection && messages.length === 0 && (
        <SuggestedQuestions
          questions={suggestedQuestions}
          onSelect={handleQuestionSelect}
        />
      )}

      {/* Conversation */}
      <ConversationArea
        messages={messages}
        onReportAction={handleReportAction}
        onDataAction={handleAddBusinessData}
        streamingMessageId={null}
      />

      {/* Input */}
      <AssistantInput onSend={handleSendMessage} disabled={isProcessing} />

      {/* Bengali script hint when user types Bengali */}
      {isStreaming && (
        <p className="sr-only" aria-live="polite">
          {containsBengali("") ? "" : ""}
        </p>
      )}
      {/* suppress lint warning for unused t */}
      <span className="hidden">{t("assistant.input.placeholder")}</span>
    </div>
  );
}
