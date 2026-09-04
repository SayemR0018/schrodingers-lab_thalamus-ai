"use client";

import { Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";
import { cn } from "@/lib/utils";

export function AssistantHeader() {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const bengaliClass = language === "bn" ? "lang-bn" : "";

  return (
    <div className="border-b border-border px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className={cn("font-semibold text-foreground", bengaliClass)}>
            {t("assistant.header.title")}
          </h2>
          <p className={cn("text-xs text-foreground-muted", bengaliClass)}>
            {t("assistant.header.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
