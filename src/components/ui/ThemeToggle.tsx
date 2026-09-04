"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useAppStore();
  const mounted = useIsMounted();

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg">
        <Monitor className="h-4 w-4 text-foreground-muted" />
      </div>
    );
  }

  const cycleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg",
        "text-foreground-muted hover:text-foreground",
        "hover:bg-surface-elevated transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      )}
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      {theme === "light" && <Sun className="h-4 w-4" />}
      {theme === "dark" && <Moon className="h-4 w-4" />}
      {theme === "system" && <Monitor className="h-4 w-4" />}
    </button>
  );
}
