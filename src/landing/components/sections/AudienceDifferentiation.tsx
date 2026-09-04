"use client";

import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

const groupKeys = ["0", "1", "2"] as const;
const diffKeys = ["0", "1", "2", "3", "4"] as const;

export function AudienceDifferentiation() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <section id="audience" className="py-20 sm:py-28" aria-labelledby="audience-heading">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionReveal>
            <p className={cn("eyebrow", isBn && "lang-bn")}>{t("audience.eyebrow")}</p>
            <h2
              id="audience-heading"
              className={cn(
                "mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl",
                isBn && "lang-bn"
              )}
            >
              {t("audience.heading")}
            </h2>
            <div className="mt-8 grid gap-4">
              {groupKeys.map((key) => (
                <article
                  key={key}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5"
                >
                  <h3 className={cn("text-sm font-semibold", isBn && "lang-bn")}>
                    {t(`audience.groups.${key}.title`)}
                  </h3>
                  <p className={cn("mt-2 text-sm leading-6 text-muted", isBn && "lang-bn")}>
                    {t(`audience.groups.${key}.body`)}
                  </p>
                </article>
              ))}
            </div>
          </SectionReveal>

          <SectionReveal delayMs={90}>
            <div className="glass rounded-[28px] p-5 sm:p-8">
              <p className={cn("eyebrow", isBn && "lang-bn")}>{t("audience.diffEyebrow")}</p>
              <h2 className={cn("mt-4 text-3xl font-semibold tracking-tight sm:text-4xl", isBn && "lang-bn")}>
                {t("audience.diffHeading")}
              </h2>
              <div className="mt-8 grid gap-3">
                {diffKeys.map((key) => (
                  <article
                    key={key}
                    className="grid gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:grid-cols-[0.9fr_1fr_1fr] sm:items-center"
                  >
                    <h3 className={cn("text-sm font-semibold", isBn && "lang-bn")}>
                      {t(`audience.diffItems.${key}.label`)}
                    </h3>
                    <p className={cn("text-sm text-muted", isBn && "lang-bn")}>
                      {t(`audience.diffItems.${key}.traditional`)}
                    </p>
                    <p className={cn("rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--background)] px-3 py-2 text-sm font-medium text-foreground", isBn && "lang-bn")}>
                      {t(`audience.diffItems.${key}.thalamus`)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
