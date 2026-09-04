/**
 * Locale-aware formatters for the Overview page.
 */

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export type Locale = "en" | "bn";

function toBn(s: string): string {
  return s.replace(/\d/g, (d) => BN_DIGITS[+d]);
}

export function formatBDT(value: number, locale: Locale = "en"): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
  const result = `৳${formatted}`;
  return locale === "bn" ? toBn(result) : result;
}

export function formatNumber(value: number, locale: Locale = "en"): string {
  const formatted = new Intl.NumberFormat("en-US").format(Math.round(value));
  return locale === "bn" ? toBn(formatted) : formatted;
}

export function formatPercent(value: number, locale: Locale = "en", digits: number = 1): string {
  const formatted = `${(value * 100).toFixed(digits)}%`;
  return locale === "bn" ? toBn(formatted) : formatted;
}

export function formatRelative(isoDate: string, locale: Locale = "en"): string {
  const t = new Date(isoDate).getTime();
  if (Number.isNaN(t)) return locale === "bn" ? "অজানা সময়" : "unknown time";
  const diffSec = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (diffSec < 60) return locale === "bn" ? "এইমাত্র" : "just now";
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return locale === "bn" ? `${toBn(String(mins))} মিনিট আগে` : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return locale === "bn" ? `${toBn(String(hours))} ঘণ্টা আগে` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return locale === "bn" ? `${toBn(String(days))} দিন আগে` : `${days}d ago`;
}
