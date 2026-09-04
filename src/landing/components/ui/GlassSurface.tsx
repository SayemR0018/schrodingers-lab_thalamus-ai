"use client";

import { cn } from "@/landing/lib/cn";
import { usePointerGlow } from "@/landing/hooks/usePointerGlow";

type GlassSurfaceProps = {
  className?: string;
  interactive?: boolean;
  children: React.ReactNode;
};

export function GlassSurface({
  className,
  interactive = false,
  children,
}: GlassSurfaceProps) {
  const glowRef = usePointerGlow<HTMLDivElement>();

  return (
    <div
      ref={glowRef}
      className={cn(interactive ? "glass-interactive" : "glass", className)}
    >
      {children}
    </div>
  );
}
