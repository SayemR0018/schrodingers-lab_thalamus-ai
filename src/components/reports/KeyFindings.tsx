"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { ReportFinding } from "@/services/types";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

interface KeyFindingsProps {
  findings: ReportFinding[];
  mockFindingsBn?: Array<{ id: string; titleBn: string; detailBn?: string }>;
}

export function KeyFindings({ findings, mockFindingsBn }: KeyFindingsProps) {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  return (
    <div className="glass rounded-xl p-6">
      <h2 className={cn("text-lg font-semibold text-foreground mb-4", bengaliClass)}>
        {t("reportsDetail.keyFindings")}
      </h2>

      <div className="space-y-4">
        {findings.map((finding, index) => {
          const Icon = finding.changeType === "negative" ? TrendingDown :
                       finding.changeType === "positive" ? TrendingUp : Minus;

          const bnFinding = mockFindingsBn?.find((f) => f.id === finding.id);
          const title = isBengali && bnFinding?.titleBn ? bnFinding.titleBn : finding.title;
          const detail = isBengali && bnFinding?.detailBn ? bnFinding.detailBn : finding.detail;

          return (
            <div
              key={finding.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-surface-elevated"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-foreground-muted font-medium">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={cn("font-medium text-foreground", bengaliClass)}>
                    {title}
                  </h3>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      finding.changeType === "negative" && "text-destructive",
                      finding.changeType === "positive" && "text-success",
                      finding.changeType === "neutral" && "text-foreground-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className={bengaliClass}>{finding.change}</span>
                  </div>
                </div>
                {detail && (
                  <p className={cn("text-sm text-foreground-muted", bengaliClass)}>
                    {detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
