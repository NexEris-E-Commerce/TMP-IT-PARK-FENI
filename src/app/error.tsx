"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw } from "@/components/ui/icons";

/**
 * Catches errors thrown while rendering any page (Server or Client
 * Component) below the root layout. Reports to Sentry so we find out about
 * these before a customer has to tell us — see global-error.tsx for the
 * rarer case of the root layout itself crashing.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Container className="grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-danger-soft text-danger">
          <AlertTriangle size={30} />
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Something went wrong
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          We hit an unexpected error loading this page. Our team has already been notified — please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-ink-dim">Reference code: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => reset()}>
            <RefreshCw size={16} />
            Try Again
          </Button>
          <Button href="/" variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    </Container>
  );
}
