"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/store/app.store";

interface AssistantInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function AssistantInput({ onSend, disabled }: AssistantInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Skip Enter handling while an IME composition (e.g. Bengali Avro /
    // Google Bengali Input) is in progress. `isComposing` is true between
    // the first composition keystroke and the final confirmation, and
    // browsers fire keydown with `key === "Enter"` mid-composition, which
    // would prematurely submit the half-formed word.
    const native = e.nativeEvent as KeyboardEvent & { isComposing?: boolean };
    if (native.isComposing || native.keyCode === 229) return;
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    handleSubmit();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const isBengali = language === "bn";
  const bengaliClass = isBengali ? "lang-bn" : "";

  return (
    <div className="border-t border-border p-4">
      <div className="glass flex items-end gap-2 rounded-xl p-2">
        <button
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            "text-foreground-muted hover:text-foreground",
            "hover:bg-surface-elevated transition-colors"
          )}
          aria-label={t("assistant.input.attachFile")}
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("assistant.input.placeholder")}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent py-1.5 text-sm",
            "placeholder:text-foreground-subtle",
            "focus:outline-none",
            "disabled:opacity-50",
            bengaliClass
          )}
        />

        <button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            "transition-all",
            value.trim()
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "text-foreground-subtle"
          )}
          aria-label={t("assistant.input.send")}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
      <p className={cn("mt-2 text-center text-xs text-foreground-subtle", bengaliClass)}>
        {t("assistant.input.disclaimer")}
      </p>
    </div>
  );
}
