import {
  getOnboardingSnapshot,
  parseOnboardingSnapshot,
} from "@/landing/lib/onboarding-storage";
import type { AuthResponse, LoginRequest } from "@/landing/services/auth.types";

const mockDelayMs = 650;

export async function mockLogin({
  identifier,
  password,
}: LoginRequest): Promise<AuthResponse> {
  await delay(mockDelayMs);

  const normalizedIdentifier = identifier.trim();
  if (!normalizedIdentifier || !password) {
    return {
      success: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Username or password is incorrect.",
      },
    };
  }

  const isEmail = normalizedIdentifier.includes("@");
  const username = isEmail
    ? normalizedIdentifier.split("@")[0] || "user"
    : normalizedIdentifier;
  const onboarding = parseOnboardingSnapshot(getOnboardingSnapshot());

  return {
    success: true,
    user: {
      id: `prototype-${hashIdentifier(normalizedIdentifier)}`,
      name: toDisplayName(username),
      email: isEmail
        ? normalizedIdentifier
        : `${username.toLowerCase().replace(/\s+/g, ".")}@prototype.local`,
      username,
    },
    access_token: `prototype-${crypto.randomUUID()}`,
    onboarding_completed: Boolean(onboarding.completedAt),
  };
}

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function toDisplayName(value: string) {
  const name = value
    .replace(/[._-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return name || "THALAMUS User";
}

function hashIdentifier(value: string) {
  let hash = 0;
  for (const character of value.toLowerCase()) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash.toString(36);
}
