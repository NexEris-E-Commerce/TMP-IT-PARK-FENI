"use client";

import { useEffect, useState } from "react";
import { BillboardSlideVisual } from "./BillboardSlideVisual";
import { ChevronLeft, ChevronRight } from "../ui/icons";
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
      <div className="relative h-[440px] sm:h-[420px] lg:h-[480px]">
        {slides.map((s, idx) => (
          <div
            key={idx}
            aria-hidden={idx !== i}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              idx === i ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <BillboardSlideVisual slide={s} priority={idx === 0} />
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
