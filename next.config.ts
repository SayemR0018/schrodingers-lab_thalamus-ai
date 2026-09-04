import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `openai` is a large CJS-interop package that only ever runs inside the
   * `nodejs` API routes. Keeping it external means Next bundles a `require`
   * instead of tracing the whole SDK into every serverless function.
   */
  serverExternalPackages: ["openai"],

  images: {
    // Only local assets from `public/` and `src/app/icon.svg` are used today.
    // Add remote hosts here (rather than disabling optimization) if the
    // marketing surface starts pulling in externally hosted imagery.
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },

  // Surface real problems at build time instead of shipping them to users.
  // (Next 16 no longer runs ESLint during `next build`; lint separately with
  // `npm run lint`.)
  typescript: {
    ignoreBuildErrors: false,
  },

  // `X-Powered-By: Next.js` adds nothing but fingerprinting surface.
  poweredByHeader: false,
};

export default nextConfig;
