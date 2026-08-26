import { usps } from "@/lib/site";
import { Truck, CreditCard, ReturnBox, Headset } from "../ui/icons";
import type { SVGProps } from "react";

const iconMap: Record<string, (p: SVGProps<SVGSVGElement> & { size?: number }) => React.ReactElement> = {
  delivery: Truck,
  payment: CreditCard,
  return: ReturnBox,
  support: Headset,
};

export function UspStrip() {
  return (
    <section aria-label="Why shop with us" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {usps.map((u) => {
        const Icon = iconMap[u.icon] ?? Truck;
        return (
          <div
            key={u.title}
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-brand-200 hover:shadow-card"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">{u.title}</p>
              <p className="truncate text-xs text-ink-soft">{u.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
