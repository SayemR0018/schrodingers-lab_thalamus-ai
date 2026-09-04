"use client";

import Link from "next/link";
import { AlertCircle, AlertTriangle, Info, ChevronRight } from "lucide-react";
import type { Insight } from "@/services/types";
import { mockInsights } from "@/data/mock/insights";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

const severityConfig = {
  low: {
    icon: Info,
    color: "text-foreground-muted",
    bg: "bg-surface-elevated",
  },
  medium: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning-soft",
  },
  high: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive-soft",
  },
};

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const config = severityConfig[insight.severity];
  const Icon = config.icon;
  const isBn = useAppStore((s) => s.language) === "bn";

  // Find bilingual fields from mock data
  const mockInsight = mockInsights.find((i) => i.id === insight.id);
  const title = isBn && mockInsight?.titleBn ? mockInsight.titleBn : insight.title;
  const summary = isBn && mockInsight?.summaryBn ? mockInsight.summaryBn : insight.summary;
  const detectedAt = isBn && mockInsight?.detectedAtBn ? mockInsight.detectedAtBn : insight.detectedAt;

  const severityLabel = isBn
    ? insight.severity === "low"
      ? "নিম্ন"
      : insight.severity === "medium"
        ? "মধ্যম"
        : "উচ্চ"
    : insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1);

  const categoryLabel = isBn
    ? insight.category === "sales"
      ? "বিক্রয়"
      : insight.category === "inventory"
        ? "মজুদ"
        : insight.category === "customer"
          ? "গ্রাহক"
          : insight.category === "finance"
            ? "অর্থ"
            : "মার্কেটিং"
    : insight.category.charAt(0).toUpperCase() + insight.category.slice(1);

  return (
    <Link
      href={`/workspace/insights/${insight.id}`}
      className="glass block rounded-xl p-4 hover:bg-surface-elevated transition-colors group"
    >
      <div className="flex items-start gap-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bg)}>
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn("font-medium text-foreground", isBn && "lang-bn")}>{title}</h3>
            <span className={cn("text-xs px-2 py-0.5 rounded-full", config.bg, config.color, isBn && "lang-bn")}>
              {severityLabel}
            </span>
          </div>
          <p className={cn("text-sm text-foreground-muted line-clamp-2 mb-2", isBn && "lang-bn")}>
            {summary}
          </p>
          <div className={cn("flex items-center gap-3 text-xs text-foreground-subtle", isBn && "lang-bn")}>
            <span>{detectedAt}</span>
            <span>·</span>
            <span>{categoryLabel}</span>
            <span>·</span>
            <span>{insight.confidence}% {isBn ? "আত্মবিশ্বাস" : "confidence"}</span>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-foreground-subtle group-hover:text-foreground transition-colors" />
      </div>
    </Link>
  );
}
