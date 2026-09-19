"use client";

import { useTransition } from "react";
import { deleteBillboardTheme } from "@/lib/actions/billboard-themes";

export function DeleteThemeButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete theme "${name}"? Slides using it will fall back to the default theme.`)) {
          startTransition(() => {
            void deleteBillboardTheme(id);
          });
        }
      }}
      className="rounded-lg border border-danger/20 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger-soft disabled:opacity-50"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
