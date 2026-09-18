"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProductImage } from "../ui/ProductImage";
import { Rating } from "../ui/Rating";
import { ChevronLeft, ChevronRight, ArrowRight, Check } from "../ui/icons";
import type { BillboardSlide } from "@/lib/billboard";
import { cn } from "@/lib/cn";

export function Hero({ slides }: { slides: BillboardSlide[] }) {
  const [i, setI] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count === 0) return;
    const t = window.setInterval(() => setI((p) => (p + 1) % count), 6500);
    return () => window.clearInterval(t);
  }, [count]);

  const go = (n: number) => setI((n + count) % count);

  if (count === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl" aria-roledescription="carousel">
      <div className="relative h-[440px] sm:h-[420px] lg:h-[460px]">
        {slides.map((s, idx) => (
          <div
            key={idx}
            aria-hidden={idx !== i}
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-opacity duration-700",
              s.gradient,
              idx === i ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            {s.backgroundImage && (
              <>
                <Image
                  src={s.backgroundImage}
                  alt=""
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  unoptimized
                />
                {/* Just enough of a dark gradient (left-weighted, where the
                   copy sits) for white text to stay readable — not a color
                   wash over the whole photo. The theme color still shows up
                   via the glow blobs below and a thin edge vignette. */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
              </>
            )}
            {/* decorative texture + glow — skipped over a real photo so it doesn't add noise on top of it */}
            {!s.backgroundImage && (
              <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />
            )}
            <div className={cn("absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl", s.glow, s.backgroundImage && "opacity-60")} />
            <div className={cn("absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl", s.backgroundImage && "opacity-60")} />

            <div className="relative grid h-full grid-cols-1 items-center gap-6 px-6 py-8 sm:px-10 lg:grid-cols-2 lg:px-14">
              {/* Copy */}
              <div className="max-w-xl text-white">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  {s.eyebrow}
                </span>
                <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[44px]">
                  {s.title}{" "}
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent underline decoration-white/40 decoration-4 underline-offset-4">
                    {s.highlight}
                  </span>
                </h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                  {s.subtitle}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={s.primary.href}
                    className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-brand-700 shadow-lg transition hover:bg-white/90 active:scale-[0.98] focus-ring"
                  >
                    {s.primary.label}
                    <ArrowRight size={17} />
                  </Link>
                  <Link
                    href={s.secondary.href}
                    className="inline-flex h-12 items-center rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 active:scale-[0.98] focus-ring"
                  >
                    {s.secondary.label}
                  </Link>
                </div>
              </div>

              {/* Product showcase — the photo floats directly on the billboard
                 with just a shadow, no glass card box around it. Price/rating
                 sit in their own slim strip below, not wrapped around the image. */}
              <div className="relative hidden justify-self-center lg:block">
                <div className="relative h-64 w-64 overflow-hidden rounded-[28px] shadow-[0_35px_65px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/15 xl:h-72 xl:w-72">
                  <ProductImage
                    image={s.productImage}
                    category={s.category}
                    name={s.product}
                    className="h-full w-full"
                    iconSize={100}
                    sizes="288px"
                  />
                </div>

                <div className="absolute -left-8 top-3 rounded-2xl border border-white/20 bg-black/35 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                  Free Delivery
                </div>
                <div className="absolute -bottom-3 -right-7 rounded-2xl border border-white/20 bg-black/35 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                  Genuine Warranty
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white shadow-lg backdrop-blur-md">
                  <div>
                    <p className="text-sm font-semibold">{s.product}</p>
                    <p className="mt-0.5 text-xs text-white/70">Starting from</p>
                  </div>
                  <p className="font-display text-xl font-extrabold">{s.price}</p>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/15 bg-black/30 px-4 py-2.5 shadow-lg backdrop-blur-md">
                  <Rating value={s.rating} size={13} className="[&_span]:text-white" />
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/90 px-2 py-1 text-[11px] font-bold text-white">
                    <Check size={12} /> In Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        type="button"
        onClick={() => go(i - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30 sm:grid"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => go(i + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30 sm:grid"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-5 left-6 flex gap-2 sm:left-10 lg:left-14">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => go(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === i}
            className={cn(
              "h-2 rounded-full transition-all",
              idx === i ? "w-7 bg-white" : "w-2 bg-white/50 hover:bg-white/75",
            )}
          />
        ))}
      </div>
    </section>
  );
}
