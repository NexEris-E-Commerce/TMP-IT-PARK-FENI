"use client";

import { useState, useTransition } from "react";
import { setUserAdmin } from "@/lib/actions/users";
import { cn } from "@/lib/cn";

export function AdminToggleSwitch({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const [checked, setChecked] = useState(isAdmin);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    const next = !checked;
    setError(null);
    startTransition(async () => {
      const result = await setUserAdmin(userId, next);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setChecked(next);
    });
  }

  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={pending}
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition disabled:opacity-50",
          checked ? "border-brand-700 bg-brand-600" : "border-line-strong bg-line-strong",
        )}
      >
        <span
          style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
          className="inline-block h-5 w-5 rounded-full bg-white ring-1 ring-black/10 transition-transform"
        />
      </button>
      {error && <p className="mt-1 max-w-[140px] text-[11px] font-medium text-danger">{error}</p>}
    </div>
  );
}
