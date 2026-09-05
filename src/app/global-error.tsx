"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// This only fires for errors in the ROOT layout itself (rare). Normal page
// errors are handled by error.tsx once that's added (pre-launch checklist
// item #11) — this file's job is just to guarantee Sentry sees crashes even
// at that outermost level, and to keep the site from showing a blank page
// if that ever happens.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Please try reloading the page. If this keeps happening, contact support.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "#4338ca",
            color: "white",
            padding: "0.6rem 1.4rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
