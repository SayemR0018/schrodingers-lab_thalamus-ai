"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98]":
              variant === "primary",
            "glass hover:bg-surface-elevated active:scale-[0.98]":
              variant === "secondary",
            "hover:bg-surface-elevated active:bg-surface":
              variant === "ghost",
            "border border-border bg-transparent hover:bg-surface-elevated":
              variant === "outline",
          },
          {
            "h-8 px-3 text-sm rounded-md": size === "sm",
            "h-10 px-4 text-sm rounded-lg": size === "md",
            "h-12 px-6 text-base rounded-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
