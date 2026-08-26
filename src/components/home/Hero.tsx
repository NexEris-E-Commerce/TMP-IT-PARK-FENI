"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoryIcon } from "../ui/CategoryIcon";
import { Rating } from "../ui/Rating";
import { ChevronLeft, ChevronRight, ArrowRight, Check } from "../ui/icons";
import type { IconKey } from "@/lib/types";
import { cn } from "@/lib/cn";

type Slide = {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  gradient: string;
  glow: string;
  category: IconKey;
  product: string;
  price: string;
  rating: number;
};

const slides: Slide[] = [
  {
    eyebrow: "Complete IT Solution",
    title: "Build the PC You've Always",
    highlight: "Imagined",
    subtitle:
      "Hand-picked components, expert assembly and genuine warranty — configure your dream rig with our smart PC Builder.",
    primary: { label: "Start Building", href: "/pc-builder" },
    secondary: { label: "Shop Components", href: "/shop?category=components" },
    gradient: "from-brand-700 via-brand-600 to-accent-600",
    glow: "bg-accent-400/40",
    category: "gaming",
    product: "Custom Gaming PC",
    price: "৳85,000",
    rating: 4.9,
  },
  {
    eyebrow: "Genuine • Warranty • Best Price",
    title: "Laptops & Components for",
    highlight: "Every Need",
    subtitle:
      "From everyday work to high-end creation — authorized brands, honest pricing and after-sales support you can trust.",
    primary: { label: "Shop Laptops", href: "/shop?category=laptop" },
    secondary: { label: "View All Deals", href: "/deals" },
    gradient: "from-accent-700 via-brand-700 to-brand-600",
    glow: "bg-brand-300/40",
    category: "laptop",
    product: "Business Laptops",
    price: "৳62,000",
    rating: 4.8,
  },
  {
    eyebrow: "Level Up Your Setup",
    title: "Gaming Gear That Helps You",
    highlight: "Win",
    subtitle:
      "GPUs, monitors, mechanical keyboards and more. Everything you need for a competitive edge, in stock in Feni.",
    primary: { label: "Shop Gaming", href: "/shop?category=gaming" },
    secondary: { label: "Explore Monitors", href: "/shop?category=monitor" },
    gradient: "from-ink via-brand-800 to-accent-700",
    glow: "bg-accent-500/40",
    category: "components",
    product: "RTX Graphics Cards",
    price: "৳38,500",
    rating: 4.9,
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  const count = slides.length;

  useEffect(() => {
    const t = window.setInterval(() => setI((p) => (p + 1) % count), 6500);
    return () => window.clearInterval(t);
  }, [count]);

  const go = (n: number) => setI((n + count) % count);

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
            {/* decorative texture + glow */}
            <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />
            <div className={cn("absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl", s.glow)} />
            <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

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

              {/* Product mock */}
              <div className="relative hidden justify-self-center lg:flex">
                <div className="relative w-72 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
                  <div className="grid h-48 place-items-center rounded-2xl bg-white/90">
                    <CategoryIcon icon={s.category} size={92} strokeWidth={1} className="text-brand-600" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-white">
                    <div>
                      <p className="text-sm font-semibold">{s.product}</p>
                      <p className="mt-0.5 text-xs text-white/70">Starting from</p>
                    </div>
                    <p className="font-display text-xl font-extrabold">{s.price}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Rating value={s.rating} size={13} className="[&_span]:text-white" />
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/90 px-2 py-1 text-[11px] font-bold text-white">
                      <Check size={12} /> In Stock
                    </span>
                  </div>
                </div>
                <div className="absolute -left-6 top-8 rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                  Free Delivery
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                  Genuine Warranty
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
