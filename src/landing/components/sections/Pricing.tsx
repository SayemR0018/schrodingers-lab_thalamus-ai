"use client";

import { GlassButton } from "@/landing/components/ui/GlassButton";
import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

export function Pricing() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <section
      id="pricing"
      className="py-20 sm:py-28"
      aria-labelledby="pricing-heading"
    >
      <SectionReveal className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className={cn("eyebrow", isBn && "lang-bn")}>{t("pricing.eyebrow")}</p>
          <h2
            id="pricing-heading"
            className={cn(
              "mt-4 text-3xl font-semibold tracking-tight sm:text-4xl",
              isBn && "lang-bn"
            )}
          >
            {t("pricing.heading")}
          </h2>
          <p className={cn("mx-auto mt-5 max-w-lg text-[15px] leading-7 text-muted", isBn && "lang-bn")}>
            {t("pricing.body")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <GlassButton href="/onboarding" arrow>
              {t("pricing.primaryCta")}
            </GlassButton>
            <GlassButton href="#how-it-works" variant="secondary">
              {t("pricing.secondaryCta")}
            </GlassButton>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
