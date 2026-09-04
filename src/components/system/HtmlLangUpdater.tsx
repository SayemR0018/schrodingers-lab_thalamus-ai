"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app.store";

/**
 * Keeps `<html lang="...">` in sync with the active UI language.
 *
 * Lives in the root layout so it's mounted exactly once per session.
 * `lang="en"` is the static server-rendered default; this component
 * updates it client-side when the user toggles between English and
 * Bengali. Setting the lang attribute helps:
 *   - screen readers / assistive tech announce content correctly
 *   - the browser select correct hyphenation, spell-check, and
 *     IME hand-off behavior
 *
 * Bengali is LTR so we never change `dir`.
 */
export function HtmlLangUpdater() {
  const language = useAppStore((s) => s.language);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language === "bn" ? "bn" : "en";
  }, [language]);

  return null;
}
