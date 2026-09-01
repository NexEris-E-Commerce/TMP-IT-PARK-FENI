"use client";

import { useActionState } from "react";
import { updatePaymentSettings, type PaymentSettingsFormState } from "@/lib/actions/settings";

const inputClass =
  "h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

export function PaymentSettingsForm({
  initial,
}: {
  initial: { storeId: string; hasPassword: boolean; sandbox: boolean };
}) {
  const [state, formAction, pending] = useActionState<PaymentSettingsFormState, FormData>(
    updatePaymentSettings,
    {},
  );

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div>
        <span className="text-xs font-semibold text-ink-soft">SSLCommerz Store ID</span>
        <input
          name="storeId"
          defaultValue={initial.storeId}
          placeholder="e.g. itparkfeni_live"
          className={`${inputClass} mt-1.5`}
        />
      </div>

      <div>
        <span className="text-xs font-semibold text-ink-soft">
          SSLCommerz Store Password{" "}
          {initial.hasPassword && (
            <span className="font-normal text-ink-dim">(already saved — leave blank to keep it)</span>
          )}
        </span>
        <input
          name="storePassword"
          type="password"
          placeholder={initial.hasPassword ? "••••••••" : "Enter store password"}
          className={`${inputClass} mt-1.5`}
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
        <input type="checkbox" name="sandbox" defaultChecked={initial.sandbox} className="h-4 w-4 accent-brand-600" />
        Sandbox mode (test payments only — turn off when ready to accept real payments)
      </label>

      {state.error && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success">
          Saved! Payments will use these settings immediately — no redeploy needed.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-6 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save Settings"}
      </button>

      <p className="text-xs text-ink-dim">
        Don&rsquo;t have a Store ID yet? Get free sandbox credentials instantly at{" "}
        <a
          href="https://developer.sslcommerz.com/registration/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-700 hover:underline"
        >
          developer.sslcommerz.com/registration
        </a>{" "}
        to test, or apply for a live merchant account at{" "}
        <a
          href="https://signup.sslcommerz.com/login"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-700 hover:underline"
        >
          signup.sslcommerz.com
        </a>
        .
      </p>
    </form>
  );
}
