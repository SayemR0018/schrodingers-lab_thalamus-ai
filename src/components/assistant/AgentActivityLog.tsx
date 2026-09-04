"use client";

import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

export interface AgentActivity {
  id: string;
  state: "working" | "done";
}

interface AgentActivityLogProps {
  agents: AgentActivity[];
  className?: string;
}

/**
 * Compact "live" log of which agents are currently working and which
 * have completed. Updated as we receive `agent` SSE events.
 */
export function AgentActivityLog({ agents, className }: AgentActivityLogProps) {
  const { t } = useTranslation();
  if (agents.length === 0) return null;

  return (
    <div className={cn("space-y-1.5", className)}>
      {agents.map((a) => (
        <div key={a.id} className="flex items-center gap-2 text-xs">
          {a.state === "done" ? (
            <Check className="h-3 w-3 text-success" />
          ) : (
            <Loader2 className="h-3 w-3 animate-spin text-accent" />
          )}
          <span
            className={cn(
              a.state === "done"
                ? "text-foreground-muted"
                : "text-foreground font-medium"
            )}
          >
            {formatAgentName(a.id)}
            {a.state === "done" ? ` — ${t("assistant.processing.complete")}` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatAgentName(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
