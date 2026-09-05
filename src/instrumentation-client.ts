import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only send events when a DSN is actually configured, so local dev and
  // any environment that hasn't been set up yet stay silent instead of
  // erroring or spamming a shared project.
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  // Low, cost-conscious sampling — plenty for a store this size and stays
  // comfortably inside Sentry's free tier. Raise later if needed.
  tracesSampleRate: 0.1,

  // Keep noisy browser-extension/network-blip errors out of the inbox.
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
