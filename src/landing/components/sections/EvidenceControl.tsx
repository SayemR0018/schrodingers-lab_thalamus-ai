"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { evidenceExample } from "@/landing/data/landing";
import { cn } from "@/landing/lib/cn";
import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";

const governanceKeys = ["low", "high"] as const;
type GovernanceKey = (typeof governanceKeys)[number];

const sourceKeys = ["0", "1", "2", "3"] as const;
const basedOnKeys = ["0", "1", "2", "3"] as const;

export function EvidenceControl() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const [showEvidence, setShowEvidence] = useState(false);
  const [activePath, setActivePath] = useState<GovernanceKey>("high");

  return (
    <section id="governance" className="py-20 sm:py-28" aria-labelledby="governance-heading">
      <div className="container-page">
        <SectionReveal>
          <p className={cn("eyebrow", isBn && "lang-bn")}>{t("governance.eyebrow")}</p>
          <h2
            id="governance-heading"
            className={cn(
              "mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl",
              isBn && "lang-bn"
            )}
          >
            {t("governance.heading")}
          </h2>
          <p className={cn("mt-5 max-w-2xl text-[15px] leading-7 text-muted", isBn && "lang-bn")}>
            {t("governance.subtitle")}
          </p>
        </SectionReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <SectionReveal delayMs={60}>
            <article className="glass rounded-[28px] p-5 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className={cn("text-[11px] font-semibold tracking-[0.16em] text-muted uppercase", isBn && "lang-bn")}>
                  {t("governance.evidence.label")}
                </p>
                <span className={cn("rounded-full border border-[color:var(--border-strong)] px-3 py-1 text-xs text-accent", isBn && "lang-bn")}>
                  {t("common.demoValues")}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className={cn("text-sm text-muted", isBn && "lang-bn")}>
                    {t("governance.evidence.conclusionLabel")}
                  </p>
                  <h3 className={cn("mt-2 text-3xl font-semibold tracking-tight", isBn && "lang-bn")}>
                    {evidenceExample.conclusion}
                  </h3>
                </div>
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 text-center">
                  <p className={cn("text-[11px] font-semibold tracking-[0.14em] text-muted uppercase", isBn && "lang-bn")}>
                    {t("governance.evidence.confidenceLabel")}
                  </p>
                  <p className={cn("mt-1 text-2xl font-semibold text-accent", isBn && "lang-bn")}>
                    {evidenceExample.confidence}
                  </p>
                </div>
              </div>

              <p className={cn("mt-4 text-xs leading-5 text-muted", isBn && "lang-bn")}>
                {t("governance.evidence.note")}
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {basedOnKeys.map((idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm",
                      isBn && "lang-bn"
                    )}
                  >
                    {t(`governance.evidence.basedOn.${idx}`)}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowEvidence((value) => !value)}
                className={cn("btn btn-secondary mt-6", isBn && "lang-bn")}
                aria-expanded={showEvidence}
              >
                {showEvidence
                  ? t("common.hideEvidence")
                  : t("common.viewEvidence")}
              </button>

              {showEvidence ? (
                <div className="mt-5 grid gap-3" role="region" aria-label="Evidence details">
                  {sourceKeys.map((idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className={cn("text-sm font-semibold", isBn && "lang-bn")}>
                          {t(`governance.evidence.sources.${idx}.label`)}
                        </p>
                        <p className={cn("text-xs text-accent", isBn && "lang-bn")}>
                          {t(`governance.evidence.sources.${idx}.timestamp`)}
                        </p>
                      </div>
                      <p className={cn("mt-2 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                        {t(`governance.evidence.sources.${idx}.detail`)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          </SectionReveal>

          <SectionReveal delayMs={120}>
            <article className="glass rounded-[28px] p-5 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border-strong)] text-accent">
                  <ShieldCheck size={18} strokeWidth={1.7} />
                </span>
                <div>
                  <p className={cn("text-[11px] font-semibold tracking-[0.16em] text-muted uppercase", isBn && "lang-bn")}>
                    {t("governance.control.eyebrow")}
                  </p>
                  <h3 className={cn("mt-1 text-xl font-semibold tracking-tight", isBn && "lang-bn")}>
                    {t("governance.control.title")}
                  </h3>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <div className="grid gap-3 text-center text-sm font-medium">
                  <div className={cn("rounded-xl bg-[color:var(--background)] px-4 py-3", isBn && "lang-bn")}>
                    {t("governance.control.recommendationLabel")}
                  </div>
                  <div className="mx-auto h-8 w-px bg-[color:var(--border-strong)]" />
                  <div className={cn("rounded-xl bg-[color:var(--background)] px-4 py-3", isBn && "lang-bn")}>
                    {t("governance.control.riskEvaluationLabel")}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {governanceKeys.map((key) => {
                    const isActive = key === activePath;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActivePath(key)}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-all",
                          isActive
                            ? "border-[color:var(--accent)] bg-[color:var(--background)]"
                            : "border-[color:var(--border)] bg-transparent text-muted",
                        )}
                        aria-pressed={isActive}
                      >
                        <span className={cn("block text-sm font-semibold", isBn && "lang-bn")}>
                          {t(`governance.control.paths.${key}.label`)}
                        </span>
                        <span className={cn("mt-2 block text-sm leading-6", isBn && "lang-bn")}>
                          {t(`governance.control.paths.${key}.outcome`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--background)] p-5">
                <p className={cn("text-[11px] font-semibold tracking-[0.14em] text-muted uppercase", isBn && "lang-bn")}>
                  {t("governance.control.selectedRouteLabel")}
                </p>
                <p className={cn("mt-2 text-lg font-semibold", isBn && "lang-bn")}>
                  {t(`governance.control.paths.${activePath}.outcome`)}
                </p>
                <p className={cn("mt-2 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                  {t(`governance.control.paths.${activePath}.body`)}
                </p>
              </div>
            </article>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
