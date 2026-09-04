"use client";

import { useState } from "react";
import type { Report } from "@/services/types";
import { mockReports } from "@/data/mock/reports";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { ReportHeader } from "./ReportHeader";
import { KeyFindings } from "./KeyFindings";
import { EvidenceList } from "./EvidenceList";
import { Recommendation } from "./Recommendation";
import { EvidenceDrawer } from "./EvidenceDrawer";
import { cn } from "@/lib/utils";

interface ReportWorkspaceProps {
  report: Report;
}

export function ReportWorkspace({ report }: ReportWorkspaceProps) {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  const mock = mockReports.find((r) => r.id === report.id);
  const title = isBengali && mock?.titleBn ? mock.titleBn : report.title;
  const summary = isBengali && mock?.summaryBn ? mock.summaryBn : report.summary;
  const contextUsedBn = mock?.contextUsedBn;

  // Build a translated contextUsed array
  const contextUsed = (() => {
    if (isBengali && contextUsedBn) return contextUsedBn;
    return report.contextUsed;
  })();

  return (
    <div className="min-h-full bg-background">
      <ReportHeader report={{ ...report, title }} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Executive Summary */}
        <div className="glass rounded-xl p-6 mb-6">
          <h2 className={cn("text-lg font-semibold text-foreground mb-3", bengaliClass)}>
            {t("reportsDetail.executiveSummary")}
          </h2>
          <p className={cn("text-foreground-muted leading-relaxed", bengaliClass)}>
            {summary}
          </p>
        </div>

        {/* Key Findings */}
        <div className="mb-6">
          <KeyFindings findings={report.findings} mockFindingsBn={mock?.findingsBn} />
        </div>

        {/* Context Used */}
        <div className="glass rounded-xl p-6 mb-6">
          <h2 className={cn("text-lg font-semibold text-foreground mb-3", bengaliClass)}>
            {t("reportsDetail.contextUsed")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {contextUsed.map((context) => (
              <span
                key={context}
                className={cn("px-3 py-1 rounded-full bg-surface-elevated text-sm text-foreground-muted", bengaliClass)}
              >
                {context}
              </span>
            ))}
          </div>
        </div>

        {/* Evidence */}
        <div className="mb-6">
          <EvidenceList
            evidence={report.evidence}
            onViewEvidence={() => setEvidenceOpen(true)}
          />
        </div>

        {/* Recommendation */}
        <Recommendation recommendation={{
          ...report.recommendation,
          text: isBengali && mock?.recommendationBn ? mock.recommendationBn : report.recommendation.text,
        }} />
      </div>

      {/* Evidence Drawer */}
      <EvidenceDrawer
        open={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        evidence={report.evidence}
        title={title}
      />
    </div>
  );
}
