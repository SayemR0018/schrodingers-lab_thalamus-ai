"use client";

import { useEffect } from "react";
import { X, Database, FileSpreadsheet, ShoppingBag, Users, Package } from "lucide-react";
import type { EvidenceSource } from "@/services/types";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  shopify: ShoppingBag,
  sheets: FileSpreadsheet,
  internal: Database,
  customer: Users,
  inventory: Package,
};

interface EvidenceDrawerProps {
  open: boolean;
  onClose: () => void;
  evidence: EvidenceSource[];
  title: string;
}

export function EvidenceDrawer({ open, onClose, evidence, title }: EvidenceDrawerProps) {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md",
          "bg-surface border-l border-border shadow-2xl",
          "transform transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className={cn("text-lg font-semibold text-foreground", bengaliClass)}>
              {t("reportsDetail.evidence")}
            </h2>
            <p className={cn("text-sm text-foreground-muted", bengaliClass)}>{title}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-elevated"
          >
            <X className="h-4 w-4 text-foreground-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-73px)] p-4">
          <div className="space-y-4">
            {evidence.map((source) => {
              const Icon = iconMap[source.type] || Database;
              const name = isBengali && source.nameBn ? source.nameBn : source.name;
              const relevantFinding = isBengali && source.relevantFindingBn ? source.relevantFindingBn : source.relevantFinding;

              return (
                <div
                  key={source.id}
                  className="glass rounded-xl p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className={cn("font-semibold text-foreground", bengaliClass)}>
                        {name}
                      </h3>
                      <p className={cn("text-sm text-foreground-muted", bengaliClass)}>
                        {formatNumber(source.recordCount, language)} records
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {source.timeRange && (
                      <div className="flex justify-between">
                        <span className={cn("text-foreground-muted", bengaliClass)}>
                          {t("reportsDetail.evidenceTimeRange")}
                        </span>
                        <span className={cn("text-foreground", bengaliClass)}>
                          {source.timeRange}
                        </span>
                      </div>
                    )}
                    {relevantFinding && (
                      <div className="pt-2 border-t border-border">
                        <p className={cn("text-xs text-foreground-subtle mb-1", bengaliClass)}>
                          {t("reportsDetail.evidenceRelevantFinding")}
                        </p>
                        <p className={cn("text-foreground-muted", bengaliClass)}>
                          {relevantFinding}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
