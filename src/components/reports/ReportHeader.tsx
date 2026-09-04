"use client";

import { ArrowLeft, Clock, Users } from "lucide-react";
import Link from "next/link";
import type { Report } from "@/services/types";
import { mockReports } from "@/data/mock/reports";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

interface ReportHeaderProps {
  report: Report;
}

export function ReportHeader({ report }: ReportHeaderProps) {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  const mock = mockReports.find((r) => r.id === report.id);
  const generatedAt = isBengali && mock?.generatedAtBn ? mock.generatedAtBn : report.generatedAt;

  return (
    <div className="border-b border-border bg-surface px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link
            href="/workspace/reports"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className={bengaliClass}>{t("reportsDetail.back")}</span>
          </Link>

          <h1 className={cn("text-2xl font-semibold text-foreground mb-2", bengaliClass)}>
            {report.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-foreground-muted">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span className={bengaliClass}>
                {t("reportsDetail.generatedAt", { time: generatedAt })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span className={bengaliClass}>
                {t("reportsDetail.agentsCount", { count: report.generatedBy.length })}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-foreground-subtle mb-1">
            <span className={bengaliClass}>{t("reportsDetail.confidence")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold text-foreground">
              {report.confidence}%
            </div>
            <div className="w-16 h-2 rounded-full bg-surface-elevated overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  report.confidence >= 90 ? "bg-success" :
                  report.confidence >= 70 ? "bg-warning" : "bg-destructive"
                )}
                style={{ width: `${report.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Agents involved */}
      <div className="mt-4 flex items-center gap-2">
        <span className={cn("text-xs text-foreground-subtle", bengaliClass)}>
          {t("reportsDetail.analyzedBy")}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {report.generatedBy.map((agentId) => (
            <span
              key={agentId}
              className={cn("text-xs px-2 py-0.5 rounded-full bg-accent-soft text-accent", bengaliClass)}
            >
              {formatAgentName(agentId)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatAgentName(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
