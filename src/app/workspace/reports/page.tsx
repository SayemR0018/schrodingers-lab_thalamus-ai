"use client";

import Link from "next/link";
import { FileBarChart, Clock, ChevronRight } from "lucide-react";
import { mockReports } from "@/data/mock/reports";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const { t } = useTranslation();
  const isBn = useAppStore((s) => s.language) === "bn";
  const bengaliClass = isBn ? "lang-bn" : "";

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={cn("text-2xl font-semibold text-foreground mb-2", isBn && "lang-bn")}>
            {t("reports.title")}
          </h1>
          <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
            {t("reports.subtitle")}
          </p>
        </div>

        {mockReports.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <FileBarChart className="h-12 w-12 text-foreground-subtle mx-auto mb-4" />
            <h2 className={cn("text-lg font-semibold text-foreground mb-2", isBn && "lang-bn")}>
              {t("reports.noReports")}
            </h2>
            <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
              {t("reports.noReportsBody")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mockReports.map((report) => {
              const title = isBn && report.titleBn ? report.titleBn : report.title;
              const generatedAt = isBn && report.generatedAtBn ? report.generatedAtBn : report.generatedAt;
              return (
                <Link
                  key={report.id}
                  href={`/workspace/reports/${report.id}`}
                  className={cn(
                    "glass flex items-center gap-4 p-4 rounded-xl",
                    "hover:bg-surface-elevated transition-colors group"
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
                    <FileBarChart className="h-5 w-5 text-accent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={cn("font-medium text-foreground truncate", bengaliClass)}>
                      {title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-foreground-muted">
                      <span className={cn("flex items-center gap-1", bengaliClass)}>
                        <Clock className="h-3 w-3" />
                        {generatedAt}
                      </span>
                      <span>·</span>
                      <span className={bengaliClass}>
                        {t("reportsDetail.agentsCount", { count: report.generatedBy.length })}
                      </span>
                      <span>·</span>
                      <span className={bengaliClass}>
                        {report.confidence}% {t("insightsDetail.confidence").toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-foreground-subtle group-hover:text-foreground transition-colors" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
