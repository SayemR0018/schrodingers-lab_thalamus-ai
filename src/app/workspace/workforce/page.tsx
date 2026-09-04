"use client";

import Link from "next/link";
import { TrendingUp, Megaphone, Package, HeartHandshake, Wallet, FileText, Cog, Lock, ChevronRight } from "lucide-react";
import { mockAgents } from "@/data/mock/agents";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  "sales-analyst": TrendingUp,
  "marketing-agent": Megaphone,
  "inventory-agent": Package,
  "customer-success": HeartHandshake,
  "finance-agent": Wallet,
  "policy-docs-agent": FileText,
  "automation-agent": Cog,
};

const colorMap: Record<string, string> = {
  "agent-sales": "bg-[hsl(260,50%,55%/0.1)] text-[hsl(260,50%,55%)] dark:bg-[hsl(260,45%,60%/0.12)] dark:text-[hsl(260,45%,60%)]",
  "agent-marketing": "bg-[hsl(25,80%,55%/0.1)] text-[hsl(25,80%,55%)] dark:bg-[hsl(25,65%,55%/0.12)] dark:text-[hsl(25,65%,55%)]",
  "agent-inventory": "bg-[hsl(145,50%,45%/0.1)] text-[hsl(145,50%,45%)] dark:bg-[hsl(145,40%,50%/0.12)] dark:text-[hsl(145,40%,50%)]",
  "agent-customer": "bg-[hsl(210,60%,50%/0.1)] text-[hsl(210,60%,50%)] dark:bg-[hsl(210,50%,55%/0.12)] dark:text-[hsl(210,50%,55%)]",
  "agent-finance": "bg-[hsl(280,45%,50%/0.1)] text-[hsl(280,45%,50%)] dark:bg-[hsl(280,40%,55%/0.12)] dark:text-[hsl(280,40%,55%)]",
  "agent-policy": "bg-[hsl(188,55%,38%/0.1)] text-[hsl(188,55%,38%)] dark:bg-[hsl(188,45%,50%/0.12)] dark:text-[hsl(188,45%,50%)]",
  "agent-automation": "bg-[hsl(0,0%,55%/0.1)] text-[hsl(0,0%,55%)] dark:bg-[hsl(0,0%,50%/0.12)] dark:text-[hsl(0,0%,50%)]",
};

export default function WorkforcePage() {
  const { t } = useTranslation();
  const isBn = useAppStore((s) => s.language) === "bn";
  const activeAgents = mockAgents.filter((a) => a.status === "active");
  const lockedAgents = mockAgents.filter((a) => a.status === "locked");

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={cn("text-2xl font-semibold text-foreground mb-2", isBn && "lang-bn")}>
            {t("workforce.title")}
          </h1>
          <p className={cn("text-foreground-muted", isBn && "lang-bn")}>
            {t("workforce.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {mockAgents.map((agent) => {
            const Icon = iconMap[agent.id] || Cog;
            const isLocked = agent.status === "locked";

            return (
              <Link
                key={agent.id}
                href={`/workspace/workforce/${agent.id}`}
                className={cn(
                  "glass rounded-xl p-5 group hover:bg-surface-elevated transition-colors",
                  isLocked && "opacity-70"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", colorMap[agent.colorKey])}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn("font-semibold text-foreground", isBn && "lang-bn")}>
                        {isBn && agent.nameBn ? agent.nameBn : agent.name}
                      </h3>
                      {isLocked ? (
                        <div className="flex items-center gap-1 text-locked">
                          <Lock className="h-3 w-3" />
                          <span className="text-xs font-medium uppercase">
                            {t("workforce.locked")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <StatusIndicator status="active" />
                          <span className="text-xs font-medium uppercase text-success">
                            {t("workforce.active")}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className={cn("text-sm text-foreground-muted line-clamp-2", isBn && "lang-bn")}>
                      {isBn && agent.descriptionBn ? agent.descriptionBn : agent.description}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-foreground-subtle group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
