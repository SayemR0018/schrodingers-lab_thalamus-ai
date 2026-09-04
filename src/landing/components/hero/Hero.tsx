"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { heroContent } from "@/landing/data/landing";
import { GlassButton } from "@/landing/components/ui/GlassButton";
import { NeuralNetwork } from "@/landing/components/hero/NeuralNetwork";
import { useReducedMotion } from "@/landing/hooks/useReducedMotion";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";
import { WORKSPACE_HREF } from "@/landing/lib/product-app-url";

const fallbackQuestions = heroContent.questions;

export function Hero() {
  const hostRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  // Bengali question snippets; the English set already lives in `heroContent.questions`.
  const questionsBn = [
    "এই মাসে আমার বিক্রয় কেন কমেছে?",
    "কোন পণ্যটি আমার প্রমোট করা উচিত?",
    "আমার কী রিস্টক করা উচিত?",
    "গ্রাহকরা কেন চলে যাচ্ছে?",
  ];
  const questions = isBn ? questionsBn : fallbackQuestions;

  useEffect(() => {
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveQuestion((current) => (current + 1) % questions.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [reducedMotion, questions.length]);

  return (
    <section
      id="top"
      ref={hostRef}
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <NeuralNetwork hostRef={hostRef} />
      <div
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, var(--background) 0%, color-mix(in srgb, var(--background) 82%, transparent) 48%, transparent 78%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, var(--background) 0%, color-mix(in srgb, var(--background) 72%, transparent) 42%, transparent 72%)",
        }}
      />

      <div className="container-page relative grid min-h-[calc(100svh-64px)] items-center py-16 lg:grid-cols-[minmax(0,1fr)_0.7fr] lg:py-20">
        <div className="max-w-xl">
          <p className={cn("eyebrow mb-6", isBn && "lang-bn")}>
            <span aria-hidden="true">#</span>
            {t("hero.eyebrow")}
          </p>
          <h1
            id="hero-heading"
            className={cn(
              "text-[52px] font-semibold leading-[0.92] tracking-[-0.05em] sm:text-7xl lg:text-[88px]",
              isBn && "lang-bn"
            )}
          >
            THALAMUS{" "}
            <span className="text-accent">AI</span>
          </h1>
          <p
            className={cn(
              "mt-7 max-w-xl text-[19px] font-medium leading-7 tracking-[-0.02em] text-foreground sm:text-2xl sm:leading-8",
              isBn && "lang-bn"
            )}
          >
            {t("hero.heading")}
          </p>
          <p
            className={cn(
              "mt-5 max-w-lg text-[15px] leading-7 text-muted",
              isBn && "lang-bn"
            )}
          >
            {t("hero.body")}
          </p>
          <div
            className="glass mt-7 inline-flex max-w-full items-center gap-3 rounded-2xl px-4 py-3"
            aria-live="polite"
          >
            <span
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-strong)] text-accent"
              aria-hidden="true"
            >
              <Play size={11} fill="currentColor" />
            </span>
            <div>
              <p
                className={cn(
                  "text-[10px] font-semibold tracking-[0.16em] text-muted uppercase",
                  isBn && "lang-bn"
                )}
              >
                {t("hero.questionLabel")}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-sm font-medium",
                  isBn && "lang-bn"
                )}
              >
                {questions[activeQuestion]}
              </p>
            </div>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <GlassButton href={WORKSPACE_HREF} arrow>
              {t("hero.primaryCta")}
            </GlassButton>
            <GlassButton href="#how-it-works" variant="secondary">
              {t("hero.secondaryCta")}
            </GlassButton>
          </div>
          <a
            href="#questions"
            className={cn(
              "mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground",
              isBn && "lang-bn"
            )}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--border-strong)] text-accent">
              <Play size={10} fill="currentColor" />
            </span>
            {t("common.seeRealQuestions")}
          </a>
        </div>
      </div>
    </section>
  );
}
