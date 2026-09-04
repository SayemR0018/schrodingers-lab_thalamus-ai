"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/landing/components/ui/SectionReveal";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

export function Newsletter() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section
      id="newsletter"
      className="pb-8"
      aria-labelledby="newsletter-heading"
    >
      <SectionReveal className="container-page">
        <div className="glass rounded-[28px] px-6 py-10 sm:px-12 sm:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_minmax(0,420px)]">
            <div>
              <h2
                id="newsletter-heading"
                className={cn(
                  "text-3xl font-semibold tracking-tight",
                  isBn && "lang-bn"
                )}
              >
                {t("newsletter.heading")}
              </h2>
              <p className={cn("mt-3 max-w-md text-[15px] leading-7 text-muted", isBn && "lang-bn")}>
                {t("newsletter.subtitle")}
              </p>
            </div>
            {sent ? (
              <p className={cn("text-sm text-foreground", isBn && "lang-bn")} role="status">
                {t("common.newsletterSuccess")}
              </p>
            ) : (
              <form
                className="glass-strong flex items-center rounded-2xl p-1.5"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!email.includes("@")) return;
                  setSent(true);
                }}
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  {t("common.emailAddress")}
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t("common.emailPlaceholder")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={cn(
                    "h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted",
                    isBn && "lang-bn"
                  )}
                />
                <button
                  type="submit"
                  className="btn btn-primary h-11 w-11 shrink-0 px-0"
                  aria-label={t("common.subscribe")}
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
