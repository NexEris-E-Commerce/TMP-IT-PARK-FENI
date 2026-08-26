"use client";

import { useState } from "react";
import { Check, ArrowRight } from "../ui/icons";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink px-6 py-10 text-white sm:px-10 sm:py-12">
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-accent-600/40 blur-3xl" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          Stay in the Loop
        </h2>
        <p className="mt-2 max-w-md text-sm text-white/75">
          Get new arrivals, exclusive deals and tech tips delivered to your inbox.
          No spam — just the good stuff.
        </p>

        {done ? (
          <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-success/20 px-5 py-3 text-sm font-semibold text-white">
            <Check size={18} /> You’re subscribed — thanks for joining!
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setDone(true);
            }}
            className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address"
              className="h-12 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none backdrop-blur transition placeholder:text-white/50 focus:border-white/40 focus:ring-4 focus:ring-white/10"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-brand-700 transition hover:bg-white/90 active:scale-[0.98] focus-ring"
            >
              Subscribe
              <ArrowRight size={16} />
            </button>
          </form>
        )}
        <p className="mt-3 text-xs text-white/50">
          By subscribing you agree to receive marketing emails from IT PARK FENI.
        </p>
      </div>
    </section>
  );
}
