"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisStage } from "@/store/app.store";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";

interface ProcessingStage {
  id: AnalysisStage;
  key: string;
}

const stages: ProcessingStage[] = [
  { id: "understanding", key: "assistant.processing.understanding" },
  { id: "context", key: "assistant.processing.context" },
  { id: "analysis", key: "assistant.processing.analysis" },
  { id: "synthesis", key: "assistant.processing.synthesis" },
  { id: "complete", key: "assistant.processing.complete" },
];

interface ProcessingIndicatorProps {
  currentStage: AnalysisStage;
  activeAgents?: string[];
}

export function ProcessingIndicator({ currentStage, activeAgents }: ProcessingIndicatorProps) {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  if (currentStage === "idle") return null;

  const currentIndex = stages.findIndex((s) => s.id === currentStage);

  return (
    <div className="glass rounded-xl p-4">
      <div className="space-y-2">
        {stages.map((stage, index) => {
          const isComplete = index < currentIndex || currentStage === "complete";
          const isCurrent = index === currentIndex && currentStage !== "complete";
          const isPending = index > currentIndex;

          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-center gap-3 text-sm transition-opacity",
                isPending && "opacity-40"
              )}
            >
              <div className="flex h-5 w-5 items-center justify-center">
                {isComplete ? (
                  <Check className="h-4 w-4 text-success" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-foreground-subtle" />
                )}
              </div>
              <span
                className={cn(
                  bengaliClass,
                  isComplete && "text-foreground",
                  isCurrent && "text-foreground font-medium",
                  isPending && "text-foreground-subtle"
                )}
              >
                {t(stage.key)}
              </span>
            </div>
          );
        })}
      </div>

      {activeAgents && activeAgents.length > 0 && currentStage !== "complete" && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className={cn("text-xs text-foreground-subtle mb-2", bengaliClass)}>
            {t("assistant.processing.agentsInvolved")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {activeAgents.map((agentId) => (
              <span
                key={agentId}
                className={cn("text-xs px-2 py-0.5 rounded-full bg-accent-soft text-accent", bengaliClass)}
              >
                {formatAgentName(agentId)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatAgentName(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
