"use client";

import { agents, dataNode, type AgentId } from "@/landing/data/agents";
import { AgentCard } from "@/landing/components/platform/AgentCard";
import { cn } from "@/landing/lib/cn";

type PlatformGraphProps = {
  active: AgentId | null;
  onFocus: (id: AgentId | null) => void;
};

export function PlatformGraph({ active, onFocus }: PlatformGraphProps) {
  const product = agents[0];
  const sales = agents[1];

  return (
    <div className="glass relative overflow-hidden rounded-[28px] p-5 sm:p-8">
      <p className="eyebrow mb-6">Thalamus AI Platform</p>

      <div className="relative hidden min-h-[460px] lg:block">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 640 460"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="320"
            cy="210"
            r="78"
            className="stroke-[color:var(--border-strong)]"
            strokeDasharray="3 6"
            strokeWidth="1"
          />
          <path
            d="M248 186 C 190 140, 170 118, 150 96"
            strokeWidth="1.15"
            fill="none"
            className={cn("link-path", active && active !== "product" ? "is-dim" : "is-active")}
          />
          <path
            d="M392 186 C 450 140, 470 118, 490 96"
            strokeWidth="1.15"
            fill="none"
            className={cn("link-path", active && active !== "sales" ? "is-dim" : "is-active")}
          />
          <path
            d="M320 288 C 320 330, 320 350, 320 372"
            strokeWidth="1.15"
            fill="none"
            className={cn("link-path", active && active !== "data" ? "is-dim" : "is-active")}
          />
        </svg>

        <div className="absolute left-1/2 top-[148px] z-10 w-[180px] -translate-x-1/2 text-center">
          <IntelligenceCore active={Boolean(active)} />
        </div>

        <div className="absolute left-0 top-0 w-[220px]">
          <AgentCard agent={product} active={active === "product"} onFocus={onFocus} />
        </div>
        <div className="absolute right-0 top-0 w-[220px]">
          <AgentCard agent={sales} active={active === "sales"} onFocus={onFocus} />
        </div>
        <div className="absolute bottom-0 left-1/2 w-[240px] -translate-x-1/2">
          <AgentCard agent={dataNode} active={active === "data"} onFocus={onFocus} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 lg:hidden">
        <IntelligenceCore active={Boolean(active)} />
        <div className="h-8 w-px bg-[color:var(--border-strong)]" />
        <AgentCard agent={product} active={active === "product"} onFocus={onFocus} />
        <div className="h-8 w-px bg-[color:var(--border-strong)]" />
        <AgentCard agent={sales} active={active === "sales"} onFocus={onFocus} />
        <div className="h-8 w-px bg-[color:var(--border-strong)]" />
        <AgentCard agent={dataNode} active={active === "data"} onFocus={onFocus} />
      </div>
    </div>
  );
}

function IntelligenceCore({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "relative flex h-[132px] w-[132px] items-center justify-center rounded-full border border-[color:var(--border-strong)]",
          active && "shadow-[0_0_40px_-18px_var(--accent-glow)]",
        )}
      >
        <svg viewBox="0 0 88 88" className="core-orbit h-[88px] w-[88px]" aria-hidden="true">
          <circle
            cx="44"
            cy="44"
            r="34"
            fill="none"
            stroke="currentColor"
            className="text-accent"
            strokeOpacity="0.35"
            strokeDasharray="2 7"
          />
          <circle cx="44" cy="10" r="2" className="fill-accent" />
          <circle cx="74" cy="58" r="1.6" className="fill-accent" />
          <circle cx="16" cy="54" r="1.6" className="fill-accent" />
        </svg>
        <svg
          viewBox="0 0 32 32"
          className="absolute h-10 w-10 text-accent"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M16 8L23 12V20L16 24L9 20V12L16 8Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M16 8V16M16 16L23 12M16 16L9 12" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="16" cy="16" r="2" fill="currentColor" />
        </svg>
      </div>
      <p className="mt-3 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        Intelligence Core
      </p>
    </div>
  );
}
