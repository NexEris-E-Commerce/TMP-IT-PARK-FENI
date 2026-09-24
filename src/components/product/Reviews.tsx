import type { Product } from "@/lib/types";
import { getReviewSummary } from "@/lib/data/reviews";
import { Rating } from "../ui/Rating";
import { Star, ShieldCheck } from "../ui/icons";
import { WriteReviewButton } from "./WriteReviewButton";

export function Reviews({ product }: { product: Product }) {
  const { average, total, distribution } = getReviewSummary(product);

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
            Aggregate rating shown for this product.
          </div>

          <div className="mt-4">
            <WriteReviewButton />
          </div>
        </div>

        {/* Individual review cards intentionally not shown — see reviews.ts note */}
        <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-line-strong bg-canvas p-8 text-center">
          <p className="max-w-xs text-sm text-ink-soft">
            Individual customer reviews will appear here as shoppers post them.
          </p>
        </div>
      </div>
    </section>
  );
}
