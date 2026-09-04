"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  TrendingUp,
  Megaphone,
  Package,
  HeartHandshake,
  Wallet,
  FileText,
  Cog,
  Lock,
  Loader2,
} from "lucide-react";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";
import type { Agent, AgentActivityState } from "@/services/types";

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
  "agent-sales": "text-[hsl(260,50%,55%)] dark:text-[hsl(260,45%,60%)]",
  "agent-marketing": "text-[hsl(25,80%,55%)] dark:text-[hsl(25,65%,55%)]",
  "agent-inventory": "text-[hsl(145,50%,45%)] dark:text-[hsl(145,40%,50%)]",
  "agent-customer": "text-[hsl(210,60%,50%)] dark:text-[hsl(210,50%,55%)]",
  "agent-finance": "text-[hsl(280,45%,50%)] dark:text-[hsl(280,40%,55%)]",
  "agent-policy": "text-[hsl(188,55%,38%)] dark:text-[hsl(188,45%,50%)]",
  "agent-automation": "text-[hsl(0,0%,55%)] dark:text-[hsl(0,0%,50%)]",
};

const bgColorMap: Record<string, string> = {
  "agent-sales": "bg-[hsl(260,50%,55%/0.1)] dark:bg-[hsl(260,45%,60%/0.12)]",
  "agent-marketing": "bg-[hsl(25,80%,55%/0.1)] dark:bg-[hsl(25,65%,55%/0.12)]",
  "agent-inventory": "bg-[hsl(145,50%,45%/0.1)] dark:bg-[hsl(145,40%,50%/0.12)]",
  "agent-customer": "bg-[hsl(210,60%,50%/0.1)] dark:bg-[hsl(210,50%,55%/0.12)]",
  "agent-finance": "bg-[hsl(280,45%,50%/0.1)] dark:bg-[hsl(280,40%,55%/0.12)]",
  "agent-policy": "bg-[hsl(188,55%,38%/0.1)] dark:bg-[hsl(188,45%,50%/0.12)]",
  "agent-automation": "bg-[hsl(0,0%,55%/0.1)] dark:bg-[hsl(0,0%,50%/0.12)]",
};

const activityLabelKeys: Record<AgentActivityState, string> = {
  idle: "brain.agentStatusActive",
  analyzing: "brain.agentActivityAnalyzing",
  reviewing: "brain.agentActivityReviewing",
  syncing: "brain.agentActivitySyncing",
};

export interface AgentNodeData extends Agent {
  nameBn?: string;
  descriptionBn?: string;
  position: "top" | "bottom";
  activityState?: AgentActivityState;
  [key: string]: unknown;
}

interface AgentNodeProps {
  data: AgentNodeData;
  selected?: boolean;
}

function AgentNodeComponent({ data, selected }: AgentNodeProps) {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  const Icon = iconMap[data.id] || Cog;
  const isLocked = data.status === "locked";
  const activityState = data.activityState || "idle";
  const isWorking = activityState !== "idle";

  const metricEntries = Object.entries(data.metrics).slice(0, 3);

  const agentName = isBengali && data.nameBn ? data.nameBn : data.name;
  const agentDescription = isBengali && data.descriptionBn ? data.descriptionBn : data.description;

  return (
    <>
      <Handle
        type="source"
        position={data.position === "top" ? Position.Bottom : Position.Top}
        className={cn(
          "!w-2 !h-2 !border-2 !border-surface",
          isWorking ? "!bg-accent" : "!bg-canvas-line"
        )}
      />

      <div
        className={cn(
          "glass w-[200px] rounded-xl p-4 transition-all",
          selected && "ring-2 ring-accent",
          isLocked && "opacity-70",
          isWorking && "ring-1 ring-accent/40"
        )}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              bgColorMap[data.colorKey],
              isWorking && "animate-pulse"
            )}
          >
            <Icon className={cn("h-4 w-4", colorMap[data.colorKey])} />
          </div>
          <div className="flex items-center gap-1.5">
            {isLocked ? (
              <>
                <Lock className="h-3 w-3 text-locked" />
                <span className={cn("text-xs font-medium uppercase text-locked", bengaliClass)}>
                  {t("brain.agentStatusLocked")}
                </span>
              </>
            ) : isWorking ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-accent" />
                <span className={cn("text-xs font-medium uppercase text-accent", bengaliClass)}>
                  {t(activityLabelKeys[activityState])}
                </span>
              </>
            ) : (
              <>
                <StatusIndicator status="active" />
                <span className={cn("text-xs font-medium uppercase text-success", bengaliClass)}>
                  {t("brain.agentStatusActive")}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className={cn("mb-1 font-semibold text-foreground", bengaliClass)}>
          {agentName}
        </h3>

        {/* Description */}
        <p className={cn("mb-3 text-xs leading-relaxed text-foreground-muted", bengaliClass)}>
          {agentDescription}
        </p>

        {/* Metrics */}
        {metricEntries.length > 0 && !isLocked && (
          <div className="border-t border-border pt-3">
            <div className={cn("mb-1.5 text-[10px] font-medium uppercase tracking-wider text-foreground-subtle", bengaliClass)}>
              {t("brain.agentToday")}
            </div>
            <div className="space-y-1">
              {metricEntries.map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className={cn("text-xs text-foreground-muted", bengaliClass)}>
                    {formatMetricKey(key)}
                  </span>
                  <span className={cn("text-xs font-medium text-foreground", bengaliClass)}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function formatMetricKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export const AgentNode = memo(AgentNodeComponent);
