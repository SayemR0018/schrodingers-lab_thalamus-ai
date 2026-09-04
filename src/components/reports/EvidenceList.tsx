"use client";

import { useState } from "react";
import { ChevronRight, Database, FileSpreadsheet, ShoppingBag, Users, Package } from "lucide-react";
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

interface EvidenceListProps {
  evidence: EvidenceSource[];
  onViewEvidence?: () => void;
}

export function EvidenceList({ evidence, onViewEvidence }: EvidenceListProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className={cn("text-lg font-semibold text-foreground", bengaliClass)}>
          {t("reportsDetail.evidence")}
        </h2>
        <span className={cn("text-sm text-foreground-muted", bengaliClass)}>
          {t("reportsDetail.evidenceSources", { count: evidence.length })}
        </span>
      </div>

      <div className="space-y-2">
        {evidence.slice(0, expanded ? undefined : 3).map((source) => {
          const Icon = iconMap[source.type] || Database;
          const name = isBengali && source.nameBn ? source.nameBn : source.name;
          const relevantFinding = isBengali && source.relevantFindingBn ? source.relevantFindingBn : source.relevantFinding;

          return (
            <div
              key={source.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface">
                <Icon className="h-4 w-4 text-foreground-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("font-medium text-foreground text-sm", bengaliClass)}>
                  {name}
                </p>
                <p className={cn("text-xs text-foreground-muted truncate", bengaliClass)}>
                  {formatNumber(source.recordCount, language)} records
                  {source.timeRange && ` · ${source.timeRange}`}
                </p>
              </div>
              {relevantFinding && (
                <p className={cn("text-xs text-foreground-subtle max-w-[200px] text-right hidden md:block", bengaliClass)}>
                  {relevantFinding}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {evidence.length > 3 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 text-sm text-accent hover:text-accent/80"
        >
          <span className={bengaliClass}>
            {t("reportsDetail.evidenceShowMore", { count: evidence.length - 3 })}
          </span>
        </button>
      )}

      {onViewEvidence && (
        <button
          onClick={onViewEvidence}
          className={cn(
            "mt-4 w-full flex items-center justify-center gap-2",
            "py-2 rounded-lg border border-border",
            "text-sm font-medium text-foreground-muted",
            "hover:bg-surface-elevated hover:text-foreground transition-colors"
          )}
        >
          <span className={bengaliClass}>{t("reportsDetail.evidenceViewAll")}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
