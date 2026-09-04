"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Check,
  FileSpreadsheet,
  FileText,
  Globe2,
  MessageCircle,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import {
  businessGoals,
  connectionOptions,
  onboardingSteps,
  profileFields,
  understandingStages,
  type BusinessGoalKey,
  type ConnectionOption,
  type ProfileFieldKey,
  type UnderstandingStageKey,
} from "@/landing/data/onboarding";
import {
  getOnboardingSnapshot,
  normalizeOnboardingData,
  parseOnboardingSnapshot,
  saveOnboardingData,
  subscribeToOnboarding,
  ONBOARDING_STORAGE_KEY,
  type ConnectionId,
  type OnboardingData,
  type OnboardingProfile,
} from "@/landing/lib/onboarding-storage";
import { authService } from "@/landing/services/auth.service";
import { cn } from "@/landing/lib/cn";
import { GlassButton } from "@/landing/components/ui/GlassButton";
import { Logo } from "@/landing/components/ui/Logo";
import { ThemeToggle } from "@/landing/components/ui/ThemeToggle";
import { LanguageToggle } from "@/landing/components/ui/LanguageToggle";
import { useTranslation } from "@/landing/lib/i18n";

type ConnectionState = "idle" | "connecting" | "reading" | "preparing" | "connected";
const pendingSnapshot = "__thalamus_onboarding_pending__";

function getPendingSnapshot() {
  return pendingSnapshot;
}

const connectionIcons: Record<ConnectionId, typeof Store> = {
  "google-sheets": FileSpreadsheet,
  shopify: ShoppingBag,
  whatsapp: MessageCircle,
  facebook: Globe2,
  instagram: Camera,
  "csv-excel": FileSpreadsheet,
  documents: FileText,
};

const connectionFieldToKey: Record<
  ConnectionId,
  Record<string, { labelKey: string; placeholderKey: string }>
> = {
  "google-sheets": {
    "sheet-url": { labelKey: "sheetUrl", placeholderKey: "sheetUrl" },
  },
  shopify: {
    "store-domain": { labelKey: "storeDomain", placeholderKey: "storeDomain" },
    "access-token": { labelKey: "accessToken", placeholderKey: "accessToken" },
  },
  whatsapp: {
    "country-code": { labelKey: "countryCode", placeholderKey: "countryCode" },
    "business-number": {
      labelKey: "businessNumber",
      placeholderKey: "businessNumber",
    },
  },
  facebook: {
    "page-url": { labelKey: "pageUrl", placeholderKey: "pageUrl" },
  },
  instagram: {
    "profile-url": { labelKey: "profileUrl", placeholderKey: "profileUrl" },
  },
  "csv-excel": {
    "spreadsheet-file": { labelKey: "uploadFile", placeholderKey: "uploadFile" },
  },
  documents: {
    "document-file": { labelKey: "uploadFile", placeholderKey: "uploadFile" },
  },
};

export function OnboardingFlow() {
  const snapshot = useSyncExternalStore(
    subscribeToOnboarding,
    getOnboardingSnapshot,
    getPendingSnapshot,
  );
  const initialData = useMemo(
    () => parseOnboardingSnapshot(snapshot),
    [snapshot],
  );

  if (snapshot === pendingSnapshot) {
    return (
      <main
        id="main"
        className="min-h-svh bg-background"
        aria-busy="true"
      />
    );
  }

  return <OnboardingSession initialData={initialData} />;
}

function OnboardingSession({ initialData }: { initialData: OnboardingData }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<OnboardingProfile>({
    companyName:
      initialData.companyName === "Unnamed Business" ? "" : initialData.companyName,
    industry: initialData.industry === "Not specified" ? "" : initialData.industry,
    products: initialData.products === "Not provided" ? "" : initialData.products,
    customers:
      initialData.customers === "Not provided" ? "" : initialData.customers,
    description:
      initialData.description === "No description provided"
        ? ""
        : initialData.description,
  });
  const [goals, setGoals] = useState<BusinessGoalKey[]>(
    initialData.goals
      .map((label) => findGoalKeyByLabel(label))
      .filter((key): key is BusinessGoalKey => key !== null),
  );
  const [connections, setConnections] = useState<ConnectionId[]>(
    initialData.connections,
  );
  const [connectionStates, setConnectionStates] = useState<
    Partial<Record<ConnectionId, ConnectionState>>
  >(() =>
    Object.fromEntries(
      initialData.connections.map((id) => [id, "connected"] as const),
    ),
  );
  const [activeConnection, setActiveConnection] = useState<ConnectionOption | null>(null);
  const [understandingIndex, setUnderstandingIndex] = useState(-1);

  const draft = useMemo<OnboardingData>(
    () => ({
      ...profile,
      goals: goals.map((key) => resolveGoalLabel(key, t)),
      connections,
      completedAt: null,
    }),
    [connections, goals, profile, t],
  );

  useEffect(() => {
    if (step !== 3 || understandingIndex >= understandingStages.length) return;

    const timeout = window.setTimeout(() => {
      setUnderstandingIndex((current) => current + 1);
    }, understandingIndex < 0 ? 250 : 520);

    return () => window.clearTimeout(timeout);
  }, [step, understandingIndex]);

  const contextReady = understandingIndex >= understandingStages.length;

  function updateProfile(key: keyof OnboardingProfile, value: string) {
    const next = { ...profile, [key]: value };
    setProfile(next);
    persistDraft(next, goals, connections);
  }

  function toggleGoal(goal: BusinessGoalKey) {
    const next = goals.includes(goal)
      ? goals.filter((item) => item !== goal)
      : goals.length < 3
        ? [...goals, goal]
        : goals;

    if (next === goals) return;
    setGoals(next);
    persistDraft(profile, next, connections);
  }

  function simulateConnection(id: ConnectionId) {
    if (connectionStates[id] && connectionStates[id] !== "idle") return;

    const stages: ConnectionState[] = ["connecting", "reading", "preparing", "connected"];
    stages.forEach((state, index) => {
      window.setTimeout(() => {
        setConnectionStates((current) => ({ ...current, [id]: state }));
        if (state === "connected") {
          setConnections((current) =>
            current.includes(id) ? current : [...current, id],
          );

          const stored = parseOnboardingSnapshot(getOnboardingSnapshot());
          if (!stored.connections.includes(id)) {
            saveOnboardingData({
              ...stored,
              connections: [...stored.connections, id],
              completedAt: null,
            });
          }
        }
      }, index * 520);
    });
  }

  function continueFlow() {
    saveOnboardingData(draft);
    if (step < 2) {
      setStep((current) => current + 1);
      return;
    }

    setUnderstandingIndex(-1);
    setStep(3);
  }

  function finishOnboarding() {
    const completed = normalizeOnboardingData({
      ...draft,
      completedAt: new Date().toISOString(),
    });
    saveOnboardingData(completed);
    authService.markOnboardingCompleted();
    // `/handoff` is the context summary that used to live at `/workspace` in
    // the standalone landing app; `/workspace` is now the product Overview,
    // which the summary's primary CTA links to.
    router.push("/handoff");
  }

  function persistDraft(
    nextProfile: OnboardingProfile,
    nextGoals: BusinessGoalKey[],
    nextConnections: ConnectionId[],
  ) {
    const data: OnboardingData = {
      ...nextProfile,
      goals: nextGoals.map((key) => resolveGoalLabel(key, t)),
      connections: nextConnections,
      completedAt: null,
    };
    saveOnboardingData(data);

    // The spec only fires `storage` in *other* tabs, so dispatch it manually
    // for the current one. This lets `ThalamusBridge` project each keystroke
    // into the workspace stores live, whether the dashboard is open in
    // another tab or mounted later in this one.
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: ONBOARDING_STORAGE_KEY,
          newValue: JSON.stringify(data),
        }),
      );
    }
  }

  return (
    <main id="main" className="min-h-svh bg-background text-foreground">
      <header className="container-page flex h-20 items-center justify-between">
        <Link href="/" aria-label={t("onboarding.homeAria")}>
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle size="sm" />
          <ThemeToggle />
        </div>
      </header>

      <div className="container-page pb-10 pt-3 sm:pb-16 sm:pt-8">
        <OnboardingProgress step={step} />

        <section className="mx-auto mt-8 max-w-4xl sm:mt-12">
          <div
            key={step}
            className="onboarding-step glass rounded-[28px] px-5 py-7 sm:px-10 sm:py-10 lg:px-14 lg:py-12"
          >
            {step === 0 ? (
              <BusinessProfileStep profile={profile} updateProfile={updateProfile} />
            ) : null}
            {step === 1 ? (
              <GoalsStep goals={goals} toggleGoal={toggleGoal} />
            ) : null}
            {step === 2 ? (
              <ConnectionsStep
                connections={connections}
                connectionStates={connectionStates}
                onConnect={setActiveConnection}
                onDemo={simulateConnection}
              />
            ) : null}
            {step === 3 ? (
              <UnderstandingStep
                data={draft}
                progress={understandingIndex}
                ready={contextReady}
              />
            ) : null}
          </div>

          <OnboardingNavigation
            step={step}
            ready={contextReady}
            onBack={() => setStep((current) => Math.max(0, current - 1))}
            onContinue={continueFlow}
            onFinish={finishOnboarding}
            onSkip={() => {
              setUnderstandingIndex(-1);
              setStep(3);
            }}
          />
        </section>
      </div>

      {activeConnection ? (
        <ConnectionForm
          option={activeConnection}
          onClose={() => setActiveConnection(null)}
          onConnect={() => {
            simulateConnection(activeConnection.id);
            setActiveConnection(null);
          }}
        />
      ) : null}
    </main>
  );
}

function OnboardingProgress({ step }: { step: number }) {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  return (
    <nav aria-label={t("onboarding.progressAria")} className="mx-auto max-w-4xl">
      <ol className="grid grid-cols-4 gap-2 sm:gap-4">
        {onboardingSteps.map((item, index) => {
          const active = index === step;
          const complete = index < step;

          return (
            <li key={item.number}>
              <div
                className={cn(
                  "h-1 rounded-full transition-colors",
                  index <= step
                    ? "bg-accent"
                    : "bg-[color:var(--border-strong)]",
                )}
                aria-hidden="true"
              />
              <p
                className={cn(
                  "mt-3 text-[10px] font-semibold tracking-[0.08em] uppercase sm:text-xs",
                  active ? "text-foreground" : "text-muted",
                  isBn && "lang-bn",
                )}
                aria-current={active ? "step" : undefined}
              >
                <span className="mr-1 text-accent">
                  {complete ? "✓" : item.number}
                </span>
                <span className="hidden sm:inline">
                  {t(`onboarding.steps.${item.key}`)}
                </span>
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function BusinessProfileStep({
  profile,
  updateProfile,
}: {
  profile: OnboardingProfile;
  updateProfile: (key: keyof OnboardingProfile, value: string) => void;
}) {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <>
      <StepHeading
        eyebrow={t("onboarding.businessProfile.eyebrow")}
        title={t("onboarding.businessProfile.title")}
        body={t("onboarding.businessProfile.body")}
      />

      <div className="mt-9 grid gap-5 sm:grid-cols-2">
        {profileFields.map((field) => (
          <label
            key={field.key}
            className={cn("block", field.multiline && "sm:col-span-2")}
          >
            <span className={cn("text-sm font-medium", isBn && "lang-bn")}>
              {t(`onboarding.businessProfile.fields.${field.key as ProfileFieldKey}.label`)}
            </span>
            {field.multiline ? (
              <textarea
                value={profile[field.key]}
                onChange={(event) => updateProfile(field.key, event.target.value)}
                placeholder={t(
                  `onboarding.businessProfile.fields.${field.key as ProfileFieldKey}.placeholder`,
                )}
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-[color:var(--accent)]"
              />
            ) : (
              <input
                type="text"
                value={profile[field.key]}
                onChange={(event) => updateProfile(field.key, event.target.value)}
                placeholder={t(
                  `onboarding.businessProfile.fields.${field.key as ProfileFieldKey}.placeholder`,
                )}
                className="mt-2 h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-[color:var(--accent)]"
              />
            )}
          </label>
        ))}
      </div>
      <p
        className={cn(
          "mt-5 text-xs leading-5 text-muted",
          isBn && "lang-bn",
        )}
      >
        {t("onboarding.businessProfile.examplesNote")}
      </p>
    </>
  );
}

function GoalsStep({
  goals,
  toggleGoal,
}: {
  goals: BusinessGoalKey[];
  toggleGoal: (goal: BusinessGoalKey) => void;
}) {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <>
      <StepHeading
        eyebrow={t("onboarding.goals.eyebrow")}
        title={t("onboarding.goals.title")}
        body={t("onboarding.goals.body")}
      />
      <p
        className={cn("mt-6 text-sm text-muted", isBn && "lang-bn")}
      >
        {t("onboarding.goals.selectedCount", { count: goals.length })}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {businessGoals.map((goal) => {
          const selected = goals.includes(goal.key);
          const unavailable = !selected && goals.length >= 3;

          return (
            <button
              key={goal.key}
              type="button"
              onClick={() => toggleGoal(goal.key)}
              aria-pressed={selected}
              className={cn(
                "flex min-h-16 items-center justify-between rounded-2xl border p-4 text-left text-sm font-medium transition-all",
                selected
                  ? "border-[color:var(--accent)] bg-[color:var(--surface)]"
                  : "border-[color:var(--border)] bg-transparent hover:border-[color:var(--border-strong)]",
                unavailable && "opacity-45",
              )}
            >
              <span className={cn(isBn && "lang-bn")}>
                {t(`onboarding.goals.items.${goal.key}`)}
              </span>
              <span
                className={cn(
                  "ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                  selected
                    ? "border-[color:var(--accent)] bg-accent text-white"
                    : "border-[color:var(--border-strong)]",
                )}
              >
                {selected ? <Check size={13} /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function ConnectionsStep({
  connections,
  connectionStates,
  onConnect,
  onDemo,
}: {
  connections: ConnectionId[];
  connectionStates: Partial<Record<ConnectionId, ConnectionState>>;
  onConnect: (option: ConnectionOption) => void;
  onDemo: (id: ConnectionId) => void;
}) {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <>
      <StepHeading
        eyebrow={t("onboarding.connect.eyebrow")}
        title={t("onboarding.connect.title")}
        body={t("onboarding.connect.body")}
      />

      <div className="mt-9 grid gap-4 sm:grid-cols-2">
        {connectionOptions.map((option) => {
          const Icon = connectionIcons[option.id];
          const state = connectionStates[option.id] ?? "idle";
          const connected = connections.includes(option.id);

          return (
            <article
              key={option.id}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--border-strong)] text-accent">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <div>
                  <h3
                    className={cn(
                      "text-sm font-semibold",
                      isBn && "lang-bn",
                    )}
                  >
                    {t(`onboarding.connect.options.${option.id}.name`)}
                  </h3>
                  <p
                    className={cn(
                      "mt-1 text-xs text-muted",
                      isBn && "lang-bn",
                    )}
                  >
                    {connectionStatusLabelKey(state, t)}
                  </p>
                </div>
                {connected ? (
                  <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white">
                    <Check size={14} />
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={cn(
                    "btn btn-secondary min-h-9 px-3 text-xs",
                    isBn && "lang-bn",
                  )}
                  onClick={() => onConnect(option)}
                  disabled={state !== "idle"}
                >
                  {t("onboarding.connect.connectCta")}
                </button>
                <button
                  type="button"
                  className={cn(
                    "btn btn-tertiary min-h-9 px-2 text-xs",
                    isBn && "lang-bn",
                  )}
                  onClick={() => onDemo(option.id)}
                  disabled={state !== "idle"}
                >
                  {t("onboarding.connect.demoCta")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p
        className={cn(
          "mt-5 text-xs leading-5 text-muted",
          isBn && "lang-bn",
        )}
      >
        {t("onboarding.connect.prototypeNote")}
      </p>
    </>
  );
}

function UnderstandingStep({
  data,
  progress,
  ready,
}: {
  data: OnboardingData;
  progress: number;
  ready: boolean;
}) {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const companyName = data.companyName.trim() || t("onboarding.fallbackBusinessName");

  return (
    <div className="mx-auto max-w-2xl text-center">
      <StepHeading
        eyebrow={t("onboarding.understanding.eyebrow")}
        title={
          ready
            ? t("onboarding.understanding.titleReady")
            : t("onboarding.understanding.titleWorking")
        }
        body={
          ready
            ? t("onboarding.understanding.bodyReady", { name: companyName })
            : t("onboarding.understanding.bodyWorking")
        }
        centered
      />

      <div className="mx-auto mt-9 max-w-lg rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-left sm:p-6">
        <ol className="space-y-4">
          {understandingStages.map((stage, index) => {
            const complete = ready || index < progress;
            const active = !ready && index === progress;

            return (
              <li key={stage.key} className="flex items-center gap-3 text-sm">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                    complete
                      ? "border-[color:var(--accent)] bg-accent text-white"
                      : active
                        ? "border-[color:var(--accent)] text-accent"
                        : "border-[color:var(--border-strong)] text-muted",
                  )}
                >
                  {complete ? <Check size={12} /> : active ? "•" : "○"}
                </span>
                <span
                  className={cn(
                    active || complete ? "text-foreground" : "text-muted",
                    isBn && "lang-bn",
                  )}
                >
                  {t(`onboarding.understanding.stages.${stage.key as UnderstandingStageKey}`)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function OnboardingNavigation({
  step,
  ready,
  onBack,
  onContinue,
  onFinish,
  onSkip,
}: {
  step: number;
  ready: boolean;
  onBack: () => void;
  onContinue: () => void;
  onFinish: () => void;
  onSkip: () => void;
}) {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={step === 0}
        className={cn("btn btn-secondary", isBn && "lang-bn")}
      >
        <ArrowLeft size={16} />
        {t("onboarding.navigation.back")}
      </button>

      <div className="flex flex-col gap-3 sm:flex-row">
        {step === 2 ? (
          <button
            type="button"
            onClick={onSkip}
            className={cn("btn btn-tertiary", isBn && "lang-bn")}
          >
            {t("onboarding.navigation.skipForNow")}
          </button>
        ) : null}

        {step < 3 ? (
          <GlassButton arrow onClick={onContinue}>
            {t("onboarding.navigation.continue")}
          </GlassButton>
        ) : (
          <GlassButton arrow onClick={onFinish} disabled={!ready}>
            {ready
              ? t("onboarding.navigation.finish")
              : t("onboarding.navigation.preparingWorkspace")}
          </GlassButton>
        )}
      </div>
    </div>
  );
}

function ConnectionForm({
  option,
  onClose,
  onConnect,
}: {
  option: ConnectionOption;
  onClose: () => void;
  onConnect: () => void;
}) {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const fieldMap = connectionFieldToKey[option.id];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/35 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connection-form-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="glass-strong w-full max-w-md rounded-[28px] p-5 sm:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          onConnect();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={cn("eyebrow", isBn && "lang-bn")}>
              {t("onboarding.connectionForm.eyebrow")}
            </p>
            <h2
              id="connection-form-title"
              className={cn(
                "mt-2 text-2xl font-semibold",
                isBn && "lang-bn",
              )}
            >
              {t("onboarding.connectionForm.title", {
                name: t(`onboarding.connect.options.${option.id}.name`),
              })}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("onboarding.connectionForm.closeAria")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {option.fields.map((field) => {
            const mapping = fieldMap?.[field.id];
            const labelKey = mapping?.labelKey;
            const placeholderKey = mapping?.placeholderKey;
            const label = labelKey
              ? t(
                  `onboarding.connect.options.${option.id}.fields.${labelKey}.label`,
                )
              : field.label;
            const placeholder =
              placeholderKey && option.id && field.placeholder !== undefined
                ? t(
                    `onboarding.connect.options.${option.id}.fields.${placeholderKey}.placeholder`,
                  )
                : field.placeholder;

            return (
              <label key={field.id} className="block">
                <span className={cn("text-sm font-medium", isBn && "lang-bn")}>
                  {label}
                </span>
                <input
                  type={field.type ?? "text"}
                  placeholder={placeholder}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[color:var(--background)] file:px-3 file:py-2 file:text-xs focus:border-[color:var(--accent)]"
                />
              </label>
            );
          })}
        </div>

        <p
          className={cn(
            "mt-5 text-xs leading-5 text-muted",
            isBn && "lang-bn",
          )}
        >
          {t("onboarding.connectionForm.prototypeNote")}
        </p>
        <GlassButton type="submit" arrow className="mt-6 w-full">
          {t("onboarding.connectionForm.submit")}
        </GlassButton>
      </form>
    </div>
  );
}

function StepHeading({
  eyebrow,
  title,
  body,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  centered?: boolean;
}) {
  const { language } = useTranslation();
  const isBn = language === "bn";

  return (
    <div className={cn(centered && "text-center")}>
      <p className={cn("eyebrow", isBn && "lang-bn")}>{eyebrow}</p>
      <h1
        className={cn(
          "mt-4 text-3xl font-semibold tracking-tight sm:text-4xl",
          isBn && "lang-bn",
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "mt-4 max-w-2xl text-[15px] leading-7 text-muted",
          centered && "mx-auto",
          isBn && "lang-bn",
        )}
      >
        {body}
      </p>
    </div>
  );
}

function connectionStatusLabelKey(
  state: ConnectionState,
  t: (key: string) => string,
) {
  if (state === "connecting") return t("onboarding.connect.status.connecting");
  if (state === "reading") return t("onboarding.connect.status.reading");
  if (state === "preparing") return t("onboarding.connect.status.preparing");
  if (state === "connected") return t("onboarding.connect.status.connected");
  return t("onboarding.connect.status.idle");
}

function findGoalKeyByLabel(label: string): BusinessGoalKey | null {
  const found = businessGoals.find((goal) => goal.label === label);
  return found?.key ?? null;
}

function resolveGoalLabel(key: BusinessGoalKey, t: (key: string) => string): string {
  const translated = t(`onboarding.goals.items.${key}`);
  if (translated && !translated.startsWith("onboarding.")) return translated;
  return businessGoals.find((goal) => goal.key === key)?.label ?? key;
}
