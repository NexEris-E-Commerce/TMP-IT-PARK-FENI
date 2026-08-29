import Link from "next/link";
import { Container } from "../ui/Container";
import { ChevronRight } from "../ui/icons";

type Crumb = { label: string; href: string };

export function ContentPage({
  title,
  subtitle,
  breadcrumbs = [],
  children,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  children: React.ReactNode;
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

      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-ink-soft">{subtitle}</p>}

      <div className="prose-content mt-8 max-w-3xl space-y-8">{children}</div>
    </Container>
  );
}
