"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/landing/lib/i18n/store";
import { setLanguage } from "@/landing/lib/i18n/store";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";
import type { Language } from "@/landing/lib/i18n";

export interface LanguageToggleProps {
  /** Visual size — `sm` for compact navbar placement, `md` for settings panel. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Segmented EN / বাং language switcher. Same visual language as the
 * existing `ThemeToggle.tsx`: glass background, accent-colored active
 * state, inline pill mirroring the navbar's `.glass` utility.
 *
 * Two adjacent buttons share a single glass pill so the active state
 * is unambiguous. Active button uses `bg-accent-soft text-accent`,
 * matching the highlight treatment used elsewhere in the app.
 */
export function LanguageToggle({ size = "sm", className }: LanguageToggleProps) {
  const language = useLanguage();
  const { t } = useTranslation();

  const containerSize =
    size === "md"
      ? "h-10 px-1 text-sm"
      : "h-9 px-0.5 text-xs";
  const buttonSize = size === "md" ? "min-w-[64px] px-3" : "min-w-[34px] px-2";

  return (
    <div
      role="group"
      aria-label={t("language.switcherAria")}
      className={cn(
        "glass inline-flex items-center gap-1 rounded-lg",
        containerSize,
        className
      )}
    >
      {size === "md" && (
        <Languages
          className="ml-1 h-4 w-4 shrink-0 text-muted"
          aria-hidden="true"
        />
      )}
      <button
        type="button"
        onClick={() => setLanguage("en" as Language)}
        aria-pressed={language === "en"}
        aria-label={t("language.englishLabel")}
        className={cn(
          "rounded-md font-medium transition-all",
          buttonSize,
          language === "en"
            ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
            : "text-muted hover:text-foreground hover:bg-[color:var(--surface)]"
        )}
      >
        {t("language.en")}
      </button>
      <button
        type="button"
        onClick={() => setLanguage("bn" as Language)}
        aria-pressed={language === "bn"}
        aria-label={t("language.banglaLabel")}
        className={cn(
          "rounded-md font-medium transition-all",
          buttonSize,
          language === "bn"
            ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
            : "text-muted hover:text-foreground hover:bg-[color:var(--surface)]",
          language === "bn" && "lang-bn"
        )}
      >
        {t("language.bn")}
      </button>
    </div>
  );
}
