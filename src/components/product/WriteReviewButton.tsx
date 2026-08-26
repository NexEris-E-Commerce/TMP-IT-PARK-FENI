"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, User } from "../ui/icons";

/**
 * Review submission is gated on accounts (Phase 4). Rather than fake a submit,
 * this reveals an honest inline notice pointing to sign-in.
 */
export function WriteReviewButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-stretch gap-3 sm:items-end">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
      >
        <Plus size={16} />
        Write a Review
      </button>
      {open && (
        <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink-soft sm:max-w-xs">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
            <User size={16} />
          </span>
          <span>
            Sign in to share your experience.{" "}
            <Link href="/login" className="font-semibold text-brand-700 hover:underline">
              Sign in
            </Link>{" "}
            or verify a purchase to post a review.
          </span>
        </div>
      )}
    </div>
  );
}
