"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ReportWorkspace } from "@/components/reports/ReportWorkspace";
import { getReportById } from "@/data/mock/reports";

interface ReportDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = use(params);
  const report = getReportById(id);

  if (!report) {
    notFound();
  }

  return <ReportWorkspace report={report} />;
}
