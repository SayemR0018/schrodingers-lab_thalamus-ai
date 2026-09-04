"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowUpRight, User, Sparkles, Plus, Database } from "lucide-react";
import type { ConversationMessage } from "@/store/app.store";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { renderInline } from "@/lib/markdown";
import { containsBengali } from "@/lib/bengali";
import { cn } from "@/lib/utils";
import { StreamingDot } from "./StreamingDot";

interface ConversationAreaProps {
  messages: ConversationMessage[];
  onReportAction?: (reportId: string) => void;
  onDataAction?: (key: string, value: string) => void;
  /** ID of the message currently being streamed in. */
  streamingMessageId?: string | null;
}

export function ConversationArea({
  messages,
  onReportAction,
  onDataAction,
  streamingMessageId,
}: ConversationAreaProps) {
  const [processedDataIds, setProcessedDataIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return <div className="flex-1" />;
  }

  const isBengali = language === "bn";

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
      <div className="space-y-4">
        {messages.map((message) => {
          const isStreaming = message.id === streamingMessageId;
          const messageIsBengali = containsBengali(message.content);
          const messageClass = (isBengali || messageIsBengali) ? "lang-bn" : "";

          return (
            <div key={message.id} className="space-y-2">
              {/* Message header */}
              <div className="flex items-center gap-2">
                {message.role === "user" ? (
                  <>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-elevated">
                      <User className="h-3 w-3 text-foreground-muted" />
                    </div>
                    <span className={cn("text-xs font-medium text-foreground", messageClass)}>
                      {t("assistant.conversation.you")}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft">
                      <Sparkles className="h-3 w-3 text-accent" />
                    </div>
                    <span className={cn("text-xs font-medium text-foreground", messageClass)}>
                      {t("assistant.conversation.thalamus")}
                    </span>
                  </>
                )}
                <span className="text-xs text-foreground-subtle">{message.timestamp}</span>
              </div>

              {/* Message content */}
              <div
                className={cn(
                  "rounded-lg p-3 text-sm leading-relaxed",
                  messageClass,
                  message.role === "user"
                    ? "bg-surface-elevated text-foreground"
                    : "glass text-foreground-muted"
                )}
              >
                {message.content
                  ? renderInline(message.content)
                  : !message.action && (
                      <span className="text-foreground-subtle">
                        <StreamingDot />
                      </span>
                    )}

                {/* Streaming cursor while tokens are arriving */}
                {isStreaming && message.content && <StreamingDot />}

                {/* Action button - Report */}
                {message.action && message.action.type === "report" && message.action.reportId && (
                  <button
                    onClick={() => onReportAction?.(message.action!.reportId!)}
                    className={cn(
                      "mt-3 inline-flex items-center gap-1.5 rounded-md",
                      "bg-accent text-accent-foreground px-3 py-1.5 text-xs font-medium",
                      "hover:bg-accent/90 transition-colors"
                    )}
                  >
                    {message.action.label}
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                )}

                {/* Action button - Data Contribution */}
                {message.action && message.action.type === "action" && message.dataContribution && (
                  <div className="mt-3 flex gap-2">
                    {processedDataIds.has(message.id) ? (
                      <div className={cn("flex items-center gap-1.5 text-xs text-success", messageClass)}>
                        <Database className="h-3 w-3" />
                        {t("assistant.conversation.addedToData")}
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            if (message.dataContribution) {
                              onDataAction?.(message.dataContribution.key, message.dataContribution.value);
                              setProcessedDataIds(prev => new Set(prev).add(message.id));
                            }
                          }}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md",
                            "bg-accent text-accent-foreground px-3 py-1.5 text-xs font-medium",
                            "hover:bg-accent/90 transition-colors"
                          )}
                        >
                          <Plus className="h-3 w-3" />
                          {message.action.label}
                        </button>
                        <button
                          onClick={() => setProcessedDataIds(prev => new Set(prev).add(message.id))}
                          className={cn(
                            "px-3 py-1.5 text-xs text-foreground-muted hover:text-foreground",
                            messageClass
                          )}
                        >
                          {t("common.cancel")}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
