import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Reports errors thrown in nested Server Components that Next.js itself
// swallows before they'd otherwise reach Sentry. No-ops safely if SENTRY_DSN
// isn't set, since Sentry.init runs with enabled:false in that case.
export const onRequestError = Sentry.captureRequestError;
