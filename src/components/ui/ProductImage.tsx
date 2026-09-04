"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductThumb } from "./ProductThumb";
import { cn } from "@/lib/cn";

// Hosts next/image's optimizer is configured for (see next.config.ts).
// Anything else is rendered unoptimized instead of crashing — admins can
// paste a product photo URL from anywhere via "Or paste an image URL" in
// the admin product form, so we can't assume every image lives on our own
// Supabase Storage bucket.
const OPTIMIZABLE_HOST_SUFFIXES = [".supabase.co"];

function isOptimizable(url: string) {
  try {
    return OPTIMIZABLE_HOST_SUFFIXES.some((suffix) => new URL(url).hostname.endsWith(suffix));
  } catch {
    return false;
  }
}

/**
 * Renders a product's real uploaded/linked photo, falling back to the
 * generated category-icon placeholder when there's no image set, or the
 * image fails to load (e.g. a dead link an admin pasted in).
 */
export function ProductImage({
  image,
  category = "",
  name,
  className,
  iconSize,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
}: {
  image?: string | null;
  category?: string;
  name: string;
  className?: string;
  iconSize?: number;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return <ProductThumb category={category} name={name} className={className} iconSize={iconSize} />;
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={image}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        unoptimized={!isOptimizable(image)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
