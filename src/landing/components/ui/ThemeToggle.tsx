"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/landing/components/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-switch"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      <span className="theme-switch-thumb" aria-hidden="true" />
      <span className="relative z-10 flex items-center justify-center text-muted">
        <Sun size={13} strokeWidth={1.8} />
      </span>
      <span className="relative z-10 flex items-center justify-center text-muted">
        <Moon size={13} strokeWidth={1.8} />
      </span>
    </button>
  );
}
