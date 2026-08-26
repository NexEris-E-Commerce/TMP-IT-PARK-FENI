import Link from "next/link";
import { site, footerColumns, paymentMethods } from "@/lib/site";
import { formatPhone } from "@/lib/format";
import { Container } from "../ui/Container";
import { Logo } from "../ui/Logo";
import { Phone, MapPin, ChevronRight, Facebook, Instagram, YouTube } from "../ui/icons";

const socialIcon = { facebook: Facebook, instagram: Instagram, youtube: YouTube } as const;

const payTone: Record<string, string> = {
  bKash: "text-[#e2136e]",
  Nagad: "text-[#ee7c1b]",
  Rocket: "text-[#8c3494]",
  Visa: "text-[#1a1f71]",
  Mastercard: "text-[#eb001b]",
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <Container className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4 lg:grid-cols-6 lg:gap-10">
        {/* Brand + contact */}
        <div className="col-span-2 lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {site.description}
          </p>

          <div className="mt-5 space-y-3">
            {site.showrooms.map((s) => (
              <div key={s.label} className="flex gap-2.5 text-sm">
                <MapPin size={17} className="mt-0.5 shrink-0 text-brand-600" />
                <span className="text-ink-soft">
                  <span className="font-semibold text-ink">{s.label}: </span>
                  {s.address}
                </span>
              </div>
            ))}
            <a
              href={`tel:${site.phone}`}
              className="flex items-center gap-2.5 text-sm text-ink-soft transition hover:text-brand-700"
            >
              <Phone size={17} className="shrink-0 text-brand-600" />
              {formatPhone(site.phone)}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-2.5 text-sm text-ink-soft transition hover:text-brand-700"
            >
              <span className="grid h-[17px] w-[17px] shrink-0 place-items-center rounded-[4px] bg-brand-600 text-[10px] font-bold text-white">
                @
              </span>
              {site.email}
            </a>
          </div>

          <div className="mt-5 flex items-center gap-2">
            {site.socials.map((s) => {
              const Icon = socialIcon[s.icon];
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-ink-soft transition hover:bg-brand-600 hover:text-white"
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Link columns */}
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold text-ink">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-1 text-sm text-ink-soft transition hover:text-brand-700"
                  >
                    <ChevronRight
                      size={13}
                      className="-ml-1 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100"
                    />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Payments */}
        <div>
          <h3 className="text-sm font-bold text-ink">We Accept</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {paymentMethods.map((m) => (
              <span
                key={m}
                className={`rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-bold ${payTone[m] ?? "text-ink-soft"}`}
              >
                {m}
              </span>
            ))}
            <span className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-bold text-success">
              COD
            </span>
          </div>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-dim sm:flex-row">
          <p>
            © {year} {site.fullName}. All rights reserved.
          </p>
          <p>
            {site.tagline} — {site.taglineBn}
          </p>
        </Container>
      </div>
    </footer>
  );
}
