import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage public bucket URLs, e.g.
      // https://<project-ref>.supabase.co/storage/v1/object/public/product-images/...
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

// withSentryConfig is safe to leave on even before Sentry is fully set up —
// it only uploads source maps (for readable stack traces) when SENTRY_ORG,
// SENTRY_PROJECT and SENTRY_AUTH_TOKEN are all present in the build
// environment; otherwise it just skips that step with a build-log notice.
//
// Note: this project builds with Turbopack (Next.js 16 default), which
// doesn't yet support every Sentry webpack-only option (source map upload
// itself works fine either way).
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  // Routes error reports through our own domain instead of a raw
  // ingest.sentry.io URL, so ad-blockers don't quietly eat them.
  tunnelRoute: "/monitoring",
});
