"use client";

import { Box, Database, TrendingUp } from "lucide-react";
import { cn } from "@/landing/lib/cn";
import { usePointerGlow } from "@/landing/hooks/usePointerGlow";
import type { Agent, AgentId } from "@/landing/data/agents";

const icons = {
  product: Box,
  sales: TrendingUp,
  data: Database,
} as const;

type AgentCardProps = {
  agent: Agent;
  active: boolean;
  onFocus: (id: AgentId | null) => void;
  compact?: boolean;
};

export function AgentCard({ agent, active, onFocus, compact = false }: AgentCardProps) {
  const Icon = icons[agent.id];
  const glowRef = usePointerGlow<HTMLElement>();

  return (
    <article
      ref={glowRef}
      className={cn(
        "glass-interactive cursor-pointer rounded-2xl p-4 transition-transform duration-300",
        active && "border-[color:var(--border-strong)] -translate-y-0.5",
        !compact && "p-5",
      )}
      onMouseEnter={() => onFocus(agent.id)}
      onMouseLeave={() => onFocus(null)}
      onFocus={() => onFocus(agent.id)}
      onBlur={() => onFocus(null)}
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--border)] text-accent">
          <Icon size={16} strokeWidth={1.7} />
        </span>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{agent.name}</h3>
          {compact ? (
            <p className="mt-1 text-[13px] leading-5 text-muted">{agent.description}</p>
          ) : (
            <ul className="mt-2 space-y-1 text-[13px] text-muted">
              {agent.capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
