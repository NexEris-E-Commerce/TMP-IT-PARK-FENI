import { site, whyChoosePoints } from "@/lib/site";
import { formatPhone } from "@/lib/format";
import { Button } from "../ui/Button";
import { Check, MapPin, Phone, ShieldCheck } from "../ui/icons";

export function WhyChooseUs() {
  return (
    <section className="grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
      {/* Copy + reasons */}
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
          Why IT PARK
        </p>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Your Trusted IT Partner in Feni
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
          For every customer — from students to businesses — we deliver genuine
          products, fair pricing and dependable after-sales support. That’s what
          &ldquo;Complete IT Solution&rdquo; means to us.
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {whyChoosePoints.map((point) => (
            <li key={point} className="flex items-center gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                <Check size={16} />
              </span>
              <span className="text-sm font-semibold text-ink">{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button href="/about" variant="primary">
            About Us
          </Button>
          <Button href="/contact" variant="outline">
            Contact Us
          </Button>
        </div>
      </div>

      {/* Showroom card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 p-6 text-white sm:p-8">
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:20px_20px]" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
            <ShieldCheck size={14} /> Authorized Dealer
          </span>
          <h3 className="mt-4 font-display text-xl font-extrabold">Visit Our Showrooms</h3>
          <div className="mt-4 space-y-4">
            {site.showrooms.map((s) => (
              <div key={s.label} className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-white/80" />
                <div>
                  <p className="text-sm font-bold">{s.label}</p>
                  <p className="text-sm text-white/80">{s.address}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href={`tel:${site.phone}`}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-brand-700 transition hover:bg-white/90"
          >
            <Phone size={17} /> Call {formatPhone(site.phone)}
          </a>
        </div>
      </div>
    </section>
  );
}
