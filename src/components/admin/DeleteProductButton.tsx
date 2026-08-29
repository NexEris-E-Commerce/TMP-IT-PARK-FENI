"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/lib/actions/products";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete "${name}"? This can't be undone.`)) {
          startTransition(() => deleteProduct(id));
        }
      }}
      className="rounded-lg border border-danger/20 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger-soft disabled:opacity-50"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
