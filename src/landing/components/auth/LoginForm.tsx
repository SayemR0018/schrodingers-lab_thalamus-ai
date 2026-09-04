"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/landing/services/auth.service";
import { GlassButton } from "@/landing/components/ui/GlassButton";
import { Logo } from "@/landing/components/ui/Logo";
import { ThemeToggle } from "@/landing/components/ui/ThemeToggle";
import { goToWorkspace } from "@/landing/lib/product-app-url";
import { useUserStore } from "@/store/user.store";

type FieldErrors = {
  identifier?: string;
  password?: string;
};

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    const session = authService.getSession();
    if (!session) return;
    if (session.onboarding_completed) {
      goToWorkspace(router);
      return;
    }
    router.replace("/onboarding/profile");
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: FieldErrors = {};

    if (!identifier.trim()) errors.identifier = "Enter your email or username.";
    if (!password) errors.password = "Enter your password.";

    setFieldErrors(errors);
    setFormMessage("");
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const response = await authService.login(identifier, password);

    if (response.success) {
      // Authenticate the product store too, so a logout from the workspace
      // profile menu can be reversed from this single unified login page.
      useUserStore.getState().login(identifier, password);

      if (response.onboarding_completed) {
        goToWorkspace(router);
        return;
      }
      router.replace("/onboarding/profile");
      return;
    }

    setLoading(false);
    setFormMessage(
      response.error?.message || "We could not sign you in. Please try again.",
    );
  }

  return (
    <main
      id="main"
      className="min-h-svh bg-background text-foreground"
    >
      <header className="container-page flex h-20 items-center justify-between">
        <Link href="/" aria-label="Back to Thalamus AI landing page">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>

      <div className="container-page flex min-h-[calc(100svh-80px)] items-start justify-center pb-12 pt-8 sm:items-center sm:pb-24 sm:pt-12">
        <section className="onboarding-step glass w-full max-w-md rounded-[28px] px-5 py-8 sm:px-9 sm:py-10">
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Log in to THALAMUS
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Continue to your Business Brain workspace.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <label className="block">
              <span className="text-sm font-medium">Gmail / Email / Username</span>
              <input
                type="text"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  if (fieldErrors.identifier) {
                    setFieldErrors((current) => ({
                      ...current,
                      identifier: undefined,
                    }));
                  }
                }}
                autoComplete="username"
                aria-invalid={Boolean(fieldErrors.identifier)}
                aria-describedby={
                  fieldErrors.identifier ? "identifier-error" : undefined
                }
                className="mt-2 h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-[color:var(--accent)]"
                placeholder="you@example.com or username"
              />
              {fieldErrors.identifier ? (
                <span
                  id="identifier-error"
                  className="mt-2 block text-xs text-[color:var(--danger)]"
                >
                  {fieldErrors.identifier}
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <span className="relative mt-2 block">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((current) => ({
                        ...current,
                        password: undefined,
                      }));
                    }
                  }}
                  autoComplete="current-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                  className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 pr-16 text-sm outline-none transition-colors placeholder:text-muted focus:border-[color:var(--accent)]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-3 text-xs font-medium text-muted transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
              {fieldErrors.password ? (
                <span
                  id="password-error"
                  className="mt-2 block text-xs text-[color:var(--danger)]"
                >
                  {fieldErrors.password}
                </span>
              ) : null}
            </label>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-medium text-muted transition-colors hover:text-foreground"
                onClick={() =>
                  setFormMessage(
                    "Password recovery is not connected in this prototype.",
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            {formMessage ? (
              <p
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2.5 text-xs leading-5 text-muted"
                role="status"
              >
                {formMessage}
              </p>
            ) : null}

            <GlassButton
              type="submit"
              arrow={!loading}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Signing in..." : "Log in"}
            </GlassButton>
          </form>

          <p className="mt-6 text-center text-[11px] leading-5 text-muted">
            Prototype authentication accepts any non-empty identifier and
            password. Credentials are never stored.
          </p>
        </section>
      </div>
    </main>
  );
}
