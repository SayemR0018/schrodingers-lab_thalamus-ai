"use client";

import { useState } from "react";
import { businessFirstFlow } from "@/landing/data/landing";
import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

const flowKeys = [
  "information",
  "understanding",
  "knowledge",
  "needs",
  "workforce",
] as const;

export function HowItWorks() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const [activeStep, setActiveStep] = useState(0);
  const activeKey = flowKeys[activeStep];

  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28"
      aria-labelledby="how-heading"
    >
      <div className="container-page">
        <SectionReveal>
          <p className={cn("eyebrow", isBn && "lang-bn")}>{t("howItWorks.eyebrow")}</p>
          <h2
            id="how-heading"
            className={cn(
              "mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl",
              isBn && "lang-bn"
            )}
          >
            {t("howItWorks.heading")}
          </h2>
          <p
            className={cn(
              "mt-5 max-w-2xl text-[15px] leading-7 text-muted",
              isBn && "lang-bn"
            )}
          >
            {t("howItWorks.subtitle")}
          </p>
        </SectionReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12">
          <SectionReveal delayMs={60}>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                <p className={cn("text-[11px] font-semibold tracking-[0.16em] text-muted uppercase", isBn && "lang-bn")}>
                  {t("howItWorks.traditionalHeading")}
                </p>
                <p className={cn("mt-3 text-lg font-semibold tracking-tight", isBn && "lang-bn")}>
                  {t("howItWorks.traditionalQuestion")}
                </p>
                <p className={cn("mt-2 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                  {t("howItWorks.traditionalBody")}
                </p>
              </div>
              <div className="glass-strong rounded-2xl p-5">
                <p className={cn("text-[11px] font-semibold tracking-[0.16em] text-accent uppercase", isBn && "lang-bn")}>
                  {t("howItWorks.thalamusHeading")}
                </p>
                <p className={cn("mt-3 text-lg font-semibold tracking-tight", isBn && "lang-bn")}>
                  {t("howItWorks.thalamusQuestion")}
                </p>
                <p className={cn("mt-2 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                  {t("howItWorks.thalamusBody")}
                </p>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delayMs={120}>
            <div className="glass relative overflow-hidden rounded-[28px] p-5 sm:p-7">
              <ol className="grid gap-3">
                {businessFirstFlow.map((step, index) => {
                  const isActive = index === activeStep;
                  const key = flowKeys[index];

                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => setActiveStep(index)}
                        onFocus={() => setActiveStep(index)}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                          isActive
                            ? "border-[color:var(--accent)] bg-[color:var(--surface)]"
                            : "border-[color:var(--border)] bg-transparent hover:bg-[color:var(--surface)]",
                        )}
                        aria-pressed={isActive}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-strong)] font-mono text-xs text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className={cn("block text-sm font-semibold", isBn && "lang-bn")}>
                            {t(`howItWorks.flow.${key}.label`)}
                          </span>
                          <span className={cn("mt-1 block text-sm leading-6 text-muted", isBn && "lang-bn")}>
                            {isActive
                              ? t(`howItWorks.flow.${key}.body`)
                              : t("howItWorks.selectToReveal")}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-6 rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--background)] p-5">
                <p className={cn("text-[11px] font-semibold tracking-[0.16em] text-muted uppercase", isBn && "lang-bn")}>
                  {t("howItWorks.activeStage")}
                </p>
                <h3 className={cn("mt-2 text-xl font-semibold tracking-tight", isBn && "lang-bn")}>
                  {t(`howItWorks.flow.${activeKey}.label`)}
                </h3>
                <p className={cn("mt-2 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                  {t(`howItWorks.flow.${activeKey}.body`)}
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
