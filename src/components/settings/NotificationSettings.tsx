"use client";

import { Lightbulb, CheckSquare, Bot, Database, Bell } from "lucide-react";
import { useUserStore } from "@/store/user.store";
import { cn } from "@/lib/utils";

export function NotificationSettings() {
  const { notificationSettings, updateNotificationSettings } = useUserStore();

  const settings = [
    { id: "insights" as const, label: "Insights", description: "When new insights are discovered", icon: Lightbulb },
    { id: "approvals" as const, label: "Approvals", description: "When actions need your approval", icon: CheckSquare },
    { id: "agentActivity" as const, label: "Agent Activity", description: "When agents complete tasks", icon: Bot },
    { id: "dataUpdates" as const, label: "Data Updates", description: "When business data changes", icon: Database },
    { id: "systemNotifications" as const, label: "System", description: "Important system notifications", icon: Bell },
  ];

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
      <p className="text-sm text-foreground-muted mb-6">
        Choose what you want to be notified about
      </p>
      
      <div className="space-y-4">
        {settings.map((setting) => {
          const Icon = setting.icon;
          const isEnabled = notificationSettings[setting.id];
          
          return (
            <div
              key={setting.id}
              className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface">
                  <Icon className="h-5 w-5 text-foreground-muted" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{setting.label}</p>
                  <p className="text-sm text-foreground-muted">{setting.description}</p>
                </div>
              </div>
              
              <button
                onClick={() => updateNotificationSettings({ [setting.id]: !isEnabled })}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
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
    </div>
  );
}
