"use client";

import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useAppStore } from "@/store/app.store";
import { useTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { cn } from "@/lib/utils";

export function AppearanceSettings() {
  const { theme, setTheme } = useAppStore();
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  const themes = [
    { id: "light" as const, icon: Sun, labelKey: "settings.theme.light", descKey: "settings.theme.lightDesc" },
    { id: "dark" as const, icon: Moon, labelKey: "settings.theme.dark", descKey: "settings.theme.darkDesc" },
    { id: "system" as const, icon: Monitor, labelKey: "settings.theme.system", descKey: "settings.theme.systemDesc" },
  ];

  return (
    <div className="glass rounded-xl p-6">
      <h2 className={cn("text-lg font-semibold text-foreground mb-4", bengaliClass)}>
        {t("settings.appearance.title")}
      </h2>
      <p className={cn("text-sm text-foreground-muted mb-6", bengaliClass)}>
        {t("settings.appearance.subtitle")}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.id;

          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={cn(
                "relative p-4 rounded-xl text-left transition-colors",
                isActive
                  ? "bg-accent-soft border-2 border-accent"
                  : "bg-surface-elevated border-2 border-transparent hover:border-border"
              )}
            >
              {isActive && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-accent" />
                </div>
              )}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg mb-3",
                  isActive ? "bg-accent text-accent-foreground" : "bg-surface text-foreground-muted"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className={cn("font-medium text-foreground", bengaliClass)}>
                {t(themeOption.labelKey)}
              </p>
              <p className={cn("text-xs text-foreground-muted mt-1", bengaliClass)}>
                {t(themeOption.descKey)}
              </p>
            </button>
          );
        })}
      </div>

      {/* Language section */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className={cn("text-base font-semibold text-foreground mb-2", bengaliClass)}>
          {t("settings.language.title")}
        </h3>
        <p className={cn("text-sm text-foreground-muted mb-4", bengaliClass)}>
          {t("settings.language.description")}
        </p>
        <LanguageToggle size="md" />
      </div>

      <div className="mt-6 p-4 rounded-lg bg-surface-elevated">
        <p className={cn("text-sm text-foreground-muted", bengaliClass)}>
          <strong className="text-foreground">{t("settings.appearance.noteLabel")}</strong>
          {t("settings.appearance.note")}
        </p>
      </div>
    </div>
  );
}
