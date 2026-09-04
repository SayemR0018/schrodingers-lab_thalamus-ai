"use client";

/**
 * Thalamus bridge — landing/onboarding context → workspace stores.
 *
 * The public onboarding surface (`/onboarding`) and the product workspace
 * (`/workspace/*`) keep separate state: the former writes plain JSON to
 * `localStorage`, the latter uses zustand stores with their own persist keys.
 * This module is the one-way conduit between them.
 *
 * It reads on mount and then follows the `storage` event, so context lands in
 * the workspace whether the user navigated here after finishing onboarding or
 * is typing into the wizard in another tab. `OnboardingFlow.persistDraft`
 * dispatches `storage` manually as well, since the spec only delivers it to
 * other tabs.
 *
 * Direction matters: nothing here reads workspace state back into the landing
 * keys, apart from mirroring the language toggle so the two surfaces agree.
 */

import { useEffect } from "react";
import { useUserStore } from "@/store/user.store";
import { useDataStore } from "@/store/data.store";
import { useAppStore } from "@/store/app.store";

const ONBOARDING_KEY = "thalamus-onboarding";
const SESSION_KEY = "thalamus-prototype-session";
const LANGUAGE_KEY = "thalamus-language";
const THEME_KEY = "thalamus-theme";

/**
 * `addBusinessInfo` appends a record and opens a new dataset version on every
 * call, so projections are coalesced instead of running per keystroke.
 */
const BUSINESS_INFO_DEBOUNCE_MS = 700;

/** Mirrors `OnboardingData` from the landing app; every field is optional
 *  because drafts are persisted while the user is still typing. */
type LandingOnboarding = {
  companyName?: string;
  industry?: string;
  description?: string;
  products?: string;
  customers?: string;
  goals?: string[];
  connections?: string[];
  completedAt?: string | null;
};

/** Fallbacks written by the landing's `normalizeOnboardingData`. They mean
 *  "the user left this empty", so they must not reach the workspace. */
const PLACEHOLDER_VALUES = new Set([
  "Unnamed Business",
  "Not specified",
  "Not provided",
  "No description provided",
]);

function isBlank(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value !== "string") return true;
  const trimmed = value.trim();
  return trimmed === "" || PLACEHOLDER_VALUES.has(trimmed);
}

function readLandingOnboarding(): LandingOnboarding | null {
  try {
    const raw = window.localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as LandingOnboarding;
  } catch {
    // Malformed JSON or localStorage blocked (private mode, ITP).
    return null;
  }
}

/**
 * Business name + industry → `useUserStore`.
 *
 * Drives the Overview greeting and the business header. Skipped when nothing
 * changed so unrelated keystrokes don't churn zustand subscribers.
 */
function projectIdentity(data: LandingOnboarding): void {
  const hasName = !isBlank(data.companyName);
  const hasIndustry = !isBlank(data.industry);
  if (!hasName && !hasIndustry) return;

  const userStore = useUserStore.getState();
  const active = userStore.workspaces.find(
    (workspace) => workspace.id === userStore.activeWorkspaceId,
  );

  // Preserve whichever half the user has not filled in yet.
  const name = hasName
    ? (data.companyName as string).trim()
    : active?.name || "Demo Commerce";
  const industry = hasIndustry
    ? (data.industry as string).trim()
    : active?.industry || "E-commerce";

  if (active?.name === name && active?.industry === industry) return;
  userStore.completeOnboarding(name, industry);
}

/**
 * Profile detail → `useDataStore` `business-info`, which surfaces on
 * `/workspace/data-sources` and feeds the model's business context.
 *
 * Upserts rather than appends: the landing writes on every keystroke, and
 * blindly calling `addBusinessInfo` would accumulate a duplicate record and a
 * dataset version per character.
 */
function projectBusinessInfo(data: LandingOnboarding): void {
  const fields: Array<[string, string]> = [];
  const push = (label: string, value: string | undefined) => {
    if (!isBlank(value)) fields.push([label, (value as string).trim()]);
  };

  push("Business Name", data.companyName);
  push("Industry", data.industry);
  push("Products", data.products);
  push("Customers", data.customers);
  push("Description", data.description);
  if (fields.length === 0) return;

  const dataStore = useDataStore.getState();

  for (const [key, value] of fields) {
    // Re-read per iteration: each write produces a new store snapshot.
    const existing = useDataStore
      .getState()
      .getCategoryRecords("business-info")
      .find((record) => record.data.key === key);

    if (!existing) {
      dataStore.addBusinessInfo(key, value);
    } else if (existing.data.value !== value) {
      dataStore.updateRecord("business-info", existing.id, { key, value });
    }
  }
}

/** Landing language toggle (`thalamus-language`) → `useAppStore`. */
function projectLanguage(): void {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    if (stored !== "en" && stored !== "bn") return;
    const appStore = useAppStore.getState();
    if (appStore.language !== stored) {
      appStore.setLanguage(stored);
    }
  } catch {
    // localStorage unavailable — language simply stays as-is.
  }
}

/**
 * Landing theme toggle (`thalamus-theme`) → `useAppStore`.
 *
 * The two surfaces store the theme separately — the landing writes
 * `thalamus-theme`, the workspace keeps it in `useAppStore` — which would
 * otherwise make the theme appear to flip when crossing between them.
 */
function projectTheme(): void {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored !== "light" && stored !== "dark") return;
    const appStore = useAppStore.getState();
    if (appStore.theme !== stored) {
      appStore.setTheme(stored);
    }
  } catch {
    // localStorage unavailable — theme simply stays as-is.
  }
}

/** Resolve the workspace's tri-state theme to the concrete value the
 *  landing's pre-paint theme script understands. */
function resolveEffectiveTheme(theme: "light" | "dark" | "system"): "light" | "dark" {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Read the landing keys and push everything into the workspace stores.
 *
 * Identity is projected synchronously so the Overview greeting tracks typing;
 * the heavier `business-info` write is left to the debounced caller.
 */
function projectOnboardingToProduct(): void {
  if (typeof window === "undefined") return;

  projectLanguage();
  projectTheme();

  const data = readLandingOnboarding();
  if (!data) return;
  projectIdentity(data);
  projectBusinessInfo(data);
}

/**
 * Mount once inside the workspace layout. Renders nothing; it exists purely
 * to rehydrate from the landing keys and subscribe to `storage`.
 */
export function ThalamusBridge(): null {
  useEffect(() => {
    // Initial projection, including the `business-info` records.
    projectOnboardingToProduct();

    let debounceId: number | undefined;

    const onStorage = (event: StorageEvent) => {
      if (
        event.key !== ONBOARDING_KEY &&
        event.key !== SESSION_KEY &&
        event.key !== LANGUAGE_KEY &&
        event.key !== THEME_KEY
      ) {
        return;
      }

      // Immediate: presentation prefs + the Overview greeting.
      projectLanguage();
      projectTheme();
      const data = readLandingOnboarding();
      if (!data) return;
      projectIdentity(data);

      // Coalesced: dataset records and their version history.
      if (debounceId !== undefined) window.clearTimeout(debounceId);
      debounceId = window.setTimeout(() => {
        const latest = readLandingOnboarding();
        if (latest) projectBusinessInfo(latest);
      }, BUSINESS_INFO_DEBOUNCE_MS);
    };

    window.addEventListener("storage", onStorage);

    // Mirror the workspace's presentation prefs back onto the landing keys, so
    // returning to `/onboarding` keeps the chosen language and theme. Writing
    // localStorage does not raise `storage` in the same tab, and both writes
    // are equality-guarded, so this cannot loop with the listener above.
    // `subscribe` fires on every mutation (including each streamed chat
    // token), so the last written values are cached to keep this a pair of
    // reference comparisons in the common case.
    let lastLanguage: string | null = null;
    let lastTheme: string | null = null;

    const unsubscribePrefs = useAppStore.subscribe((state) => {
      const effectiveTheme = resolveEffectiveTheme(state.theme);
      if (state.language === lastLanguage && effectiveTheme === lastTheme) {
        return;
      }
      lastLanguage = state.language;
      lastTheme = effectiveTheme;
      try {
        window.localStorage.setItem(LANGUAGE_KEY, state.language);
        window.localStorage.setItem(THEME_KEY, effectiveTheme);
      } catch {
        // Ignore quota / disabled-storage failures.
      }
    });

    return () => {
      if (debounceId !== undefined) window.clearTimeout(debounceId);
      window.removeEventListener("storage", onStorage);
      unsubscribePrefs();
    };
  }, []);

  return null;
}

/**
 * Imperative escape hatch — force a re-projection without waiting for a
 * `storage` event. Useful when the landing tab wrote before this tab mounted.
 */
export function rehydrateFromLanding(): void {
  projectOnboardingToProduct();
}

/**
 * Hook form of {@link ThalamusBridge}, for callers that would rather compose
 * the behaviour than render a component.
 */
export function useThalamusLandingBridge(): void {
  useEffect(() => {
    projectOnboardingToProduct();
    const onStorage = (event: StorageEvent) => {
      if (
        event.key === ONBOARDING_KEY ||
        event.key === SESSION_KEY ||
        event.key === LANGUAGE_KEY
      ) {
        projectOnboardingToProduct();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}
