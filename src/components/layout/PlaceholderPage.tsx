import Link from "next/link";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { ChevronRight } from "../ui/icons";
import { site } from "@/lib/site";
import { formatPhone } from "@/lib/format";

type Crumb = { label: string; href: string };

/**
 * Premium "in progress" page used for routes that are fully built in later
 * phases (Shop → Phase 2, Cart/Checkout → Phase 3, Account/Admin → Phase 4–5).
 * Keeps navigation honest and the storefront cohesive in the meantime.
 */
export function PlaceholderPage({
  title,
  description,
  breadcrumbs = [],
}: {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
}) {
  return (
    <Container className="py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        {breadcrumbs.map((c) => (
          <span key={c.href} className="flex items-center gap-1.5">
            <ChevronRight size={14} />
            <Link href={c.href} className="transition hover:text-brand-700">
              {c.label}
            </Link>
          </span>
        ))}
        <ChevronRight size={14} />
        <span className="font-medium text-ink">{title}</span>
      </nav>

      <div className="mt-6 grid place-items-center overflow-hidden rounded-3xl border border-line bg-surface px-6 py-20 text-center">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
          Coming Soon
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
          {description ??
            "We're putting the finishing touches on this section. It'll be live shortly — in the meantime, our team is ready to help."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/">Back to Home</Button>
          <Button href={`tel:${site.phone}`} variant="outline">
            Call {formatPhone(site.phone)}
          </Button>
        </div>
      </div>
    </Container>
  );
}
