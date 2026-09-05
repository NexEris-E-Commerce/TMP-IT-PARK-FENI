/**
 * Resolves the storefront's public base URL (no trailing slash), used by
 * sitemap.ts, robots.ts, and canonical/OG tags.
 *
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL — set this in Vercel once the real domain
 *    (e.g. itparkfeni.com) is connected. Takes priority over everything.
 * 2. VERCEL_PROJECT_PRODUCTION_URL — Vercel sets this automatically to the
 *    project's production domain, so this works correctly even before a
 *    custom domain is added (falls back to the *.vercel.app URL).
 * 3. A hardcoded fallback, only ever used for local dev without any env
 *    vars set.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}
