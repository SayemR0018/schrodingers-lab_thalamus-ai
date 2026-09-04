"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { InsightCard } from "@/components/insights/InsightCard";
import { mockInsights } from "@/data/mock/insights";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", key: "insights.catAll" },
  { id: "sales", key: "insights.catSales" },
  { id: "inventory", key: "insights.catInventory" },
  { id: "customer", key: "insights.catCustomer" },
  { id: "finance", key: "insights.catFinance" },
  { id: "marketing", key: "insights.catMarketing" },
];

export default function InsightsPage() {
  const { t } = useTranslation();
  const isBn = useAppStore((s) => s.language) === "bn";
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredInsights = activeCategory === "all"
    ? mockInsights
    : mockInsights.filter((i) => i.category === activeCategory);

  const needsAttention = mockInsights.filter(
    (i) => i.status === "new" && i.severity !== "low"
  ).length;

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={cn("text-2xl font-semibold text-foreground mb-2", isBn && "lang-bn")}>
            {t("insights.title")}
          </h1>
          <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
            {needsAttention > 0 ? (
              <span className="text-warning">
                {t("insights.subtitleAttn", { count: needsAttention })}
              </span>
            ) : (
              t("insights.subtitle")
            )}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                activeCategory === cat.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-surface-elevated text-foreground-muted hover:text-foreground",
                isBn && "lang-bn"
              )}
            >
              {t(cat.key)}
            </button>
          ))}
        </div>

        {filteredInsights.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <Lightbulb className="h-12 w-12 text-foreground-subtle mx-auto mb-4" />
            <h2 className={cn("text-lg font-semibold text-foreground mb-2", isBn && "lang-bn")}>
              {t("insights.noInsights")}
            </h2>
            <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
              {t("insights.noInsightsBody")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
