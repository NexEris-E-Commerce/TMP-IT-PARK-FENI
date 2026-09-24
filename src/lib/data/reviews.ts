import type { Product } from "../types";

/**
 * Aggregate-only rating summary for a product.
 *
 * NOTE: This module used to also synthesize individual "customer" reviews —
 * deterministic but entirely fake names/dates/text generated from the
 * product's rating/count. That's been removed: presenting invented reviews
 * as if they were real customers would be misleading to shoppers (and to
 * whoever is reviewing the site before launch). `average`/`total` below are
 * real numbers the admin sets on the product; individual review cards will
 * only ever come from the real (accounts-gated) review system once that
 * ships — see WriteReviewButton.tsx.
 */

export interface RatingBar {
  stars: number;
  count: number;
  pct: number;
}

export interface ReviewSummary {
  average: number;
  total: number;
  distribution: RatingBar[];
}

/** Star-count distribution skewed toward the average, summing to `total`. Purely a visual estimate from the aggregate rating — not derived from any individual review. */
function buildDistribution(average: number, total: number): RatingBar[] {
  if (total <= 0) {
    return [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, pct: 0 }));
  }
  const weights = [5, 4, 3, 2, 1].map((s) => Math.exp(-Math.abs(s - average) * 1.7));
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / sum) * total);
  const counts = raw.map(Math.round);
  const diff = total - counts.reduce((a, b) => a + b, 0);
  const top = counts.indexOf(Math.max(...counts));
  counts[top] = Math.max(0, counts[top] + diff);
  return [5, 4, 3, 2, 1].map((stars, i) => ({
    stars,
    count: counts[i],
    pct: Math.round((counts[i] / total) * 100),
  }));
}

export function getReviewSummary(product: Product): ReviewSummary {
  const average = product.rating ?? 0;
  const total = product.reviewCount ?? 0;
  return { average, total, distribution: buildDistribution(average, total) };
}
