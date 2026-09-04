"use client";

import { cn } from "@/lib/utils";

export interface StatusIndicatorProps {
  status: "active" | "locked" | "warning" | "error";
  size?: "sm" | "md";
  pulse?: boolean;
  className?: string;
}

export function StatusIndicator({
  status,
  size = "sm",
  pulse = false,
  className,
}: StatusIndicatorProps) {
  return (
    <span
      className={cn(
        "relative inline-flex rounded-full",
        {
          "h-2 w-2": size === "sm",
          "h-2.5 w-2.5": size === "md",
        },
        {
          "bg-success": status === "active",
          "bg-locked": status === "locked",
          "bg-warning": status === "warning",
          "bg-destructive": status === "error",
        },
        className
      )}
    >
      {pulse && status === "active" && (
        <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-75" />
      )}
    </span>
  );
}
