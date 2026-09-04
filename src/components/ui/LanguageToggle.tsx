"use client";

import { Languages } from "lucide-react";
import { useAppStore, type Language } from "@/store/app.store";
import { cn } from "@/lib/utils";

export interface LanguageToggleProps {
  /** Visual size — `sm` for compact TopBar placement, `md` for settings panel. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Segmented language switcher that mirrors the visual language of
 * `ThemeToggle.tsx` while presenting a binary EN / বাং choice rather
 * than a 3-state cycle.
 *
 * Two adjacent buttons share a single glassmorphic pill so the active
 * state is unambiguous. Active button uses `bg-accent-soft text-accent`,
 * matching the highlight treatment used elsewhere in the app (e.g.
 * `assistantCollapsed` state in TopBar).
 */
export function LanguageToggle({ size = "sm", className }: LanguageToggleProps) {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const containerSize =
    size === "md"
      ? "h-10 p-1 text-sm"
      : "h-9 p-0.5 text-xs";
  const buttonSize = size === "md" ? "min-w-[64px] px-3" : "min-w-[34px] px-2";

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "glass inline-flex items-center gap-1 rounded-lg",
        containerSize,
        className
      )}
    >
      {size === "md" && (
        <Languages
          className="ml-1 h-4 w-4 shrink-0 text-foreground-muted"
          aria-hidden="true"
        />
      )}
      <button
        type="button"
        onClick={() => setLanguage("en" as Language)}
        aria-pressed={language === "en"}
        aria-label="Switch to English"
        className={cn(
          "rounded-md font-medium transition-all",
          buttonSize,
          language === "en"
            ? "bg-accent-soft text-accent"
            : "text-foreground-muted hover:text-foreground hover:bg-surface"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("bn" as Language)}
        aria-pressed={language === "bn"}
        aria-label="Switch to বাংলা"
        className={cn(
          "rounded-md font-medium transition-all",
          buttonSize,
          language === "bn"
            ? "bg-accent-soft text-accent"
            : "text-foreground-muted hover:text-foreground hover:bg-surface",
          language === "bn" && "lang-bn"
        )}
      >
        বাং
      </button>
    </div>
  );
}
