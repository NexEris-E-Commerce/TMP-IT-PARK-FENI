import type { Product } from "@/lib/types";
import { getReviewSummary } from "@/lib/data/reviews";
import { Rating } from "../ui/Rating";
import { Star, Check, ShieldCheck } from "../ui/icons";
import { cn } from "@/lib/cn";
import { WriteReviewButton } from "./WriteReviewButton";

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function Reviews({ product }: { product: Product }) {
  const { average, total, distribution, reviews, shown } = getReviewSummary(product);

  if (total === 0) {
    return (
      <section className="mt-12">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
          Ratings &amp; Reviews
        </h2>
        <div className="mt-4 flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-soft">
            No reviews yet. Be the first to review{" "}
            <span className="font-semibold text-ink">{product.name}</span>.
          </p>
          <WriteReviewButton />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
        Ratings &amp; Reviews
      </h2>

      <div className="mt-4 grid gap-6 rounded-2xl border border-line bg-surface p-6 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-10">
        {/* Summary + distribution */}
        <div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-display text-5xl font-extrabold leading-none text-ink">
                {average.toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center">
                <Rating value={average} showValue={false} size={16} />
              </div>
              <p className="mt-1.5 text-xs text-ink-dim">{total} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {distribution.map((bar) => (
                <div key={bar.stars} className="flex items-center gap-2">
                  <span className="flex w-9 shrink-0 items-center gap-0.5 text-xs font-medium text-ink-soft">
                    {bar.stars}
                    <Star size={11} filled className="text-amber-400" />
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-amber-400"
                      style={{ width: `${bar.pct}%` }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-right text-xs tabular-nums text-ink-dim">
                    {bar.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-success-soft px-3 py-2.5 text-xs font-medium text-success">
            <ShieldCheck size={16} className="shrink-0" />
            Ratings aggregated from verified purchases.
          </div>

          <div className="mt-4">
            <WriteReviewButton />
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-5">
          <p className="text-sm text-ink-dim">
            Showing {shown} of {total} reviews
          </p>
          {reviews.map((r) => (
            <article key={r.id} className="border-b border-line pb-5 last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-600 text-sm font-bold text-white">
                  {initials(r.author)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold text-ink">{r.author}</span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
                        <Check size={10} strokeWidth={3} /> Verified
                      </span>
                    )}
                    <span className="text-xs text-ink-dim">· {r.date}</span>
                  </div>
                  <div className="mt-1.5 flex">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        filled={i < r.rating}
                        className={cn(i < r.rating ? "text-amber-400" : "text-line-strong")}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-bold text-ink">{r.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.body}</p>
              <p className="mt-2.5 text-xs text-ink-dim">
                {r.helpful} {r.helpful === 1 ? "person" : "people"} found this helpful
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
