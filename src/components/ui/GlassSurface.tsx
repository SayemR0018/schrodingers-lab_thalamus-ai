"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl",
          {
            glass: variant === "default",
            "glass-subtle": variant === "subtle",
            "glass shadow-lg": variant === "elevated",
          },
          {
            "p-0": padding === "none",
            "p-3": padding === "sm",
            "p-4": padding === "md",
            "p-6": padding === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassSurface.displayName = "GlassSurface";
