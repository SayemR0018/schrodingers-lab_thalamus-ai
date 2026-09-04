"use client";

import { Shield, History, Bell } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { cn } from "@/lib/utils";

export function PrivacySettings() {
  const { privacySettings, updatePrivacySettings } = useUserStore();

  const settings = [
    {
      id: "requireApprovalForHighRisk" as const,
      label: "Require approval for high-risk actions",
      description: "Actions that could significantly impact your business require manual approval",
      icon: Shield,
    },
    {
      id: "showActivityHistory" as const,
      label: "Show activity history",
      description: "Keep a log of all actions taken in your workspace",
      icon: History,
    },
    {
      id: "notifyOnDataChanges" as const,
      label: "Notify when business data changes",
      description: "Get notified when business context is updated",
      icon: Bell,
    },
  ];

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Privacy & Safety</h2>
      <p className="text-sm text-foreground-muted mb-6">
        Control how Thalamus handles your data and actions
      </p>
      
      <div className="space-y-4">
        {settings.map((setting) => {
          const Icon = setting.icon;
          const isEnabled = privacySettings[setting.id];
          
          return (
            <div
              key={setting.id}
              className="flex items-start justify-between p-4 rounded-lg bg-surface-elevated"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface shrink-0">
                  <Icon className="h-5 w-5 text-foreground-muted" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{setting.label}</p>
                  <p className="text-sm text-foreground-muted">{setting.description}</p>
                </div>
              </div>
              
              <button
                onClick={() => updatePrivacySettings({ [setting.id]: !isEnabled })}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors shrink-0 ml-4",
                  isEnabled ? "bg-accent" : "bg-border"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                    isEnabled ? "left-6" : "left-1"
                  )}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-warning-soft border border-warning/20">
        <p className="text-sm text-foreground">
          <strong>Note:</strong> These are prototype settings. The production version will enforce real security and privacy controls through the backend.
        </p>
      </div>
    </div>
  );
}
