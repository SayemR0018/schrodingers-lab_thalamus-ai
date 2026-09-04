"use client";

import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, AlertTriangle, Info, ArrowRight } from "lucide-react";
import Link from "next/link";
import { mockInsights } from "@/data/mock/insights";
import { EvidenceList } from "@/components/reports/EvidenceList";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

const severityConfig = {
  low: {
    icon: Info,
    color: "text-foreground-muted",
    bg: "bg-surface-elevated",
    labelEn: "Low",
    labelBn: "নিম্ন",
  },
  medium: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning-soft",
    labelEn: "Medium",
    labelBn: "মধ্যম",
  },
  high: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive-soft",
    labelEn: "High",
    labelBn: "উচ্চ",
  },
};

interface InsightDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InsightDetailPage({ params }: InsightDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const insight = mockInsights.find((i) => i.id === id);
  const { t } = useTranslation();
  const isBn = useAppStore((s) => s.language) === "bn";
  const bengaliClass = isBn ? "lang-bn" : "";

  if (!insight) {
    notFound();
  }

  const config = severityConfig[insight.severity];
  const Icon = config.icon;

  const title = isBn && insight.titleBn ? insight.titleBn : insight.title;
  const summary = isBn && insight.summaryBn ? insight.summaryBn : insight.summary;
  const recommendation = isBn && insight.recommendationBn ? insight.recommendationBn : insight.recommendation;
  const detectedAt = isBn && insight.detectedAtBn ? insight.detectedAtBn : insight.detectedAt;
  const affectedEntities = isBn && insight.affectedEntitiesBn
    ? insight.affectedEntitiesBn
    : insight.affectedEntities;

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/workspace/insights"
          className={cn("inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground mb-6", bengaliClass)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("insightsDetail.back")}
        </Link>

        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", config.bg)}>
              <Icon className={cn("h-6 w-6", config.color)} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className={cn("text-xl font-semibold text-foreground", bengaliClass)}>
                  {title}
                </h1>
                <span className={cn("text-xs px-2 py-0.5 rounded-full", config.bg, config.color, bengaliClass)}>
                  {isBn ? config.labelBn : config.labelEn}
                </span>
              </div>
              <p className={cn("text-sm text-foreground-muted", bengaliClass)}>{detectedAt}</p>
            </div>
            <div className="text-right">
              <div className={cn("text-sm text-foreground-subtle", bengaliClass)}>
                {t("insightsDetail.confidence")}
              </div>
              <div className="text-xl font-semibold text-foreground">{insight.confidence}%</div>
            </div>
          </div>

          <p className={cn("text-foreground-muted leading-relaxed", bengaliClass)}>{summary}</p>
        </div>

        {/* Affected Entities */}
        <div className="glass rounded-xl p-6 mb-6">
          <h2 className={cn("text-lg font-semibold text-foreground mb-3", bengaliClass)}>
            {t("insightsDetail.affectedEntities")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {affectedEntities.map((entity, idx) => (
              <span key={`${entity}-${idx}`} className={cn("px-3 py-1 rounded-full bg-surface-elevated text-sm text-foreground-muted", bengaliClass)}>
                {entity}
              </span>
            ))}
          </div>
        </div>

        {/* Evidence */}
        <div className="mb-6">
          <EvidenceList evidence={insight.evidence} />
        </div>

        {/* Related Agents */}
        <div className="glass rounded-xl p-6 mb-6">
          <h2 className={cn("text-lg font-semibold text-foreground mb-3", bengaliClass)}>
            {t("insightsDetail.relatedAgents")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {insight.relatedAgents.map((agentId) => (
              <span key={agentId} className={cn("px-3 py-1 rounded-full bg-accent-soft text-sm text-accent", bengaliClass)}>
                {formatAgentName(agentId)}
              </span>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        {insight.recommendation && (
          <div className="glass rounded-xl p-6">
            <h2 className={cn("text-lg font-semibold text-foreground mb-3", bengaliClass)}>
              {t("insightsDetail.recommendation")}
            </h2>
            <p className={cn("text-foreground-muted mb-4", bengaliClass)}>{recommendation}</p>

            {insight.actionId && (
              <button
                onClick={() => router.push("/workspace/approvals")}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium", bengaliClass)}
              >
                {t("reportsDetail.reviewAction")}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatAgentName(id: string): string {
  return id.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
