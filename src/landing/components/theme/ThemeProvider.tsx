"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const themeListeners = new Set<() => void>();

function applyTheme(theme: Theme, persist = true) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  if (persist && typeof window !== "undefined") {
    try {
      window.localStorage.setItem("thalamus-theme", theme);
    } catch {
      /* private mode / quota — theme still applies for this session */
    }
  }
}

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerTheme(): Theme {
  return "light";
}

function notifyThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      themeListeners.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === "thalamus-theme" &&
      (event.newValue === "light" || event.newValue === "dark")
    ) {
      applyTheme(event.newValue, false);
      notifyThemeChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, getServerTheme);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    notifyThemeChange();
  }, []);

  const toggleTheme = useCallback(() => {
    const next = readTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    notifyThemeChange();
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
