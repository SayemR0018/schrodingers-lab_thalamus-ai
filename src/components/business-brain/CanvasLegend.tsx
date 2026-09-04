"use client";

import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

export function CanvasLegend() {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  return (
    <div className="glass-subtle absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2">
      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <StatusIndicator status="active" />
          <span className={cn("text-foreground-muted", bengaliClass)}>
            {t("brain.legendActive")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusIndicator status="locked" />
          <span className={cn("text-foreground-muted", bengaliClass)}>
            {t("brain.legendLocked")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-px w-4 bg-canvas-line" />
          <span className={cn("text-foreground-muted", bengaliClass)}>
            {t("brain.legendDataFlow")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-px w-4 bg-canvas-line-subtle"
            style={{ backgroundImage: "repeating-linear-gradient(90deg, hsl(var(--canvas-line-subtle)) 0, hsl(var(--canvas-line-subtle)) 4px, transparent 4px, transparent 8px)" }}
          />
          <span className={cn("text-foreground-muted", bengaliClass)}>
            {t("brain.legendInfoSync")}
          </span>
        </div>
      </div>
    </div>
  );
}
