import { ContentPage } from "@/components/layout/ContentPage";
import { site, whyChoosePoints } from "@/lib/site";
import { Check } from "@/components/ui/icons";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <ContentPage
      title="About Us"
      subtitle={`Your trusted IT partner in Feni — ${site.description.toLowerCase()}`}
    >
      <section>
        <h2 className="font-display text-lg font-bold text-ink">Who We Are</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {site.fullName} has grown into one of Feni&rsquo;s most trusted names for computers,
          components, gaming builds, printers and networking gear. Operating from two showrooms
          at Mohipal Plaza, we serve students, professionals, gamers and businesses across Feni
          and the surrounding districts with genuine products and honest advice.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Beyond selling hardware, our technicians build custom PCs, service laptops, and set up
          networking for homes and offices — all backed by official manufacturer warranties and
          our own after-sales support.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-ink">Why Choose Us</h2>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {whyChoosePoints.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-sm text-ink-soft">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                <Check size={13} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-ink">Visit Our Showrooms</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {site.showrooms.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm font-bold text-ink">{s.label}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.address}</p>
            </div>
          ))}
        </div>
      </section>
    </ContentPage>
  );
}
