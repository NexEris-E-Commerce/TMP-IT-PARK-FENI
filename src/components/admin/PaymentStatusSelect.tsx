"use client";

import { useTransition } from "react";
import { updatePaymentStatus } from "@/lib/actions/orders";
import { cn } from "@/lib/cn";

const STATUSES = ["unpaid", "paid", "failed", "refunded"];

export function PaymentStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updatePaymentStatus(orderId, e.target.value))}
      className={cn(
        "h-9 rounded-lg border border-line-strong bg-surface px-2.5 text-xs font-semibold capitalize outline-none transition focus:border-brand-500",
        pending && "opacity-50",
      )}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
