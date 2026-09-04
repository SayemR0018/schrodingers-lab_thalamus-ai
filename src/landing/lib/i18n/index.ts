"use client";

import { en } from "./dictionaries/en";
import { bn } from "./dictionaries/bn";
import type { InterpolationValues, Language, Translations } from "./types";
import { getLanguage, setLanguage, useLanguage } from "./store";

export type { Language, InterpolationValues, Translations };

export const dictionaries: Record<Language, Translations> = {
  en,
  bn,
};

/**
 * Walk a dot-path against a nested object and return the value at that path.
 * Returns undefined if any segment is missing.
 */
export function getNestedValue(obj: unknown, path: string): unknown {
  if (obj == null) return undefined;
  const segments = path.split(".");
  let current: unknown = obj;
  for (const segment of segments) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

/**
 * Replace {{token}} placeholders inside a template string.
 * Missing tokens are left untouched so they're visible during dev.
 */
export function interpolate(
  template: string,
  values?: InterpolationValues,
): string {
  if (!values) return template;
  return template.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, key: string) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      return String(values[key]);
    }
    return match;
  });
}

/**
 * Imperative translation lookup. Resolves language from explicit arg →
 * current store value → default 'en'. Falls back to English so the UI
 * never breaks when a key is missing in the active language.
 */
export function t(
  key: string,
  values?: InterpolationValues,
  lang?: Language,
): string {
  const activeLang: Language = lang ?? getLanguage();

  const primary = getNestedValue(dictionaries[activeLang], key);
  if (typeof primary === "string") {
    return interpolate(primary, values);
  }

  if (activeLang !== "en") {
    const fallback = getNestedValue(dictionaries.en, key);
    if (typeof fallback === "string") {
      return interpolate(fallback, values);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    // Visible in dev so missing keys can be tracked down.
    console.warn(`[i18n] missing key: "${key}"`);
  }
  return key;
}

/**
 * React hook that subscribes to language changes so components re-render
 * when the user toggles EN ↔ বাং.
 */
export function useTranslation() {
  const language = useLanguage();

  const translate = (key: string, values?: InterpolationValues) =>
    t(key, values, language);

  return {
    t: translate,
    language,
    setLanguage,
  };
}
