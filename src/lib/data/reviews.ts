import type { Product } from "../types";

/**
 * Mock customer reviews. Real reviews arrive with accounts + DB (Phase 4);
 * until then we synthesize a plausible, *deterministic* set from each product's
 * aggregate rating and review count. Determinism (seeded by slug) keeps server
 * and client render identical — no hydration mismatch, no `Date`/`Math.random`.
 */

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
}

export interface RatingBar {
  stars: number;
  count: number;
  pct: number;
}

export interface ReviewSummary {
  average: number;
  total: number;
  distribution: RatingBar[];
  reviews: Review[];
  shown: number;
}

/* ── deterministic PRNG seeded by string ─────────── */
function seedFrom(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  "Tanvir Ahmed", "Rafiul Islam", "Sadia Rahman", "Mahmudul Hasan",
  "Nusrat Jahan", "Imran Kabir", "Farhana Akter", "Shakib Chowdhury",
  "Ariful Haque", "Mehedi Hasan", "Sabbir Ahmed", "Tasnim Sultana",
  "Rakibul Islam", "Jubayer Alam", "Sharmin Akter", "Naimur Rahman",
  "Fahim Faisal", "Anika Tabassum", "Rasel Mia", "Sumaiya Islam",
];

const DATES = [
  "2 days ago", "5 days ago", "1 week ago", "2 weeks ago", "3 weeks ago",
  "18 Jul 2026", "9 Jul 2026", "27 Jun 2026", "14 Jun 2026", "2 Jun 2026",
  "21 May 2026", "8 May 2026", "19 Apr 2026", "3 Apr 2026",
];

const POSITIVE_TITLES = [
  "Excellent product, fully satisfied",
  "Great value for the price",
  "Exactly as described — recommended",
  "Genuine product, fast delivery",
  "Very happy with this purchase",
  "Premium quality, worth every taka",
  "Superb performance",
];

const MIXED_TITLES = [
  "Good, but has minor issues",
  "Decent for the price",
  "Works fine, packaging could be better",
  "Satisfactory overall",
];

const POSITIVE_BODIES = [
  "Delivery was quick and the product is 100% genuine. Packaging was secure and everything was intact. Highly recommended from IT PARK.",
  "Been using it for a few weeks now and performance is excellent. Build quality feels premium. Will buy again.",
  "Exactly what I needed. The price here was better than other Feni shops and the warranty is official. Great service.",
  "Original product with proper warranty card. Staff at the showroom were very helpful in choosing the right model.",
  "Setup was easy and it works flawlessly. bKash payment and delivery both smooth. Thanks IT PARK Feni.",
  "Superb value. Handles everything I throw at it without any lag. Very satisfied with the purchase.",
  "Received the order on time in perfect condition. Genuine product, would definitely recommend to others.",
];

const MIXED_BODIES = [
  "Product is good and works as expected. Only issue was the delivery took a day longer than mentioned, but overall satisfied.",
  "Does the job well for the price. Not premium build but reliable for daily use. Fair deal.",
  "Happy with performance. Packaging could be a little better, but the product itself is genuine and working fine.",
  "Solid product overall. Would have liked a longer warranty, but no complaints about quality.",
];

function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

/** Star-count distribution skewed toward the average, summing to `total`. */
function buildDistribution(average: number, total: number): RatingBar[] {
  const weights = [5, 4, 3, 2, 1].map((s) => Math.exp(-Math.abs(s - average) * 1.7));
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / sum) * total);
  const counts = raw.map(Math.round);
  // Reconcile rounding drift into the dominant bucket.
  let diff = total - counts.reduce((a, b) => a + b, 0);
  const top = counts.indexOf(Math.max(...counts));
  counts[top] = Math.max(0, counts[top] + diff);
  return [5, 4, 3, 2, 1].map((stars, i) => ({
    stars,
    count: counts[i],
    pct: total ? Math.round((counts[i] / total) * 100) : 0,
  }));
}

export function getReviewSummary(product: Product): ReviewSummary {
  const average = product.rating ?? 0;
  const total = product.reviewCount ?? 0;
  const distribution = buildDistribution(average, total);

  const rnd = mulberry32(seedFrom(product.slug));
  const shown = Math.min(total, average >= 4 ? 5 : 4);

  // Sample ratings drawn to mirror the distribution, biased high like real
  // "most helpful" surfacing, but include an occasional critical note.
  const sampleStars: number[] = [];
  for (let i = 0; i < shown; i++) {
    const r = rnd();
    if (average >= 4.5) sampleStars.push(r < 0.7 ? 5 : r < 0.92 ? 4 : 3);
    else if (average >= 4) sampleStars.push(r < 0.5 ? 5 : r < 0.85 ? 4 : 3);
    else sampleStars.push(r < 0.4 ? 5 : r < 0.75 ? 4 : 3);
  }

  const usedNames = new Set<string>();
  const reviews: Review[] = sampleStars.map((rating, i) => {
    let author = pick(NAMES, rnd);
    let guard = 0;
    while (usedNames.has(author) && guard++ < NAMES.length) author = pick(NAMES, rnd);
    usedNames.add(author);
    const positive = rating >= 4;
    return {
      id: `${product.slug}-r${i}`,
      author,
      rating,
      date: pick(DATES, rnd),
      title: positive ? pick(POSITIVE_TITLES, rnd) : pick(MIXED_TITLES, rnd),
      body: positive ? pick(POSITIVE_BODIES, rnd) : pick(MIXED_BODIES, rnd),
      verified: rnd() < 0.85,
      helpful: Math.floor(rnd() * 24),
    };
  });

  return { average, total, distribution, reviews, shown };
}
