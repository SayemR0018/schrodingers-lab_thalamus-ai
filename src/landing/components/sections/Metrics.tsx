"use client";

import { BarChart3, Shield, Users, Zap } from "lucide-react";
import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

const icons = {
  users: Users,
  zap: Zap,
  chart: BarChart3,
  shield: Shield,
} as const;

export function Metrics() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  // Source of truth for icon mapping stays the same shape; the dictionary
  // provides the bilingual labels under `metrics.metrics`.
  const metrics = [
    { id: "context", value: "Context", label: t("metrics.metrics.0.label"), icon: "users" as const },
    { id: "evidence", value: "Evidence", label: t("metrics.metrics.1.label"), icon: "chart" as const },
    { id: "control", value: "Control", label: t("metrics.metrics.2.label"), icon: "shield" as const },
    { id: "loop", value: "Loop", label: t("metrics.metrics.3.label"), icon: "zap" as const },
  ];
  const valueKeys = ["metrics.metrics.0.value", "metrics.metrics.1.value", "metrics.metrics.2.value", "metrics.metrics.3.value"] as const;

  return (
    <section id="metrics" className="pb-8 sm:pb-12" aria-labelledby="metrics-heading">
      <SectionReveal className="container-page">
        <div className="glass rounded-[28px] px-6 py-8 sm:px-10">
          <h2
            id="metrics-heading"
            className={cn(
              "text-center text-[11px] font-semibold tracking-[0.18em] text-muted uppercase",
              isBn && "lang-bn"
            )}
          >
            {t("metrics.heading")}
          </h2>
          <p
            className={cn(
              "mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-muted",
              isBn && "lang-bn"
            )}
          >
            {t("metrics.subtitle")}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {metrics.map((metric, index) => {
              const Icon = icons[metric.icon];
              const value = t(valueKeys[index]);
              return (
                <div key={metric.id} className="text-center">
                  <Icon
                    size={18}
                    strokeWidth={1.7}
                    className="mx-auto text-accent"
                    aria-hidden="true"
                  />
                  <p className="metric-value mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {value}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm text-muted",
                      isBn && "lang-bn"
                    )}
                  >
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
