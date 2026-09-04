import type { Metadata } from "next";
import { WorkspaceHandoff } from "@/landing/components/workspace/WorkspaceHandoff";

/**
 * Context handoff summary — the last step of the public onboarding funnel.
 *
 * Served from `/handoff` rather than the standalone app's `/workspace`,
 * which now belongs to the product Overview page. Its primary CTA hands the
 * user off to `/workspace`.
 */
export const metadata: Metadata = {
  title: "Business Brain Workspace — Thalamus AI",
  description: "Your locally prepared THALAMUS business context.",
};

export default function HandoffPage() {
  return <WorkspaceHandoff />;
}
