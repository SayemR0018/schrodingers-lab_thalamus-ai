import type { AuthSession, AuthUser } from "@/landing/services/auth.types";

const AUTH_SESSION_KEY = "thalamus-prototype-session";

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!stored) return null;

  try {
    const value: unknown = JSON.parse(stored);
    return isAuthSession(value) ? value : null;
  } catch {
    return null;
  }
}

export function markAuthSessionOnboardingComplete() {
  const session = getAuthSession();
  if (!session) return;
  saveAuthSession({ ...session, onboarding_completed: true });
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!isRecord(value)) return false;

  return (
    isAuthUser(value.user) &&
    typeof value.access_token === "string" &&
    value.access_token.length > 0 &&
    typeof value.onboarding_completed === "boolean"
  );
}

function isAuthUser(value: unknown): value is AuthUser {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    typeof value.username === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
