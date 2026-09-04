"use client";

import { useEffect } from "react";
import { rehydrateLanguage, useLanguage } from "@/landing/lib/i18n/store";

/**
 * Keeps `<html lang="...">` in sync with the active UI language and
 * performs a one-time client-side rehydration from `localStorage`.
 *
 * Lives in the root layout so it is mounted exactly once per session.
 * `lang="en"` is the static server-rendered default; this component
 * updates it client-side when the user toggles between English and
 * Bengali. Bengali is LTR so we never change `dir`.
 */
export function HtmlLangUpdater() {
  const language = useLanguage();

  useEffect(() => {
    rehydrateLanguage();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language === "bn" ? "bn" : "en";
  }, [language]);

  return null;
}
