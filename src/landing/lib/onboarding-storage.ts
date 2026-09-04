export type ConnectionId =
  | "google-sheets"
  | "shopify"
  | "whatsapp"
  | "facebook"
  | "instagram"
  | "csv-excel"
  | "documents";

export type OnboardingProfile = {
  companyName: string;
  industry: string;
  products: string;
  customers: string;
  description: string;
};

export type OnboardingData = OnboardingProfile & {
  goals: string[];
  connections: ConnectionId[];
  completedAt: string | null;
};

export const emptyOnboardingData: OnboardingData = {
  companyName: "",
  industry: "",
  products: "",
  customers: "",
  description: "",
  goals: [],
  connections: [],
  completedAt: null,
};

export const ONBOARDING_STORAGE_KEY = "thalamus-onboarding";

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function normalizeOnboardingData(
  value: Partial<OnboardingData> | null | undefined,
): OnboardingData {
  return {
    companyName: value?.companyName?.trim() || "Unnamed Business",
    industry: value?.industry?.trim() || "Not specified",
    products: value?.products?.trim() || "Not provided",
    customers: value?.customers?.trim() || "Not provided",
    description: value?.description?.trim() || "No description provided",
    goals: Array.isArray(value?.goals)
      ? value.goals.filter((goal): goal is string => typeof goal === "string")
      : [],
    connections: Array.isArray(value?.connections)
      ? value.connections.filter(isConnectionId)
      : [],
    completedAt:
      typeof value?.completedAt === "string" ? value.completedAt : null,
  };
}

export function saveOnboardingData(value: OnboardingData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(value));
  emitChange();
}

export function getOnboardingSnapshot(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) ?? "";
}

export function subscribeToOnboarding(listener: () => void) {
  listeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      listeners.delete(listener);
    };
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === ONBOARDING_STORAGE_KEY) listener();
  };

  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function parseOnboardingSnapshot(snapshot: string): OnboardingData {
  if (!snapshot) return normalizeOnboardingData(null);

  try {
    return normalizeOnboardingData(JSON.parse(snapshot) as Partial<OnboardingData>);
  } catch {
    return normalizeOnboardingData(null);
  }
}

function isConnectionId(value: unknown): value is ConnectionId {
  return (
    value === "google-sheets" ||
    value === "shopify" ||
    value === "whatsapp" ||
    value === "facebook" ||
    value === "instagram" ||
    value === "csv-excel" ||
    value === "documents"
  );
}
