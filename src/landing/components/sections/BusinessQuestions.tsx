"use client";

import { useState } from "react";
import { businessQuestions } from "@/landing/data/landing";
import { cn } from "@/landing/lib/cn";
import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";

const questionKeys = ["sales-change", "restock", "customer-churn", "automation"] as const;
type QuestionKey = (typeof questionKeys)[number];

// `businessQuestions[i].id` ↔ `questionKeys[i]`
const idToKey: Record<string, QuestionKey> = {
  "sales-change": "sales-change",
  restock: "restock",
  "customer-churn": "customer-churn",
  automation: "automation",
};

export function BusinessQuestions() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const [activeQuestion, setActiveQuestion] = useState<QuestionKey>("sales-change");
  const activeKey = activeQuestion;

  return (
    <section id="questions" className="py-20 sm:py-28" aria-labelledby="questions-heading">
      <div className="container-page">
        <SectionReveal>
          <p className={cn("eyebrow", isBn && "lang-bn")}>{t("questions.eyebrow")}</p>
          <h2
            id="questions-heading"
            className={cn(
              "mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl",
              isBn && "lang-bn"
            )}
          >
            {t("questions.heading")}
          </h2>
          <p className={cn("mt-5 max-w-2xl text-[15px] leading-7 text-muted", isBn && "lang-bn")}>
            {t("questions.body")}
          </p>
        </SectionReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <SectionReveal delayMs={60}>
            <div className="grid gap-3">
              {businessQuestions.map((item, index) => {
                const key = questionKeys[index];
                const isActive = key === activeQuestion;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveQuestion(idToKey[item.id])}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all",
                      isActive
                        ? "glass-strong border-[color:var(--border-strong)]"
                        : "border-[color:var(--border)] bg-[color:var(--surface)] hover:border-[color:var(--border-strong)]",
                    )}
                    aria-pressed={isActive}
                  >
                    <span className={cn("text-[11px] font-semibold tracking-[0.14em] text-accent uppercase", isBn && "lang-bn")}>
                      {t(`questions.questions.${key}.category`)}
                    </span>
                    <span className={cn("mt-2 block text-sm font-semibold", isBn && "lang-bn")}>
                      {t(`questions.questions.${key}.question`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </SectionReveal>

          <SectionReveal delayMs={120}>
            <article className="glass rounded-[28px] p-5 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className={cn("text-[11px] font-semibold tracking-[0.16em] text-muted uppercase", isBn && "lang-bn")}>
                  {t("questions.sampleTitle")}
                </p>
                <span className={cn("rounded-full border border-[color:var(--border-strong)] px-3 py-1 text-xs text-accent", isBn && "lang-bn")}>
                  {t("common.demo")}
                </span>
              </div>

              <h3 className={cn("text-2xl font-semibold tracking-tight", isBn && "lang-bn")}>
                {t(`questions.questions.${activeKey}.finding`)}
              </h3>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                  <p className={cn("text-[11px] font-semibold tracking-[0.14em] text-muted uppercase", isBn && "lang-bn")}>
                    {t("common.contextTitle")}
                  </p>
                  <p className={cn("mt-2 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                    {t(`questions.questions.${activeKey}.context`)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                  <p className={cn("text-[11px] font-semibold tracking-[0.14em] text-muted uppercase", isBn && "lang-bn")}>
                    {t("common.evidenceTitle")}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {(["0", "1", "2", "3"] as const).map((idx) => (
                      <li
                        key={idx}
                        className={cn("flex items-center gap-2", isBn && "lang-bn")}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-accent"
                          aria-hidden="true"
                        />
                        {t(`questions.questions.${activeKey}.evidence.${idx}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--background)] p-4">
                <p className={cn("text-[11px] font-semibold tracking-[0.14em] text-muted uppercase", isBn && "lang-bn")}>
                  {t("common.recommendationTitle")}
                </p>
                <p className={cn("mt-2 text-sm leading-6 text-foreground", isBn && "lang-bn")}>
                  {t(`questions.questions.${activeKey}.recommendation`)}
                </p>
              </div>
            </article>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
