"use client";

import { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AssistantPanel } from "@/components/assistant/AssistantPanel";
import { HtmlLangUpdater } from "@/components/system/HtmlLangUpdater";
import { ThalamusBridge } from "@/lib/thalamus-bridge";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell rightPanel={<AssistantPanel />}>
      {/* Both render nothing. The bridge keeps landing onboarding context
          flowing into the workspace stores across every product route;
          HtmlLangUpdater tracks `<html lang>` for this surface. */}
      <ThalamusBridge />
      <HtmlLangUpdater />
      {children}
    </AppShell>
  );
}
