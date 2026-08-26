import Link from "next/link";
import { ArrowRight } from "../ui/icons";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  actionHref,
  actionLabel = "View All",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {actionHref && (
        <Link
          href={actionHref}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-800 sm:inline-flex"
        >
          {actionLabel}
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
