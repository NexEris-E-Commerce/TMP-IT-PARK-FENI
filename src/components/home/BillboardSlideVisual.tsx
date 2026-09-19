"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductImage } from "../ui/ProductImage";
import { Rating } from "../ui/Rating";
import { ArrowRight, Check } from "../ui/icons";
import type { BillboardSlide } from "@/lib/billboard";
import { hexToRgba } from "@/lib/billboard-color-utils";
import { cn } from "@/lib/cn";

/**
 * Renders exactly one billboard slide's visuals — background, copy, and the
 * product showcase. Shared by the homepage Hero (which wraps this in its
 * carousel positioning/transitions) and the admin billboard form's live
 * preview, so what an admin sees while editing is pixel-for-pixel what
 * ships, not a mocked-up approximation.
 */
export function BillboardSlideVisual({ slide: s, priority = false }: { slide: BillboardSlide; priority?: boolean }) {
  return (
    <div style={{ backgroundImage: s.gradientCss }} className="relative h-full w-full overflow-hidden rounded-3xl">
      {s.backgroundImage && (
        <>
          <Image src={s.backgroundImage} alt="" fill priority={priority} className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        </>
      )}
      {!s.backgroundImage && (
        <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />
      )}
      <div
        style={{ backgroundColor: s.glowColor, opacity: s.backgroundImage ? 0.35 : 0.55 }}
        className="absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl"
      />
      <div
        style={{ opacity: s.backgroundImage ? 0.35 : 0.55 }}
        className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-white/30 blur-3xl"
      />

      <div className="relative grid h-full grid-cols-1 items-center gap-6 px-6 py-8 sm:px-10 lg:grid-cols-2 lg:px-14">
        {/* Copy — every color here (eyebrow/title/highlight/subtitle) comes
           from the slide's theme (or a per-slide override), all
           admin-picked, nothing auto-detected. Over a real photo, a
           translucent blurred plaque (also from the theme) sits directly
           behind the text so no photo can blend into the words. */}
        <div
          style={s.backgroundImage ? { backgroundColor: hexToRgba(s.plaqueColor, 0.42) } : undefined}
          className={cn("max-w-xl", s.backgroundImage && "rounded-3xl p-5 shadow-xl backdrop-blur-md sm:p-7")}
        >
          <span
            style={{
              color: s.eyebrowColor,
              borderColor: hexToRgba(s.eyebrowColor, 0.35),
              backgroundColor: hexToRgba(s.eyebrowColor, 0.12),
            }}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur"
          >
            <span style={{ backgroundColor: s.eyebrowColor }} className="h-1.5 w-1.5 rounded-full" />
            {s.eyebrow}
          </span>
          <h1
            style={{ color: s.titleColor, textShadow: s.backgroundImage ? "0 2px 14px rgba(0,0,0,0.55)" : undefined }}
            className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[44px]"
          >
            {s.title}{" "}
            <span
              style={{ color: s.highlightColor, textDecorationColor: hexToRgba(s.highlightColor, 0.45) }}
              className="underline decoration-4 underline-offset-4"
            >
              {s.highlight}
            </span>
          </h1>
          <p style={{ color: s.subtitleColor }} className="mt-4 max-w-md text-sm leading-relaxed sm:text-base">
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
              style={{
                color: s.titleColor,
                borderColor: hexToRgba(s.titleColor, 0.3),
                backgroundColor: hexToRgba(s.titleColor, 0.1),
              }}
              className="inline-flex h-12 items-center rounded-xl border px-6 text-sm font-semibold backdrop-blur transition hover:brightness-110 active:scale-[0.98] focus-ring"
            >
              {s.secondary.label}
            </Link>
          </div>
        </div>

        {/* Product showcase — the photo floats directly on the billboard
           with just a shadow, no glass card box around it. */}
        <div className="relative hidden justify-self-center lg:block">
          <div className="relative h-56 w-56 overflow-hidden rounded-[28px] shadow-[0_35px_65px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/15 xl:h-64 xl:w-64">
            <ProductImage
              image={s.productImage}
              category={s.category}
              name={s.product}
              className="h-full w-full"
              iconSize={90}
              sizes="256px"
            />
          </div>

          <div className="absolute -left-8 top-3 rounded-2xl border border-white/20 bg-black/35 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
            Free Delivery
          </div>
          <div className="absolute -bottom-3 -right-7 rounded-2xl border border-white/20 bg-black/35 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md">
            Genuine Warranty
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-black/30 px-4 py-3 shadow-lg backdrop-blur-md">
            <div>
              <p className="text-sm font-semibold text-white">{s.product}</p>
              <div className="mt-1 flex items-center gap-2">
                <Rating value={s.rating} size={12} className="[&_span]:text-white/80" />
                <span className="inline-flex items-center gap-1 rounded-full bg-success/90 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Check size={10} /> In Stock
                </span>
              </div>
            </div>
            <p className="font-display text-lg font-extrabold text-white sm:text-xl">{s.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
