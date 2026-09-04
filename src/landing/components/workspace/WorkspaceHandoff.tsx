"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import {
  getOnboardingSnapshot,
  parseOnboardingSnapshot,
  subscribeToOnboarding,
} from "@/landing/lib/onboarding-storage";
import { Logo } from "@/landing/components/ui/Logo";
import { ThemeToggle } from "@/landing/components/ui/ThemeToggle";
import { LanguageToggle } from "@/landing/components/ui/LanguageToggle";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";
import { WORKSPACE_BRAIN_HREF } from "@/landing/lib/product-app-url";

export function WorkspaceHandoff() {
  const snapshot = useSyncExternalStore(
    subscribeToOnboarding,
    getOnboardingSnapshot,
    () => "",
  );
  const data = useMemo(() => parseOnboardingSnapshot(snapshot), [snapshot]);
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  const companyName = data.companyName === "Unnamed Business" ? "" : data.companyName;
  const connectionsCount = data.connections.length;

  const connectionsValue = connectionsCount
    ? t(
        connectionsCount === 1
          ? "workspace.sourceSingular"
          : "workspace.sourcePlural",
        { count: connectionsCount },
      )
    : t("workspace.noSources");

  const goalsValue = data.goals.length
    ? data.goals.join(", ")
    : t("workspace.emptyPriorities");

  const displayName = companyName.trim() || t("onboarding.fallbackBusinessName");

  return (
    <main id="main" className="min-h-svh bg-background text-foreground">
      <header className="container-page flex h-20 items-center justify-between">
        <Link href="/" aria-label={t("workspace.homeAria")}>
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle size="sm" />
          <ThemeToggle />
        </div>
      </header>

      <section className="container-page pb-16 pt-8 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-strong)] text-accent">
              <CheckCircle2 size={20} strokeWidth={1.7} />
            </span>
            <div>
              <p className={cn("eyebrow", isBn && "lang-bn")}>
                {t("workspace.eyebrow")}
              </p>
              <p
                className={cn(
                  "mt-1 text-sm text-muted",
                  isBn && "lang-bn",
                )}
              >
                {t("workspace.contextStatus")}
              </p>
            </div>
          </div>

          <h1
            className={cn(
              "mt-8 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl",
              isBn && "lang-bn",
            )}
          >
            {t("workspace.welcomeHeading", { name: displayName })}
          </h1>
          <p
            className={cn(
              "mt-5 max-w-2xl text-[16px] leading-7 text-muted",
              isBn && "lang-bn",
            )}
          >
            {t("workspace.welcomeBody")}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ContextItem
              label={t("workspace.items.industry")}
              value={data.industry}
              isBn={isBn}
            />
            <ContextItem
              label={t("workspace.items.products")}
              value={data.products}
              isBn={isBn}
            />
            <ContextItem
              label={t("workspace.items.customers")}
              value={data.customers}
              isBn={isBn}
            />
            <ContextItem
              label={t("workspace.items.goals")}
              value={goalsValue}
              isBn={isBn}
            />
            <ContextItem
              label={t("workspace.items.connections")}
              value={connectionsValue}
              isBn={isBn}
            />
            <ContextItem
              label={t("workspace.items.description")}
              value={data.description}
              isBn={isBn}
            />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className={cn("btn btn-secondary", isBn && "lang-bn")}
            >
              {t("workspace.refineCta")}
            </Link>
            <a
              href={WORKSPACE_BRAIN_HREF}
              className={cn("btn btn-primary", isBn && "lang-bn")}
            >
              {t("workspace.viewConceptCta")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContextItem({
  label,
  value,
  isBn,
}: {
  label: string;
  value: string;
  isBn: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
      <p
        className={cn(
          "text-[11px] font-semibold tracking-[0.14em] text-muted uppercase",
          isBn && "lang-bn",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-sm font-medium leading-6",
          isBn && "lang-bn",
        )}
      >
        {value}
      </p>
    </article>
  );
}
