"use client";

import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

const resourceKeys = ["0", "1", "2", "3"] as const;

export function Resources() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <section
      id="resources"
      className="py-16 sm:py-20"
      aria-labelledby="resources-heading"
    >
      <div className="container-page">
        <SectionReveal>
          <p className={cn("eyebrow", isBn && "lang-bn")}>{t("resources.eyebrow")}</p>
          <h2
            id="resources-heading"
            className={cn(
              "mt-4 max-w-lg text-3xl font-semibold tracking-tight",
              isBn && "lang-bn"
            )}
          >
            {t("resources.heading")}
          </h2>
          <p className={cn("mt-5 max-w-2xl text-[15px] leading-7 text-muted", isBn && "lang-bn")}>
            {t("resources.subtitle")}
          </p>
        </SectionReveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[color:var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {resourceKeys.map((key, index) => (
            <SectionReveal key={key} delayMs={index * 40}>
              <a
                href="#"
                className="block h-full bg-[color:var(--surface)] px-5 py-6 transition-colors hover:bg-[color:var(--background)]"
              >
                <p className={cn("text-sm font-semibold", isBn && "lang-bn")}>
                  {t(`resources.items.${key}.label`)}
                </p>
                <p className={cn("mt-2 text-sm text-muted", isBn && "lang-bn")}>
                  {t(`resources.items.${key}.detail`)}
                </p>
              </a>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
