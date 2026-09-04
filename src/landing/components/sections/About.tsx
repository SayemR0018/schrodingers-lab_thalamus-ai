"use client";

import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

export function About() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <section id="about" className="py-16 sm:py-20" aria-labelledby="about-heading">
      <SectionReveal className="container-page max-w-3xl">
        <p className={cn("eyebrow", isBn && "lang-bn")}>{t("about.eyebrow")}</p>
        <h2
          id="about-heading"
          className={cn(
            "mt-4 text-3xl font-semibold tracking-tight",
            isBn && "lang-bn"
          )}
        >
          {t("about.title")}
        </h2>
        <p className={cn("mt-5 text-[15px] leading-7 text-muted", isBn && "lang-bn")}>
          {t("about.body")}
        </p>
      </SectionReveal>
    </section>
  );
}
