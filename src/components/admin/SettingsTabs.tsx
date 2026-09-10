"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/admin/settings/payments", label: "Payments" },
  { href: "/admin/settings/search-console", label: "Google Search Console" },
];

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-line">
      {tabs.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition",
              active
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-ink-soft hover:text-ink",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
