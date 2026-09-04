"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Plug,
} from "lucide-react";
import { metricService } from "@/services/metric.service";
import { insightService } from "@/services/insight.service";
import { approvalService } from "@/services/approval.service";
import { activityService } from "@/services/live-activity.service";
import { useUserStore } from "@/store/user.store";
import { useAppStore } from "@/store/app.store";
import { useMounted } from "@/lib/useMounted";
import { useTranslation } from "@/lib/i18n";
import {
  formatBDT,
  formatNumber,
  formatPercent,
  formatRelative,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/ui/Sparkline";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { mockIntegrations } from "@/data/mock/integrations";
import type { Insight } from "@/data/demo/insights";
import type { ActivityItem } from "@/data/demo/activity";

function connectedSourceCount(): number {
  return mockIntegrations.filter((i) => i.status === "connected").length;
}

function greetingKey(hour: number): "overview.greetingMorning" | "overview.greetingAfternoon" | "overview.greetingEvening" {
  if (hour < 12) return "overview.greetingMorning";
  if (hour < 18) return "overview.greetingAfternoon";
  return "overview.greetingEvening";
}

function agentLabel(agentId: string): string {
  switch (agentId) {
    case "sales-analyst":
      return "Sales Analyst";
    case "inventory-agent":
      return "Inventory Agent";
    case "customer-success":
      return "Customer Success";
    case "marketing-agent":
      return "Marketing Agent";
    case "finance-agent":
      return "Finance Agent";
    case "automation-agent":
      return "Automation Agent";
    default:
      return agentId;
  }
}

function riskPillClass(risk: Insight["riskTier"]): string {
  switch (risk) {
    case "low":
      return "bg-success-soft text-success";
    case "medium":
      return "bg-warning-soft text-warning";
    case "high":
      return "bg-destructive-soft text-destructive";
  }
}

function stageLabelKey(stage: Insight["stage"]): string {
  switch (stage) {
    case "suggested":
      return "overview.stageSuggested";
    case "pending_approval":
      return "overview.stagePending";
    case "executing":
      return "overview.stageExecuting";
    case "done":
      return "overview.stageDone";
    case "logged":
      return "overview.stageLogged";
    case "rejected":
      return "overview.stageRejected";
  }
}

function activityIcon(actor: ActivityItem["actor"]) {
  if (actor === "user") return ShieldCheck;
  return Sparkles;
}

export default function WorkspaceOverviewPage() {
  const mounted = useMounted();
  const [tick, setTick] = useState(0);
  const language = useAppStore((s) => s.language);
  const isBn = language === "bn";
  const { t } = useTranslation();
  const activeWorkspace = useUserStore((s) => {
    const state = useUserStore.getState();
    return state.workspaces.find((w) => w.id === state.activeWorkspaceId);
  });

  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => setTick((n) => n + 1), 800);
    return () => clearInterval(id);
  }, [mounted]);

  const view = useMemo(() => {
    const health = metricService.health();
    const important = insightService.feed({ stage: "suggested" }).slice(0, 3);
    const approvals = approvalService.pending().slice(0, 2);
    const recentActivity = activityService.recent({ limit: 5 });
    const connected = connectedSourceCount();
    const revDelta =
      health.revenuePrev30 > 0
        ? (health.revenue30 - health.revenuePrev30) / health.revenuePrev30
        : 0;
    const custDelta =
      health.activeCustomersPrev > 0
        ? (health.activeCustomers - health.activeCustomersPrev) / health.activeCustomersPrev
        : 0;
    const inventoryDelta =
      health.inventoryAtRiskPrev > 0
        ? (health.inventoryAtRisk - health.inventoryAtRiskPrev) / health.inventoryAtRiskPrev
        : -0.18;
    return {
      health,
      important,
      approvals,
      recentActivity,
      connected,
      revDelta,
      custDelta,
      inventoryDelta,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, mounted]);

  const now = useMemo(() => new Date(), [tick, mounted]);
  const businessName =
    activeWorkspace?.name || activeWorkspace?.industry || t("common.search");
  const greetingText = t(greetingKey(now.getHours()));

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            {/* Time-of-day greeting resolves against the visitor's clock, which
                differs from the (UTC) server clock. */}
            <span suppressHydrationWarning className={cn(isBn && "lang-bn")}>
              {greetingText}
              {t("overview.greetingIntro")}
            </span>
          </div>
          {/* The business name comes from persisted client state (and from
              landing onboarding via ThalamusBridge), so the server cannot
              know it and always renders the default workspace name. */}
          <h1
            suppressHydrationWarning
            className={cn("mt-1 text-3xl font-semibold text-foreground", isBn && "lang-bn")}
          >
            {businessName}
          </h1>
          <p className={cn("mt-1 text-sm text-foreground-muted", isBn && "lang-bn")}>
            {t("overview.subtitle")}
          </p>
        </header>

        {/* Nudges */}
        <div className="space-y-3">
          {view.health.dhakaDip.pct < -0.05 && (
            <Nudge tone="warning" icon={AlertTriangle}>
              <div className="flex-1">
                <p className={cn("font-medium text-foreground", isBn && "lang-bn")}>
                  {t("overview.nudgeDhaka", {
                    pct: (view.health.dhakaDip.pct * 100).toFixed(1),
                  })}
                </p>
                <p className={cn("mt-1 text-sm text-foreground-muted", isBn && "lang-bn")}>
                  {t("overview.nudgeDhakaBody")}
                </p>
              </div>
              <Link
                href="/workspace/insights?focus=ins-1"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                {t("overview.view")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Nudge>
          )}

          {mounted && view.connected < 3 && (
            <Nudge tone="info" icon={Plug}>
              <div className="flex-1">
                <p className={cn("font-medium text-foreground", isBn && "lang-bn")}>
                  {t("overview.nudgeConnect")}
                </p>
                <p className={cn("mt-1 text-sm text-foreground-muted", isBn && "lang-bn")}>
                  {t("overview.nudgeConnectBody")}
                </p>
              </div>
              <Link
                href="/workspace/integrations"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                {t("overview.connectCta")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Nudge>
          )}
        </div>

        {/* KPI Grid */}
        <section data-tour="overview-kpis" className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label={t("overview.revenue")}
            value={formatBDT(view.health.revenue30, language)}
            delta={view.revDelta}
            href="/workspace/insights?filter=revenue"
            sparkline={view.health.revenueTrend}
            isBn={isBn}
          />
          <KpiCard
            label={t("overview.customers")}
            value={formatNumber(view.health.activeCustomers, language)}
            delta={view.custDelta}
            href="/workspace/insights?filter=customers"
            isBn={isBn}
          />
          <KpiCard
            label={t("overview.inventory")}
            value={`${formatNumber(view.health.inventoryAtRisk, language)} SKUs`}
            delta={view.inventoryDelta}
            href="/workspace/insights?filter=stockout"
            isBn={isBn}
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Important Today */}
          <GlassSurface padding="lg" className="space-y-3">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-accent" />
                <h2 className={cn("font-semibold text-foreground", isBn && "lang-bn")}>
                  {t("overview.importantToday")}
                </h2>
              </div>
              <Link
                href="/workspace/insights"
                className="text-xs font-medium text-accent hover:underline"
              >
                {t("overview.viewAll")}
              </Link>
            </header>
            <div data-tour="overview-important" className="space-y-2">
              {view.important.length === 0 ? (
                <p className={cn("text-sm text-foreground-muted", isBn && "lang-bn")}>
                  {t("overview.nothingImportant")}
                </p>
              ) : (
                view.important.map((insight) => (
                  <Link
                    key={insight.id}
                    href={`/workspace/insights?focus=${insight.id}`}
                    className="flex items-start gap-3 rounded-lg border border-border bg-surface-elevated p-3 transition-colors hover:bg-surface"
                  >
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-medium text-foreground", isBn && "lang-bn")}>
                        {isBn && insight.titleBn ? insight.titleBn : insight.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-foreground-muted">
                        <span>{agentLabel(insight.agentId)}</span>
                        <span>·</span>
                        <span>{t(stageLabelKey(insight.stage))}</span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                        riskPillClass(insight.riskTier)
                      )}
                    >
                      {t(
                        insight.riskTier === "low"
                          ? "overview.pillLow"
                          : insight.riskTier === "medium"
                            ? "overview.pillMedium"
                            : "overview.pillHigh"
                      )}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </GlassSurface>

          {/* Recommended Actions */}
          <GlassSurface padding="lg" className="space-y-3">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <h2 className={cn("font-semibold text-foreground", isBn && "lang-bn")}>
                  {t("overview.recommendedActions")}
                </h2>
              </div>
              <Link
                href="/workspace/approvals"
                className="text-xs font-medium text-accent hover:underline"
              >
                {t("overview.viewAll")}
              </Link>
            </header>
            <div data-tour="overview-actions" className="space-y-2">
              {view.approvals.length === 0 ? (
                <p className={cn("text-sm text-foreground-muted", isBn && "lang-bn")}>
                  {t("overview.noApprovals")}
                </p>
              ) : (
                view.approvals.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border bg-surface-elevated p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={cn("font-medium text-foreground", isBn && "lang-bn")}>
                          {isBn && item.titleBn ? item.titleBn : item.title}
                        </p>
                        <p className={cn("mt-1 line-clamp-2 text-sm text-foreground-muted", isBn && "lang-bn")}>
                          {isBn && item.bodyBn ? item.bodyBn : item.body}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-foreground-muted">
                          <span>{agentLabel(item.agentId)}</span>
                          <span>·</span>
                          <span className="font-medium uppercase">
                            {Math.round(item.confidence)}% confidence
                          </span>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                          riskPillClass(item.riskTier)
                        )}
                      >
                        {t(
                          item.riskTier === "low"
                            ? "overview.pillLow"
                            : item.riskTier === "medium"
                              ? "overview.pillMedium"
                              : "overview.pillHigh"
                        )}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Link
                        href={`/workspace/approvals?focus=${item.id}`}
                        className="text-xs font-medium text-foreground-muted hover:text-foreground"
                      >
                        {t("overview.details")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          approvalService.approve(item.id);
                          setTick((n) => n + 1);
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90"
                      >
                        {t("overview.approve")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassSurface>
        </div>

        {/* Recent Activity */}
        <GlassSurface padding="lg" className="space-y-3">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h2 className={cn("font-semibold text-foreground", isBn && "lang-bn")}>
                {t("overview.recentActivity")}
              </h2>
            </div>
            <Link
              href="/workspace/activity"
              className="text-xs font-medium text-accent hover:underline"
            >
              {t("overview.viewAll")}
            </Link>
          </header>
          <div className="divide-y divide-border-subtle">
            {view.recentActivity.length === 0 ? (
              <p className={cn("text-sm text-foreground-muted", isBn && "lang-bn")}>
                {t("overview.noActivity")}
              </p>
            ) : (
              view.recentActivity.map((item) => {
                const Icon = activityIcon(item.actor);
                return (
                  <div key={item.id} className="flex items-start gap-3 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm text-foreground", isBn && "lang-bn")}>
                        <span className="font-medium">{item.actorName}</span>{" "}
                        <span className="text-foreground-muted">
                          {isBn && item.verbBn ? item.verbBn : item.verb}
                        </span>
                        {item.target && (
                          <>
                            {" "}
                            <span className="font-medium">
                              {isBn && item.targetBn ? item.targetBn : item.target}
                            </span>
                          </>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-foreground-subtle">
                        {formatRelative(item.isoDate, language)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  delta: number;
  href: string;
  sparkline?: number[];
  isBn?: boolean;
}

function KpiCard({ label, value, delta, href, sparkline, isBn }: KpiCardProps) {
  const positive = delta >= 0;
  const Arrow = positive ? ArrowUp : ArrowDown;
  return (
    <Link
      href={href}
      className="block transition-transform hover:-translate-y-0.5"
    >
      <GlassSurface padding="lg" className="space-y-3">
        <div className="flex items-center justify-between">
          <p className={cn("text-sm text-foreground-muted", isBn && "lang-bn")}>{label}</p>
          <ArrowUpRight className="h-4 w-4 text-foreground-subtle" />
        </div>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              positive ? "text-success" : "text-destructive"
            )}
          >
            <Arrow className="h-3 w-3" />
            {formatPercent(Math.abs(delta), "en")}
          </span>
          {sparkline && sparkline.length > 1 && (
            <Sparkline
              data={sparkline}
              color={positive ? "var(--success, #16a34a)" : "var(--destructive, #dc2626)"}
              width={120}
              height={28}
            />
          )}
        </div>
      </GlassSurface>
    </Link>
  );
}

interface NudgeProps {
  tone: "warning" | "info";
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

function Nudge({ tone, icon: Icon, children }: NudgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border p-4",
        tone === "warning"
          ? "border-warning-soft bg-warning-soft/40"
          : "border-accent-soft bg-accent-soft/30"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          tone === "warning" ? "bg-warning-soft" : "bg-accent-soft"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4",
            tone === "warning" ? "text-warning" : "text-accent"
          )}
        />
      </div>
      {children}
    </div>
  );
}
