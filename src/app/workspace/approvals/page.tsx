"use client";

import { useState } from "react";
import { CheckSquare } from "lucide-react";
import { ApprovalCard } from "@/components/approvals/ApprovalCard";
import { getApprovals, approveAction, rejectAction } from "@/data/mock/approvals";
import type { Approval } from "@/services/types";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

export default function ApprovalsPage() {
  const { t } = useTranslation();
  const isBn = useAppStore((s) => s.language) === "bn";
  const [approvals, setApprovals] = useState<Approval[]>(() => getApprovals() as Approval[]);

  const handleApprove = (id: string) => {
    approveAction(id, "You");
    setApprovals(getApprovals());
  };

  const handleReject = (id: string) => {
    rejectAction(id, "You");
    setApprovals(getApprovals());
  };

  const pendingCount = approvals.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={cn("text-2xl font-semibold text-foreground mb-2", isBn && "lang-bn")}>
            {t("approvals.title")}
          </h1>
          <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
            {pendingCount > 0 ? (
              <span className="text-warning">
                {t("approvals.subtitlePending", { count: pendingCount })}
              </span>
            ) : (
              t("approvals.subtitleEmpty")
            )}
          </p>
        </div>

        {approvals.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <CheckSquare className="h-12 w-12 text-foreground-subtle mx-auto mb-4" />
            <h2 className={cn("text-lg font-semibold text-foreground mb-2", isBn && "lang-bn")}>
              {t("approvals.emptyTitle")}
            </h2>
            <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
              {t("approvals.emptyBody")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                onApprove={() => handleApprove(approval.id)}
                onReject={() => handleReject(approval.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
