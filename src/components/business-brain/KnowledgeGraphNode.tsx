"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Network } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";
import type { KnowledgeGraphStats, BusinessContext } from "@/services/types";

export interface KnowledgeGraphNodeData {
  stats: KnowledgeGraphStats;
  business: BusinessContext;
  [key: string]: unknown;
}

interface KnowledgeGraphNodeProps {
  data: KnowledgeGraphNodeData;
  selected?: boolean;
}

function KnowledgeGraphNodeComponent({
  data,
  selected,
}: KnowledgeGraphNodeProps) {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  return (
    <>
      {/* Top handles for bottom agents */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-1"
        className="!bg-canvas-line !w-2 !h-2 !border-2 !border-surface"
        style={{ left: "30%" }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-2"
        className="!bg-canvas-line !w-2 !h-2 !border-2 !border-surface"
        style={{ left: "50%" }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-3"
        className="!bg-canvas-line !w-2 !h-2 !border-2 !border-surface"
        style={{ left: "70%" }}
      />

      {/* Bottom handles for top agents */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-1"
        className="!bg-canvas-line !w-2 !h-2 !border-2 !border-surface"
        style={{ left: "30%" }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-2"
        className="!bg-canvas-line !w-2 !h-2 !border-2 !border-surface"
        style={{ left: "50%" }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-3"
        className="!bg-canvas-line !w-2 !h-2 !border-2 !border-surface"
        style={{ left: "70%" }}
      />

      <div
        className={cn(
          "glass w-[320px] rounded-2xl p-6 transition-all",
          selected && "ring-2 ring-accent"
        )}
      >
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft">
            <Network className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h2 className={cn("text-lg font-semibold text-foreground", bengaliClass)}>
              {t("brain.knowledgeGraphTitle")}
            </h2>
            <p className={cn("text-sm text-foreground-muted", bengaliClass)}>
              {data.business.name}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className={cn("mb-4 text-sm leading-relaxed text-foreground-muted", bengaliClass)}>
          {t("brain.knowledgeGraphDescription")}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-surface-elevated p-3">
            <div className="text-2xl font-semibold text-foreground">
              {data.stats.entities.toLocaleString()}
            </div>
            <div className={cn("text-xs text-foreground-muted", bengaliClass)}>
              {t("brain.knowledgeGraphEntities")}
            </div>
          </div>
          <div className="rounded-lg bg-surface-elevated p-3">
            <div className="text-2xl font-semibold text-foreground">
              {data.stats.relations.toLocaleString()}
            </div>
            <div className={cn("text-xs text-foreground-muted", bengaliClass)}>
              {t("brain.knowledgeGraphRelations")}
            </div>
          </div>
          <div className="rounded-lg bg-surface-elevated p-3">
            <div className="text-2xl font-semibold text-foreground">
              {data.stats.policies}
            </div>
            <div className={cn("text-xs text-foreground-muted", bengaliClass)}>
              {t("brain.knowledgeGraphPolicies")}
            </div>
          </div>
          <div className="rounded-lg bg-surface-elevated p-3">
            <div className="text-sm font-medium text-foreground">
              {data.stats.lastUpdated}
            </div>
            <div className={cn("text-xs text-foreground-muted", bengaliClass)}>
              {t("brain.knowledgeGraphLastUpdated")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const KnowledgeGraphNode = memo(KnowledgeGraphNodeComponent);
