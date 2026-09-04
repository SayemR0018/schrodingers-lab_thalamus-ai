"use client";

import { useMemo, useState } from "react";
import {
  CircleDollarSign,
  FileCheck,
  HeartHandshake,
  Lock,
  Megaphone,
  Package,
  TrendingUp,
  Workflow,
} from "lucide-react";
import {
  workforceAgents,
  workforceGoals,
  type WorkforceAgentId,
} from "@/landing/data/landing";
import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

const icons: Record<WorkforceAgentId, typeof TrendingUp> = {
  sales: TrendingUp,
  marketing: Megaphone,
  inventory: Package,
  success: HeartHandshake,
  finance: CircleDollarSign,
  policy: FileCheck,
  automation: Workflow,
};

const goalKeys = ["increase-sales", "reduce-stockouts", "control-operations"] as const;
type GoalKey = (typeof goalKeys)[number];

// Map i18n key → actual `id` value used in `workforceGoals`
const goalKeyToId: Record<GoalKey, string> = {
  "increase-sales": "increase-sales",
  "reduce-stockouts": "reduce-stockouts",
  "control-operations": "control-operations",
};

export function PlatformSection() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const [activeGoal, setActiveGoal] = useState<GoalKey>("increase-sales");

  const activeGoalData = useMemo(
    () => workforceGoals.find((goal) => goal.id === goalKeyToId[activeGoal]),
    [activeGoal],
  );
  const mappedAgents = useMemo(
    () => new Set(activeGoalData?.activeAgents ?? []),
    [activeGoalData],
  );

  return (
    <section
      id="platform"
      className="relative py-20 sm:py-28"
      aria-labelledby="platform-heading"
    >
      <div className="container-page grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <SectionReveal>
          <p className={cn("eyebrow", isBn && "lang-bn")}>
            {t("platform.eyebrow")}
          </p>
          <h2
            id="platform-heading"
            className={cn(
              "mt-4 max-w-md text-3xl font-semibold tracking-tight sm:text-4xl",
              isBn && "lang-bn"
            )}
          >
            {t("platform.heading")}
          </h2>
          <p
            className={cn(
              "mt-5 max-w-md text-[15px] leading-7 text-muted",
              isBn && "lang-bn"
            )}
          >
            {t("platform.subtitle")}
          </p>
          <div className="mt-8 grid gap-3">
            {goalKeys.map((key) => {
              const isActive = key === activeGoal;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveGoal(key)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    isActive
                      ? "glass-strong border-[color:var(--border-strong)]"
                      : "border-[color:var(--border)] bg-[color:var(--surface)] hover:border-[color:var(--border-strong)]",
                  )}
                  aria-pressed={isActive}
                >
                  <span className={cn("text-sm font-semibold", isBn && "lang-bn")}>
                    {t(`platform.goals.${key}.label`)}
                  </span>
                  <span className={cn("mt-2 block text-sm leading-6 text-muted", isBn && "lang-bn")}>
                    {t(`platform.goals.${key}.summary`)}
                  </span>
                </button>
              );
            })}
          </div>
        </SectionReveal>

        <SectionReveal delayMs={80}>
          <div className="glass relative overflow-hidden rounded-[28px] p-5 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className={cn("text-[11px] font-semibold tracking-[0.16em] text-muted uppercase", isBn && "lang-bn")}>
                  {t("common.businessGoal")}
                </p>
                <h3 className={cn("mt-2 text-xl font-semibold tracking-tight", isBn && "lang-bn")}>
                  {t(`platform.goals.${activeGoal}.label`)}
                </h3>
              </div>
              <div className={cn("rounded-full border border-[color:var(--border-strong)] px-3 py-1 text-xs text-accent", isBn && "lang-bn")}>
                {t("common.prototypeView")}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {workforceAgents.map((agent) => {
                const Icon = icons[agent.id];
                const mapped = mappedAgents.has(agent.id);
                const locked = agent.state === "Locked";
                const active = mapped && !locked;
                const stateLabel = locked
                  ? t("platform.stateLocked")
                  : active
                    ? t("platform.stateActive")
                    : t("platform.stateAvailable");

                return (
                  <article
                    key={agent.id}
                    className={cn(
                      "rounded-2xl border p-4 transition-all",
                      active
                        ? "border-[color:var(--accent)] bg-[color:var(--surface)]"
                        : mapped
                          ? "border-[color:var(--border-strong)] bg-[color:var(--surface-glass)]"
                          : "border-[color:var(--border)] bg-transparent opacity-65",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color:var(--border)] text-accent">
                        {locked ? (
                          <Lock size={16} strokeWidth={1.7} />
                        ) : (
                          <Icon size={16} strokeWidth={1.7} />
                        )}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={cn("text-sm font-semibold tracking-tight", isBn && "lang-bn")}>
                            {t(`platform.agents.${agent.id}.name`)}
                          </h3>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-medium",
                              active
                                ? "bg-[color:var(--accent)] text-white"
                                : "border border-[color:var(--border)] text-muted",
                              isBn && "lang-bn",
                            )}
                          >
                            {stateLabel}
                          </span>
                        </div>
                        <p className={cn("mt-2 text-[13px] leading-5 text-muted", isBn && "lang-bn")}>
                          {t(`platform.agents.${agent.id}.description`)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <p className={cn("mt-5 text-xs leading-5 text-muted", isBn && "lang-bn")}>
              {t("platform.prototypeNote")}
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
