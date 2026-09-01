"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Grid, Cart as CartIcon, Components, Headset, User, CreditCard, ArrowRight } from "@/components/ui/icons";

const links = [
  { href: "/admin", label: "Dashboard", icon: Grid, exact: true },
  { href: "/admin/products", label: "Products", icon: Components },
  { href: "/admin/orders", label: "Orders", icon: CartIcon },
  { href: "/admin/customers", label: "Customers", icon: User },
  { href: "/admin/messages", label: "Messages", icon: Headset },
  { href: "/admin/settings", label: "Settings", icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
              active ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-muted hover:text-ink",
            )}
          >
            <span className="flex items-center gap-2.5">
              <l.icon size={17} />
              {l.label}
            </span>
            {active && <ArrowRight size={14} />}
          </Link>
        );
      })}
      <Link
        href="/"
        className="mt-4 block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-dim transition hover:bg-muted hover:text-ink"
      >
        ← Back to Store
      </Link>
    </nav>
  );
}
