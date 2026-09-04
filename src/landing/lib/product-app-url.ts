/**
 * Base URL of the product application.
 *
 * Empty in the unified single-domain deployment (this repo), so every link
 * below resolves as a same-origin relative path. Set
 * `NEXT_PUBLIC_PRODUCT_APP_URL` (e.g. `http://localhost:3001`) only when the
 * landing and product are served as two separate apps.
 */
export const productAppUrl = process.env.NEXT_PUBLIC_PRODUCT_APP_URL || "";

/** Absolute-or-relative href for a product route, e.g. `/workspace`. */
export function productHref(path: string): string {
  return `${productAppUrl}${path}`;
}

/** Entry point into the product: the workspace Overview page. */
export const WORKSPACE_HREF = productHref("/workspace");

/** Business Brain canvas — used by the handoff primary CTA. */
export const WORKSPACE_BRAIN_HREF = productHref("/workspace/brain");

/**
 * Navigate into the workspace. Uses client-side routing in the unified
 * deployment, and a full page load when the product is a separate origin
 * (where the Next.js router cannot navigate).
 */
export function goToWorkspace(router: { replace: (href: string) => void }) {
  if (productAppUrl) {
    window.location.assign(WORKSPACE_HREF);
    return;
  }
  router.replace("/workspace");
}
