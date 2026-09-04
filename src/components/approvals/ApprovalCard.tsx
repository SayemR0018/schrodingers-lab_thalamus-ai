"use client";

import { AlertCircle, AlertTriangle, CheckCircle, XCircle, Check, X } from "lucide-react";
import type { Approval } from "@/services/types";
import { mockApprovals } from "@/data/mock/approvals";
import { useAppStore } from "@/store/app.store";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const riskConfig = {
  low: { icon: CheckCircle, color: "text-success", bg: "bg-success-soft", labelKey: "approvalsCard.riskLow" },
  medium: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning-soft", labelKey: "approvalsCard.riskMedium" },
  high: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive-soft", labelKey: "approvalsCard.riskHigh" },
  critical: { icon: XCircle, color: "text-destructive", bg: "bg-destructive-soft", labelKey: "approvalsCard.riskCritical" },
};

interface ApprovalCardProps {
  approval: Approval;
  onApprove: () => void;
  onReject: () => void;
}

export function ApprovalCard({ approval, onApprove, onReject }: ApprovalCardProps) {
  const config = riskConfig[approval.risk];
  const Icon = config.icon;
  const isPending = approval.status === "pending";
  const isBn = useAppStore((s) => s.language) === "bn";
  const bengaliClass = isBn ? "lang-bn" : "";
  const { t } = useTranslation();

  // Find bilingual fields from mock data
  const mock = mockApprovals.find((a) => a.id === approval.id);
  const title = isBn && mock?.titleBn ? mock.titleBn : approval.title;
  const description = isBn && mock?.descriptionBn ? mock.descriptionBn : approval.description;
  const reason = isBn && mock?.reasonBn ? mock.reasonBn : approval.reason;
  const agentName = isBn && mock?.agentNameBn ? mock.agentNameBn : approval.agentName;
  const createdAt = isBn && mock?.createdAtBn ? mock.createdAtBn : approval.createdAt;

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs text-accent font-medium", bengaliClass)}>{agentName}</span>
          </div>
          <h3 className={cn("text-lg font-semibold text-foreground", bengaliClass)}>{title}</h3>
          <p className={cn("text-sm text-foreground-muted", bengaliClass)}>{description}</p>
        </div>
        <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full", config.bg)}>
          <Icon className={cn("h-4 w-4", config.color)} />
          <span className={cn("text-sm font-medium", config.color, bengaliClass)}>
            {t(config.labelKey)}
          </span>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-4 p-3 rounded-lg bg-surface-elevated">
        <p className={cn("text-xs text-foreground-subtle mb-1", bengaliClass)}>
          {t("approvalsCard.reason")}
        </p>
        <p className={cn("text-sm text-foreground-muted", bengaliClass)}>{reason}</p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Object.entries(approval.details).slice(0, 6).map(([key, value]) => (
          <div key={key} className="p-2 rounded-lg bg-surface-elevated">
            <p className={cn("text-xs text-foreground-subtle", bengaliClass)}>{key}</p>
            <p className={cn("text-sm font-medium text-foreground", bengaliClass)}>{String(value)}</p>
          </div>
        ))}
      </div>

      {/* Created timestamp */}
      <div className={cn("text-xs text-foreground-subtle mb-4", bengaliClass)}>
        {createdAt}
      </div>

      {/* Actions */}
      {isPending ? (
        <div className="flex gap-3">
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-success text-white hover:bg-success/90 transition-colors font-medium"
          >
            <Check className="h-4 w-4" />
            <span className={bengaliClass}>{t("common.approve")}</span>
          </button>
          <button
            onClick={onReject}
            className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border hover:bg-surface-elevated transition-colors font-medium text-foreground-muted", bengaliClass)}
          >
            <X className="h-4 w-4" />
            {t("common.reject")}
          </button>
        </div>
      ) : (
        <div className={cn(
          "flex items-center justify-center gap-2 py-2.5 rounded-lg",
          approval.status === "approved" ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive"
        )}>
          {approval.status === "approved" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          <span className={cn("font-medium capitalize", bengaliClass)}>
            {approval.status === "approved"
              ? t("approvalsCard.approved")
              : t("approvalsCard.rejected")}
          </span>
          {approval.decidedAt && <span className="text-sm">· {approval.decidedAt}</span>}
        </div>
      )}
    </div>
  );
}
