"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Megaphone, Package, HeartHandshake, Wallet, FileText, Cog, Lock } from "lucide-react";
import { mockAgents } from "@/data/mock/agents";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  "sales-analyst": TrendingUp,
  "marketing-agent": Megaphone,
  "inventory-agent": Package,
  "customer-success": HeartHandshake,
  "finance-agent": Wallet,
  "policy-docs-agent": FileText,
  "automation-agent": Cog,
};

const colorMap: Record<string, string> = {
  "agent-sales": "bg-[hsl(260,50%,55%/0.1)] text-[hsl(260,50%,55%)] dark:bg-[hsl(260,45%,60%/0.12)] dark:text-[hsl(260,45%,60%)]",
  "agent-marketing": "bg-[hsl(25,80%,55%/0.1)] text-[hsl(25,80%,55%)] dark:bg-[hsl(25,65%,55%/0.12)] dark:text-[hsl(25,65%,55%)]",
  "agent-inventory": "bg-[hsl(145,50%,45%/0.1)] text-[hsl(145,50%,45%)] dark:bg-[hsl(145,40%,50%/0.12)] dark:text-[hsl(145,40%,50%)]",
  "agent-customer": "bg-[hsl(210,60%,50%/0.1)] text-[hsl(210,60%,50%)] dark:bg-[hsl(210,50%,55%/0.12)] dark:text-[hsl(210,50%,55%)]",
  "agent-finance": "bg-[hsl(280,45%,50%/0.1)] text-[hsl(280,45%,50%)] dark:bg-[hsl(280,40%,55%/0.12)] dark:text-[hsl(280,40%,55%)]",
  "agent-policy": "bg-[hsl(188,55%,38%/0.1)] text-[hsl(188,55%,38%)] dark:bg-[hsl(188,45%,50%/0.12)] dark:text-[hsl(188,45%,50%)]",
  "agent-automation": "bg-[hsl(0,0%,55%/0.1)] text-[hsl(0,0%,55%)] dark:bg-[hsl(0,0%,50%/0.12)] dark:text-[hsl(0,0%,50%)]",
};

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = use(params);
  const agent = mockAgents.find((a) => a.id === id);
  const { t } = useTranslation();
  const isBn = useAppStore((s) => s.language) === "bn";
  const bengaliClass = isBn ? "lang-bn" : "";

  if (!agent) {
    notFound();
  }

  const Icon = iconMap[agent.id] || Cog;
  const isLocked = agent.status === "locked";

  const agentName = isBn && agent.nameBn ? agent.nameBn : agent.name;
  const agentDescription = isBn && agent.descriptionBn ? agent.descriptionBn : agent.description;

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/workspace/workforce"
          className={cn("inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground mb-6", bengaliClass)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("workforceDetail.back")}
        </Link>

        {/* Agent Header */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl", colorMap[agent.colorKey])}>
              <Icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className={cn("text-2xl font-semibold text-foreground", bengaliClass)}>
                  {agentName}
                </h1>
                {isLocked ? (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-locked-soft text-locked">
                    <Lock className="h-3 w-3" />
                    <span className={cn("text-xs font-medium uppercase", bengaliClass)}>
                      {t("workforce.locked")}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <StatusIndicator status="active" size="md" />
                    <span className={cn("text-sm font-medium uppercase text-success", bengaliClass)}>
                      {t("workforce.active")}
                    </span>
                  </div>
                )}
              </div>
              <p className={cn("text-foreground-muted", bengaliClass)}>{agentDescription}</p>
            </div>
          </div>
        </div>

        {isLocked ? (
          <div className="glass rounded-xl p-8 text-center">
            <Lock className="h-12 w-12 text-locked mx-auto mb-4" />
            <h2 className={cn("text-lg font-semibold text-foreground mb-2", bengaliClass)}>
              {isBn ? "এই সক্ষমতা এখনও উপলব্ধ নয়" : "This capability is not yet available"}
            </h2>
            <p className={cn("text-foreground-muted mb-4", bengaliClass)}>
              {isBn
                ? "অটোমেশন এজেন্টের জন্য এই কর্মক্ষেত্রে অতিরিক্ত অনুমতি প্রয়োজন।"
                : "Automation Agent requires additional permissions for this workspace."}
            </p>
            <button className={cn("px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors", bengaliClass)}>
              {isBn ? "আরও জানুন" : "Learn more"}
            </button>
          </div>
        ) : (
          <>
            {/* Capabilities */}
            <div className="glass rounded-xl p-6 mb-6">
              <h2 className={cn("text-lg font-semibold text-foreground mb-4", bengaliClass)}>
                {t("workforceDetail.capabilities")}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {agent.capabilities.map((cap) => (
                  <div key={cap} className="px-4 py-3 rounded-lg bg-surface-elevated">
                    <p className={cn("text-sm text-foreground", bengaliClass)}>{cap}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="glass rounded-xl p-6 mb-6">
              <h2 className={cn("text-lg font-semibold text-foreground mb-4", bengaliClass)}>
                {isBn ? "আজকের কার্যকলাপ" : "Today's Activity"}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(agent.metrics).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-lg bg-surface-elevated text-center">
                    <p className={cn("text-2xl font-semibold text-foreground", bengaliClass)}>
                      {String(value)}
                    </p>
                    <p className={cn("text-sm text-foreground-muted", bengaliClass)}>
                      {formatMetricKey(key)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Context Used */}
            <div className="glass rounded-xl p-6">
              <h2 className={cn("text-lg font-semibold text-foreground mb-4", bengaliClass)}>
                {isBn ? "ব্যবহৃত ব্যবসায়িক প্রসঙ্গ" : "Business Context Used"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  isBn ? "পণ্য" : "Products",
                  isBn ? "গ্রাহক" : "Customers",
                  isBn ? "অর্ডার" : "Orders",
                  isBn ? "মজুদ" : "Inventory",
                ].map((ctx) => (
                  <span key={ctx} className={cn("px-3 py-1 rounded-full bg-surface-elevated text-sm text-foreground-muted", bengaliClass)}>
                    {ctx}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function formatMetricKey(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
}
