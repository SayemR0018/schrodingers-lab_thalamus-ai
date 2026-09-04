import { ThemeProvider } from "@/landing/components/theme/ThemeProvider";
import { ThemeScript } from "@/landing/components/theme/ThemeScript";
import { HtmlLangUpdater } from "@/landing/components/system/HtmlLangUpdater";

/**
 * Layout for the public marketing / onboarding surface (`/login`,
 * `/onboarding`, `/onboarding/profile`, `/handoff`).
 *
 * `landing-scope` is what makes the merge possible: it re-declares the
 * landing palette for this subtree only (see the LANDING SURFACE block in
 * `globals.css`), so these components render with their original colors
 * while `/workspace/*` keeps the workspace palette. Nothing here is applied
 * to the product shell.
 *
 * `ThemeScript` runs before this subtree paints and seeds the `dark` class
 * from `localStorage["thalamus-theme"]`, preventing a light-mode flash. It is
 * deliberately kept out of the root layout so the workspace's own
 * `ThemeToggle` remains the single source of truth on product routes.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="landing-scope">
      <ThemeScript />
      <ThemeProvider>
        <HtmlLangUpdater />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </ThemeProvider>
    </div>
  );
}
