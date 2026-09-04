"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems, type NavItem } from "@/landing/data/navigation";
import { Logo } from "@/landing/components/ui/Logo";
import { GlassButton } from "@/landing/components/ui/GlassButton";
import { ThemeToggle } from "@/landing/components/ui/ThemeToggle";
import { LanguageToggle } from "@/landing/components/ui/LanguageToggle";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

function navLabel(item: NavItem, t: (key: string) => string) {
  const translated = t(`nav.${item.key}`);
  // t() falls back to the key when missing — guard so we always render
  // the dictionary value (not the raw "nav.foo" path).
  return translated && !translated.startsWith("nav.")
    ? translated
    : item.label;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { t, language } = useTranslation();
  const isBn = language === "bn";
  // `language` is consumed inside the JSX via `isBn` only — the destructured
  // value also drives the `useTranslation` subscription.

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={cn("navbar", scrolled && "is-scrolled")}>
      <div className="navbar-inner">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <a href="#top" className="shrink-0" aria-label={t("common.homeAria")}>
            <Logo />
          </a>

          <nav
            className="hidden items-center gap-4 xl:gap-6 lg:flex"
            aria-label={t("common.primaryNav")}
          >
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={cn(
                  "text-[12px] text-muted transition-colors hover:text-foreground",
                  isBn && "lang-bn"
                )}
              >
                {navLabel(item, t)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/login"
              className={cn(
                "hidden text-[13px] text-muted transition-colors hover:text-foreground sm:inline",
                isBn && "lang-bn"
              )}
            >
              {t("nav.logIn")}
            </a>
            <GlassButton
              href="/onboarding"
              arrow
              className="hidden sm:inline-flex"
            >
              {t("nav.getStarted")}
            </GlassButton>
            <LanguageToggle size="sm" />
            <ThemeToggle />
            <button
              ref={closeRef}
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t("common.closeMenu") : t("common.openMenu")}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="glass-strong border-t border-[color:var(--border)] lg:hidden"
        >
          <nav className="container-page flex flex-col gap-1 py-4" aria-label={t("common.mobileNav")}>
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm text-foreground",
                  isBn && "lang-bn"
                )}
                onClick={() => setOpen(false)}
              >
                {navLabel(item, t)}
              </a>
            ))}
            <a
              href="/login"
              className={cn(
                "rounded-xl px-3 py-3 text-sm text-muted",
                isBn && "lang-bn"
              )}
              onClick={() => setOpen(false)}
            >
              {t("nav.logIn")}
            </a>
            <GlassButton
              href="/onboarding"
              arrow
              className="mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              {t("nav.getStarted")}
            </GlassButton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
