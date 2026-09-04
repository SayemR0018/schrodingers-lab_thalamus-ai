"use client";

import { useState } from "react";
import { coreProblems } from "@/landing/data/landing";
import { cn } from "@/landing/lib/cn";
import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";

const coreProblemKeys = ["fragmented", "task-centric", "automation-risk"] as const;
type CoreProblemKey = (typeof coreProblemKeys)[number];

const problemSourcesKeys = [
  "sales",
  "inventory",
  "customers",
  "marketing",
  "documents",
  "conversations",
  "suppliers",
] as const;
type ProblemSourceKey = (typeof problemSourcesKeys)[number];

export function ProblemSection() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const [activeSource, setActiveSource] = useState<ProblemSourceKey>("sales");
  const [activeProblem, setActiveProblem] = useState<CoreProblemKey>("fragmented");

  return (
    <section id="problem" className="py-20 sm:py-28" aria-labelledby="problem-heading">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
          <SectionReveal>
            <p className={cn("eyebrow", isBn && "lang-bn")}>
              {t("problems.eyebrow")}
            </p>
            <h2
              id="problem-heading"
              className={cn(
                "mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl",
                isBn && "lang-bn"
              )}
            >
              {t("problems.heading")}
            </h2>
            <p
              className={cn(
                "mt-5 max-w-lg text-[15px] leading-7 text-muted",
                isBn && "lang-bn"
              )}
            >
              {t("problems.body")}
            </p>

            <div className="mt-8 space-y-3">
              {coreProblems.map((problem, index) => {
                const key = coreProblemKeys[index];
                const isActive = key === activeProblem;
                const title = t(`problems.coreProblems.${key}.title`);
                const summary = t(`problems.coreProblems.${key}.summary`);
                const detail = t(`problems.coreProblems.${key}.detail`);

                return (
                  <button
                    key={problem.id}
                    type="button"
                    aria-expanded={isActive}
                    onClick={() => setActiveProblem(key)}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition-all",
                      isActive
                        ? "glass-strong border-[color:var(--border-strong)]"
                        : "border-[color:var(--border)] bg-[color:var(--surface)] hover:border-[color:var(--border-strong)]",
                    )}
                  >
                    <span className="font-mono text-xs tracking-[0.16em] text-accent">
                      {problem.number}
                    </span>
                    <span className={cn("mt-2 block text-sm font-semibold", isBn && "lang-bn")}>
                      {title}
                    </span>
                    <span className={cn("mt-2 block text-sm leading-6 text-muted", isBn && "lang-bn")}>
                      {isActive ? detail : summary}
                    </span>
                  </button>
                );
              })}
            </div>
          </SectionReveal>

          <SectionReveal delayMs={90}>
            <div className="glass relative overflow-hidden rounded-[28px] p-5 sm:p-8">
              <div className="pointer-events-none absolute inset-x-8 top-1/2 hidden h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--accent)_42%,transparent),transparent)] lg:block" />
              <div className="grid gap-4 sm:grid-cols-2">
                {problemSourcesKeys.map((sourceKey) => {
                  const isActive = sourceKey === activeSource;
                  const label = t(`problems.sources.${sourceKey}`);

                  return (
                    <button
                      key={sourceKey}
                      type="button"
                      onClick={() => setActiveSource(sourceKey)}
                      onFocus={() => setActiveSource(sourceKey)}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-left text-sm transition-all",
                        isActive
                          ? "border-[color:var(--accent)] bg-[color:var(--surface)] text-foreground shadow-[0_12px_28px_-24px_var(--accent-glow)]"
                          : "border-[color:var(--border)] bg-[color:var(--surface-glass)] text-muted hover:text-foreground",
                        isBn && "lang-bn",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="mx-auto mt-8 max-w-sm rounded-[24px] border border-[color:var(--border-strong)] bg-[color:var(--background)] p-5 text-center">
                <p className={cn("text-[11px] font-semibold tracking-[0.16em] text-muted uppercase", isBn && "lang-bn")}>
                  {t("common.thalamus")}
                </p>
                <h3 className={cn("mt-3 text-xl font-semibold tracking-tight", isBn && "lang-bn")}>
                  {t("problems.unifiedContextTitle")}
                </h3>
                <p className={cn("mt-3 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                  {t("problems.unifiedContextBody", {
                    source: t(`problems.sources.${activeSource}`),
                  })}
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <p className={cn("text-[11px] font-semibold tracking-[0.14em] text-muted uppercase", isBn && "lang-bn")}>
                  {t("problems.selectedChallenge")}
                </p>
                <p className={cn("mt-2 text-sm font-medium", isBn && "lang-bn")}>
                  {t(`problems.coreProblems.${activeProblem}.title`)}
                </p>
                <p className={cn("mt-1 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                  {t(`problems.coreProblems.${activeProblem}.summary`)}
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
