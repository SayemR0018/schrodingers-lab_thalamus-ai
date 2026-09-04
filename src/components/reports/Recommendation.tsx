"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import type { Report } from "@/services/types";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

const riskConfig = {
  low: {
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success-soft",
    labelKey: "reportsDetail.riskLow",
  },
  medium: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning-soft",
    labelKey: "reportsDetail.riskMedium",
  },
  high: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive-soft",
    labelKey: "reportsDetail.riskHigh",
  },
  critical: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive-soft",
    labelKey: "reportsDetail.riskCritical",
  },
};

interface RecommendationProps {
  recommendation: Report["recommendation"];
}

export function Recommendation({ recommendation }: RecommendationProps) {
  const router = useRouter();
  const config = riskConfig[recommendation.risk];
  const Icon = config.icon;
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  return (
    <div className="glass rounded-xl p-6">
      <h2 className={cn("text-lg font-semibold text-foreground mb-4", bengaliClass)}>
        {t("reportsDetail.recommendation")}
      </h2>

      <p className={cn("text-foreground-muted leading-relaxed mb-4", bengaliClass)}>
        {recommendation.text}
      </p>

      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", config.bg)}>
          <Icon className={cn("h-4 w-4", config.color)} />
          <span className={cn("text-sm font-medium", config.color, bengaliClass)}>
            {t(config.labelKey)}
          </span>
        </div>

        {recommendation.actionRequired && recommendation.actionId && (
          <button
            onClick={() => router.push("/workspace/approvals")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-accent text-accent-foreground",
              "hover:bg-accent/90 transition-colors",
              "text-sm font-medium"
            )}
          >
            <span className={bengaliClass}>{t("reportsDetail.reviewAction")}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
