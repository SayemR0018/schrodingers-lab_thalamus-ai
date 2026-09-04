"use client";

import { cn } from "@/lib/utils";

interface StreamingDotProps {
  className?: string;
}

/**
 * Blinking cursor indicator that sits at the end of the in-progress
 * assistant message while tokens are streaming.
 */
export function StreamingDot({ className }: StreamingDotProps) {
  return (
    <span
      className={cn(
        "ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-accent",
        className
      )}
      aria-label="Streaming"
    />
  );
}
