"use client";

import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

const integrationKeys = ["0", "1", "2", "3", "4", "5", "6"] as const;

export function Integrations() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <section id="integrations" className="py-16 sm:py-20" aria-labelledby="integrations-heading">
      <div className="container-page">
        <SectionReveal>
          <div className="grid gap-8 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className={cn("eyebrow", isBn && "lang-bn")}>{t("integrations.eyebrow")}</p>
              <h2
                id="integrations-heading"
                className={cn(
                  "mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl",
                  isBn && "lang-bn"
                )}
              >
                {t("integrations.heading")}
              </h2>
              <p className={cn("mt-5 max-w-lg text-[15px] leading-7 text-muted", isBn && "lang-bn")}>
                {t("integrations.subtitle")}
              </p>
              <p className={cn("mt-4 text-xs leading-5 text-muted", isBn && "lang-bn")}>
                {t("integrations.note")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {integrationKeys.map((key) => (
                <div
                  key={key}
                  className={cn(
                    "rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-4 text-sm font-medium",
                    isBn && "lang-bn"
                  )}
                >
                  {t(`integrations.items.${key}`)}
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
