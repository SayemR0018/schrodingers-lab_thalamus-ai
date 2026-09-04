"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  ShoppingBag,
  MessageCircle,
  Mail,
  CreditCard,
  Share2,
  Image,
  FileUp,
  Calculator,
  Users,
  Check,
  Plus,
  Clock,
  Loader2,
} from "lucide-react";
import { mockIntegrations } from "@/data/mock/integrations";
import type { Integration } from "@/data/mock/types";
import { useDataStore } from "@/store/data.store";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  FileSpreadsheet,
  ShoppingBag,
  MessageCircle,
  Mail,
  CreditCard,
  Facebook: Share2,
  Instagram: Image,
  FileUp,
  Calculator,
  Users,
};

type ConnectStage = "idle" | "connecting" | "permissions" | "syncing" | "mapping" | "complete";

const stageKeyMap: Record<ConnectStage, string> = {
  idle: "",
  connecting: "integrations.stageConnecting",
  permissions: "integrations.stagePermissions",
  syncing: "integrations.stageSyncing",
  mapping: "integrations.stageMapping",
  complete: "integrations.stageComplete",
};

export default function IntegrationsPage() {
  const { t } = useTranslation();
  const isBn = useAppStore((s) => s.language) === "bn";
  const { addRecord } = useDataStore();
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectStage, setConnectStage] = useState<ConnectStage>("idle");

  const connected = integrations.filter((i) => i.status === "connected");
  const available = integrations.filter((i) => i.status === "available");
  const comingSoon = integrations.filter((i) => i.status === "coming_soon");

  const handleConnect = async (integration: Integration) => {
    setConnectingId(integration.id);

    setConnectStage("connecting");
    await new Promise((r) => setTimeout(r, 800));

    setConnectStage("permissions");
    await new Promise((r) => setTimeout(r, 1000));

    setConnectStage("syncing");
    await new Promise((r) => setTimeout(r, 1200));

    setConnectStage("mapping");
    await new Promise((r) => setTimeout(r, 1000));

    setConnectStage("complete");

    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integration.id
          ? {
              ...i,
              status: "connected" as const,
              connectedAt: t("common.justNow"),
              entityCounts: [
                { label: "Records", count: Math.floor(Math.random() * 500) + 100 },
              ],
            }
          : i
      )
    );

    for (let i = 0; i < 3; i++) {
      addRecord("products", {
        name: `${integration.name} Import ${i + 1}`,
        source: integration.name,
        importedAt: new Date().toISOString(),
      });
    }

    await new Promise((r) => setTimeout(r, 800));
    setConnectingId(null);
    setConnectStage("idle");
  };

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={cn("text-2xl font-semibold text-foreground mb-2", isBn && "lang-bn")}>
            {t("integrations.title")}
          </h1>
          <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
            {t("integrations.subtitle")}
          </p>
        </div>

        {/* Connected */}
        {connected.length > 0 && (
          <div className="mb-8">
            <h2 className={cn("text-sm font-medium text-foreground-subtle uppercase tracking-wider mb-4", isBn && "lang-bn")}>
              {t("integrations.tabConnected")} ({connected.length})
            </h2>
            <div className="space-y-3">
              {connected.map((integration) => {
                const Icon = iconMap[integration.icon] || FileUp;
                return (
                  <div
                    key={integration.id}
                    className="glass rounded-xl p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-soft">
                        <Icon className="h-6 w-6 text-success" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{integration.name}</h3>
                          <div className="flex items-center gap-1 text-success text-xs">
                            <Check className="h-3 w-3" />
                            {t("integrations.tabConnected")}
                          </div>
                        </div>
                        <p className={cn("text-sm text-foreground-muted mb-3", isBn && "lang-bn")}>
                          {integration.description}
                        </p>

                        {integration.entityCounts && (
                          <div className="flex gap-4">
                            {integration.entityCounts.map((ec) => (
                              <div key={ec.label}>
                                <span className="text-lg font-semibold text-foreground">
                                  {ec.count.toLocaleString()}
                                </span>
                                <span className="text-xs text-foreground-muted ml-1">
                                  {ec.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available */}
        {available.length > 0 && (
          <div className="mb-8">
            <h2 className={cn("text-sm font-medium text-foreground-subtle uppercase tracking-wider mb-4", isBn && "lang-bn")}>
              {t("integrations.tabAvailable")}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {available.map((integration) => {
                const Icon = iconMap[integration.icon] || FileUp;
                const isConnecting = connectingId === integration.id;
                return (
                  <button
                    key={integration.id}
                    onClick={() => !isConnecting && handleConnect(integration)}
                    disabled={isConnecting}
                    className={cn(
                      "glass rounded-xl p-4 text-left transition-colors",
                      isConnecting ? "cursor-wait" : "hover:bg-surface-elevated group"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        isConnecting ? "bg-accent-soft" : "bg-surface-elevated"
                      )}>
                        {isConnecting ? (
                          <Loader2 className="h-5 w-5 text-accent animate-spin" />
                        ) : (
                          <Icon className="h-5 w-5 text-foreground-muted" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={cn("font-medium text-foreground", isBn && "lang-bn")}>
                          {integration.name}
                        </h3>
                        <p className={cn("text-xs text-foreground-muted", isBn && "lang-bn")}>
                          {isConnecting
                            ? stageKeyMap[connectStage]
                              ? t(stageKeyMap[connectStage])
                              : ""
                            : integration.description}
                        </p>
                      </div>
                      {!isConnecting && (
                        <Plus className="h-5 w-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        {comingSoon.length > 0 && (
          <div>
            <h2 className={cn("text-sm font-medium text-foreground-subtle uppercase tracking-wider mb-4", isBn && "lang-bn")}>
              {t("integrations.tabAll")}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {comingSoon.map((integration) => {
                const Icon = iconMap[integration.icon] || FileUp;
                return (
                  <div
                    key={integration.id}
                    className="glass rounded-xl p-4 opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated">
                        <Icon className="h-5 w-5 text-foreground-muted" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{integration.name}</h3>
                        <p className={cn("text-xs text-foreground-muted", isBn && "lang-bn")}>
                          {integration.description}
                        </p>
                      </div>
                      <Clock className="h-5 w-5 text-foreground-subtle" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
