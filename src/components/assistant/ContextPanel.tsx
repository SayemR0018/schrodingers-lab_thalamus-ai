"use client";

import { useEffect, useState } from "react";
import { X, TrendingUp, Megaphone, Package, HeartHandshake, Wallet, Cog, Network } from "lucide-react";
import { useAppStore } from "@/store/app.store";
import { mockAgents, type MockAgent } from "@/data/mock/agents";
import { mockKnowledgeGraph, mockBusiness } from "@/data/mock/business";
import { contextualQuestions } from "@/data/mock/conversation";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { SuggestedQuestion } from "@/services/types";
import { chatService } from "@/services/chat.service";

const iconMap: Record<string, React.ElementType> = {
  "sales-analyst": TrendingUp,
  "marketing-agent": Megaphone,
  "inventory-agent": Package,
  "customer-success": HeartHandshake,
  "finance-agent": Wallet,
  "automation-agent": Cog,
  "knowledge-graph": Network,
};

interface ContextPanelProps {
  onAsk: (question: SuggestedQuestion) => void;
}

export function ContextPanel({ onAsk }: ContextPanelProps) {
  const { selectedAgentId, selectedEntityId, setSelectedAgent, setSelectedEntity, language } = useAppStore();
  const { t } = useTranslation();
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  const selectedAgent: MockAgent | undefined = selectedAgentId
    ? mockAgents.find((a) => a.id === selectedAgentId)
    : undefined;

  const isKnowledgeGraph = selectedEntityId === "knowledge-graph";

  // Dynamic suggestions: fetched from /api/suggestions when present.
  // The component is keyed by `selectedAgentId` in the parent
  // (AssistantPanel) so React fully remounts it on selection change —
  // that resets state without needing setState-in-effect. By the time
  // useEffect runs, we only need to fetch the suggestions.
  const [dynamicQuestions, setDynamicQuestions] = useState<SuggestedQuestion[] | null>(null);

  useEffect(() => {
    if (!selectedAgentId) return;
    let cancelled = false;
    chatService
      .getSuggestedQuestions({
        selectedAgentId,
        language,
      })
      .then((qs) => {
        if (cancelled) return;
        setDynamicQuestions(qs.length > 0 ? qs : null);
      })
      .catch(() => {
        if (cancelled) return;
        setDynamicQuestions(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedAgentId, language]);

  // Show the dynamic suggestions once loaded; otherwise fall back to static.
  const showDynamic = dynamicQuestions !== null;

  // Get contextual questions for the selected item
  const staticQs = selectedAgentId
    ? contextualQuestions[selectedAgentId] || []
    : [];
  const questions: SuggestedQuestion[] = showDynamic && dynamicQuestions
    ? dynamicQuestions
    : staticQs;

  const handleClose = () => {
    setSelectedAgent(null);
    setSelectedEntity(null);
  };

  if (!selectedAgent && !isKnowledgeGraph) return null;

  const Icon = selectedAgentId
    ? iconMap[selectedAgentId] || Cog
    : Network;

  const agentName = selectedAgent
    ? (isBengali && selectedAgent.nameBn ? selectedAgent.nameBn : selectedAgent.name)
    : "";
  const agentDescription = selectedAgent
    ? (isBengali && selectedAgent.descriptionBn ? selectedAgent.descriptionBn : selectedAgent.description)
    : "";

  return (
    <div className="border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
            <Icon className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className={cn("font-semibold text-foreground", bengaliClass)}>
              {agentName || t("assistant.context.title")}
            </h3>
            <p className={cn("text-xs text-foreground-muted", bengaliClass)}>
              {isKnowledgeGraph
                ? mockBusiness.name
                : selectedAgent?.status === "locked"
                ? t("common.locked")
                : t("common.active")}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-elevated"
          aria-label={t("common.close")}
        >
          <X className="h-4 w-4 text-foreground-muted" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isKnowledgeGraph ? (
          <div className="space-y-3">
            <p className={cn("text-sm text-foreground-muted", bengaliClass)}>
              {t("assistant.context.description")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-surface-elevated text-center">
                <div className="font-semibold text-foreground">
                  {mockKnowledgeGraph.entities.toLocaleString()}
                </div>
                <div className={cn("text-xs text-foreground-muted", bengaliClass)}>
                  {t("assistant.context.entities")}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-surface-elevated text-center">
                <div className="font-semibold text-foreground">
                  {mockKnowledgeGraph.relations.toLocaleString()}
                </div>
                <div className={cn("text-xs text-foreground-muted", bengaliClass)}>
                  {t("assistant.context.relations")}
                </div>
              </div>
            </div>
          </div>
        ) : selectedAgent?.status === "locked" ? (
          <p className={cn("text-sm text-foreground-muted", bengaliClass)}>
            {t("assistant.context.lockedDescription")}
          </p>
        ) : (
          <>
            <p className={cn("text-sm text-foreground-muted mb-3", bengaliClass)}>
              {agentDescription}
            </p>
            {questions.length > 0 && (
              <div>
                <p className={cn("text-xs font-medium text-foreground-subtle mb-2", bengaliClass)}>
                  {t("assistant.context.askAbout", { name: agentName })}
                </p>
                <SuggestedQuestions
                  questions={questions}
                  onSelect={onAsk}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
