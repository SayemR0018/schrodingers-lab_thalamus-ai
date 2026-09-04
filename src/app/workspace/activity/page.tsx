"use client";

import { FileBarChart, Lightbulb, CheckSquare, Settings, User, Bot, Activity } from "lucide-react";
import { getActivity } from "@/data/mock/activity";
import type { ActivityEvent } from "@/services/types";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  report: { icon: FileBarChart, color: "text-accent" },
  insight: { icon: Lightbulb, color: "text-warning" },
  approval: { icon: CheckSquare, color: "text-success" },
  analysis: { icon: Bot, color: "text-accent" },
  system: { icon: Settings, color: "text-foreground-muted" },
  user: { icon: User, color: "text-foreground" },
};

export default function ActivityPage() {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBn = language === "bn";

  const activities = getActivity();

  // Group by time
  const today = activities.filter((a) => !a.timestamp.includes("Yesterday"));
  const yesterday = activities.filter((a) => a.timestamp.includes("Yesterday"));

  const hasActivity = activities.length > 0;

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={cn("text-2xl font-semibold text-foreground mb-2", isBn && "lang-bn")}>
            {t("activity.title")}
          </h1>
          <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
            {t("activity.subtitle")}
          </p>
        </div>

        {!hasActivity ? (
          <div className="glass rounded-xl p-12 text-center">
            <Activity className="h-12 w-12 text-foreground-subtle mx-auto mb-4" />
            <h2 className={cn("text-lg font-semibold text-foreground mb-2", isBn && "lang-bn")}>
              {t("activity.emptyTitle")}
            </h2>
            <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
              {t("activity.emptyBody")}
            </p>
          </div>
        ) : (
          <>
            {/* Today */}
            {today.length > 0 && (
              <div className="mb-8">
                <h2 className={cn("text-sm font-medium text-foreground-subtle uppercase tracking-wider mb-4", isBn && "lang-bn")}>
                  {t("activity.sectionToday")}
                </h2>
                <div className="space-y-1">
                  {today.map((event) => (
                    <ActivityItem key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday */}
            {yesterday.length > 0 && (
              <div>
                <h2 className={cn("text-sm font-medium text-foreground-subtle uppercase tracking-wider mb-4", isBn && "lang-bn")}>
                  {t("activity.sectionYesterday")}
                </h2>
                <div className="space-y-1">
                  {yesterday.map((event) => (
                    <ActivityItem key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ event }: { event: ActivityEvent }) {
  const config = typeConfig[event.type] || typeConfig.system;
  const Icon = config.icon;
  const isBn = useAppStore((s) => s.language) === "bn";

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-surface-elevated transition-colors">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
        <Icon className={cn("h-4 w-4", config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={cn("font-medium text-foreground", isBn && "lang-bn")}>{event.title}</span>
        </div>
        <p className={cn("text-sm text-foreground-muted", isBn && "lang-bn")}>{event.description}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-foreground-subtle">
          <span>{event.actor}</span>
          <span>·</span>
          <span>{event.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
