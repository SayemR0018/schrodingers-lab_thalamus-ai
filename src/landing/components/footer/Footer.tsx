"use client";

import { Logo } from "@/landing/components/ui/Logo";
import { socialLinks } from "@/landing/data/footer";
import { useTranslation } from "@/landing/lib/i18n";
import { cn } from "@/landing/lib/cn";

const columnKeys = ["0", "1", "2", "3"] as const;
// Each column has 3-5 links: vary per column
const linksPerColumn = [5, 4, 4, 3] as const;
const utilityKeys = ["0", "1", "2", "3", "4"] as const;

export function Footer() {
  const { t, language } = useTranslation();
  const isBn = language === "bn";

  return (
    <footer className="pt-16 pb-8">
      <div className="container-page">
        <div className="grid gap-12 border-t border-[color:var(--border)] pt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)]">
          <div>
            <Logo />
            <p className={cn("mt-4 max-w-xs text-sm leading-6 text-muted", isBn && "lang-bn")}>
              {t("footer.tagline")}
            </p>
            <ul className="mt-6 flex gap-2">
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    aria-label={`${t("footer.ariaPrefix")} ${item.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] text-muted transition-colors hover:text-foreground"
                  >
                    <SocialIcon name={item.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columnKeys.map((colKey, colIndex) => {
              const linkCount = linksPerColumn[colIndex];
              return (
                <div key={colKey}>
                  <p className={cn("text-sm font-semibold", isBn && "lang-bn")}>
                    {t(`footer.columns.${colKey}.title`)}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {Array.from({ length: linkCount }).map((_, linkIdx) => (
                      <li key={linkIdx}>
                        <a
                          href="#"
                          className={cn(
                            "text-sm text-muted transition-colors hover:text-foreground",
                            isBn && "lang-bn"
                          )}
                        >
                          {t(`footer.columns.${colKey}.links.${linkIdx}.label`)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div
          id="careers"
          className="mt-12 grid gap-6 border-t border-[color:var(--border)] py-8 sm:grid-cols-2 lg:grid-cols-5"
        >
          {utilityKeys.map((key) => (
            <a
              key={key}
              href="#"
              className={cn("text-sm", isBn && "lang-bn")}
            >
              <span className="block font-medium text-foreground">
                {t(`footer.utility.${key}.label`)}
              </span>
              <span className="mt-1 block text-muted">
                {t(`footer.utility.${key}.detail`)}
              </span>
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-[color:var(--border)] pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className={cn(isBn && "lang-bn")}>{t("footer.copyright")}</p>
          <div className="flex gap-5">
            <a href="#privacy" className={cn("hover:text-foreground", isBn && "lang-bn")}>
              {t("common.privacy")}
            </a>
            <a href="#terms" className={cn("hover:text-foreground", isBn && "lang-bn")}>
              {t("common.terms")}
            </a>
            <a href="#cookies" className={cn("hover:text-foreground", isBn && "lang-bn")}>
              {t("common.cookies")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: "x" | "linkedin" | "discord" | "youtube" }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  } as const;

  if (name === "x") {
    return (
      <svg {...common}>
        <path d="M18.9 2H22l-7.2 8.2L22.7 22h-6.5l-5.1-6.7L5.3 22H2.2l7.7-8.8L1.5 2h6.6l4.6 6.1L18.9 2Zm-1.1 18h1.8L6.4 3.9H4.5L17.8 20Z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg {...common}>
        <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-6.5c0-1.55-.03-3.54-2.16-3.54-2.16 0-2.49 1.69-2.49 3.43V23h-4V8.5z" />
      </svg>
    );
  }

  if (name === "discord") {
    return (
      <svg {...common}>
        <path d="M19.3 5.2A17 17 0 0 0 14.9 4l-.2.4c1.8.5 2.7 1.2 3.6 2.1-1.5-.8-3-.1-4.4-.1-1.4 0-2.9-.7-4.4.1.9-.9 1.8-1.6 3.6-2.1L9.1 4A17 17 0 0 0 4.7 5.2C1.8 9.6 1 13.8 1.4 18c1.7 1.3 3.4 2 5.1 2.5l.6-1.1c-.8-.3-1.5-.7-2.2-1.1 1.8 1.4 4 2.2 7.1 2.2s5.3-.8 7.1-2.2c-.7.4-1.4.8-2.2 1.1l.6 1.1c1.7-.5 3.4-1.2 5.1-2.5.5-5-0.6-9.1-3.3-12.8ZM8.8 15.4c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.6 1.7-1.5 1.7Zm6.4 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12 9.6 15.6Z" />
    </svg>
  );
}
