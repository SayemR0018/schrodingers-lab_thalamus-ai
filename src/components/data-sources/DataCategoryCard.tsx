"use client";

import { ChevronRight, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { DataCategory } from "@/store/data.store";
import { cn } from "@/lib/utils";

interface DataCategoryCardProps {
  category: DataCategory;
  icon: React.ElementType;
  onClick: () => void;
}

const statusConfig = {
  healthy: { icon: CheckCircle, color: "text-success", label: "Healthy" },
  warning: { icon: AlertTriangle, color: "text-warning", label: "Warning" },
  error: { icon: XCircle, color: "text-destructive", label: "Error" },
};

export function DataCategoryCard({ category, icon: Icon, onClick }: DataCategoryCardProps) {
  const status = statusConfig[category.status];
  const StatusIcon = status.icon;

  return (
    <button
      onClick={onClick}
      className="glass rounded-xl p-4 text-left hover:bg-surface-elevated transition-colors group w-full"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated">
          <Icon className="h-5 w-5 text-foreground-muted" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-foreground">{category.name}</h3>
            <ChevronRight className="h-4 w-4 text-foreground-subtle group-hover:text-foreground transition-colors" />
          </div>
          <p className="text-lg font-semibold text-foreground mb-1">
            {category.recordCount.toLocaleString()}
            <span className="text-sm font-normal text-foreground-muted ml-1">records</span>
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-subtle">Updated {category.lastUpdated}</span>
            <div className={cn("flex items-center gap-1", status.color)}>
              <StatusIcon className="h-3 w-3" />
              <span>{status.label}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
