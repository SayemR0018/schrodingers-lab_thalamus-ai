"use client";

import { useSyncExternalStore } from "react";
import type { Language } from "./types";

const STORAGE_KEY = "thalamus-language";
const DEFAULT_LANGUAGE: Language = "en";

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "bn";
}

/**
 * Lightweight pub/sub for the active UI language. Mirrors the shape of the
 * existing `ThemeProvider` so we can avoid pulling in a state library just
 * for one boolean. SSR-safe via `useSyncExternalStore`.
 */

let currentLanguage: Language = DEFAULT_LANGUAGE;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function readLanguageFromStorage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    /* localStorage may be unavailable (private mode, etc.) */
  }
  return DEFAULT_LANGUAGE;
}

function persistLanguage(language: Language) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    /* ignore */
  }
}

/**
 * Client-side rehydration. Call once on mount of a client component
 * (the `HtmlLangUpdater` does this). Safe to call multiple times.
 */
export function rehydrateLanguage(): Language {
  const next = readLanguageFromStorage();
  if (next !== currentLanguage) {
    currentLanguage = next;
    notify();
  }
  return currentLanguage;
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(language: Language): void {
  if (language === currentLanguage) return;
  currentLanguage = language;
  persistLanguage(language);
  notify();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = isLanguage(event.newValue) ? event.newValue : DEFAULT_LANGUAGE;
      if (next !== currentLanguage) {
        currentLanguage = next;
        notify();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", handleStorage);
    };
  }
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Language {
  return currentLanguage;
}

function getServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

/**
 * React hook returning the active language. Re-renders consumers whenever
 * the language changes (either via `setLanguage` or a cross-tab `storage`
 * event). Server snapshot is always English so SSR HTML matches the first
 * client render before hydration completes.
 */
export function useLanguage(): Language {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
