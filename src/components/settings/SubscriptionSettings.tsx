"use client";

import { CreditCard, Zap, Database, Users, ArrowUpRight } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { cn } from "@/lib/utils";

export function SubscriptionSettings() {
  const { subscription } = useUserStore();

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Subscription & License</h2>
        
        {/* Current Plan */}
        <div className="p-4 rounded-lg bg-accent-soft border border-accent/20 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-muted">Current Plan</p>
              <p className="text-2xl font-semibold text-foreground">{subscription.plan}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-soft text-success text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {subscription.status}
            </div>
          </div>
          <p className="text-sm text-foreground-muted mt-2">
            Renewal: {subscription.renewal}
          </p>
        </div>

        {/* Usage */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground-subtle uppercase tracking-wider">Usage</h3>
          
          <div className="space-y-3">
            <UsageBar
              icon={Zap}
              label="AI Activity"
              used={subscription.usage.aiActivity}
              limit={100}
              unit="%"
            />
            <UsageBar
              icon={Database}
              label="Data Sources"
              used={subscription.usage.dataSources.used}
              limit={subscription.usage.dataSources.limit}
            />
            <UsageBar
              icon={Users}
              label="Team Members"
              used={subscription.usage.teamMembers.used}
              limit={subscription.usage.teamMembers.limit}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium">
            Upgrade
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium">
            Manage plan
          </button>
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-surface-elevated transition-colors text-sm font-medium">
            View usage
          </button>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-3">Billing</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated">
          <CreditCard className="h-5 w-5 text-foreground-muted" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
            <p className="text-xs text-foreground-muted">Expires 12/27</p>
          </div>
          <button className="text-sm text-accent hover:underline">Update</button>
        </div>
      </div>
    </div>
  );
}

function UsageBar({
  icon: Icon,
  label,
  used,
  limit,
  unit = "",
}: {
  icon: React.ElementType;
  label: string;
  used: number;
  limit: number;
  unit?: string;
}) {
  const percentage = (used / limit) * 100;
  const isHigh = percentage > 80;

  return (
    <div className="p-3 rounded-lg bg-surface-elevated">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-foreground-muted" />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className="text-sm text-foreground-muted">
          {used}{unit} / {limit}{unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isHigh ? "bg-warning" : "bg-accent"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
