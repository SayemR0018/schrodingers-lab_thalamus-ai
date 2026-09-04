"use client";

import { ArrowRight } from "lucide-react";
import type { SuggestedQuestion } from "@/services/types";
import { resolveBilingual, useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onSelect: (question: SuggestedQuestion) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  const language = useAppStore((s) => s.language);
  const { t } = useTranslation();
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  return (
    <div className="space-y-2">
      <div className="px-4">
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-wider text-foreground-subtle",
            bengaliClass
          )}
        >
          {t("assistant.suggested.heading")}
        </p>
      </div>
      <div className="space-y-1 px-2">
        {questions.map((question) => {
          const resolved = resolveBilingual(question, language);
          const questionIsBengali = language === "bn" && question.textBn;
          return (
            <button
              key={question.id}
              onClick={() => onSelect(question)}
              className={cn(
                "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                "text-sm text-foreground-muted",
                "hover:bg-surface-elevated hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                "group flex items-center justify-between"
              )}
            >
              <span className={cn(questionIsBengali && "lang-bn")}>
                {resolved}
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
