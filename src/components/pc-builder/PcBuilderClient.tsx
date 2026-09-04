"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { ChevronRight, Check } from "@/components/ui/icons";
import { BUILD_SLOTS, checkCpuMotherboardCompat, type BuildSlotKey } from "@/lib/pc-builder";
import { useCart } from "@/lib/cart-context";
import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";

export function PcBuilderClient({ options }: { options: Record<BuildSlotKey, Product[]> }) {
  const { addItem } = useCart();

  const [selection, setSelection] = useState<Partial<Record<BuildSlotKey, Product>>>({});
  const [added, setAdded] = useState(false);

  const compatWarning = checkCpuMotherboardCompat(selection.cpu, selection.motherboard);

  const selectedList = BUILD_SLOTS.map((s) => selection[s.key]).filter(Boolean) as Product[];
  const total = selectedList.reduce((sum, p) => sum + p.price, 0);
  const missingRequired = BUILD_SLOTS.some((s) => s.required && !selection[s.key]);

  function select(slot: BuildSlotKey, product: Product) {
    setSelection((prev) => ({
      ...prev,
      [slot]: prev[slot]?.id === product.id ? undefined : product,
    }));
  }

  function addAllToCart() {
    selectedList.forEach((p) => addItem(p, 1));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Container className="py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">PC Builder</span>
      </nav>

      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Build Your PC
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        Pick one part per category from our in-stock components. We&rsquo;ll flag a CPU/motherboard
        socket mismatch automatically — everything else, our technicians double-check when you
        collect or we deliver.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {BUILD_SLOTS.map((slot) => {
            const items = options[slot.key];
            const selected = selection[slot.key];
            return (
              <section key={slot.key} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base font-bold text-ink">
                    {slot.label} {slot.required && <span className="text-danger">*</span>}
                  </h2>
                  {selected && (
                    <button
                      type="button"
                      onClick={() => select(slot.key, selected)}
                      className="text-xs font-semibold text-ink-dim hover:text-danger"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {items.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-dim">No options available right now.</p>
                ) : (
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {items.map((p) => {
                      const isSelected = selected?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => select(slot.key, p)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                            isSelected
                              ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500"
                              : "border-line hover:border-brand-200",
                          )}
                        >
                          <ProductImage
                            image={p.image}
                            category={p.category}
                            name={p.name}
                            className="h-12 w-12 shrink-0 rounded-lg"
                            iconSize={20}
                            sizes="48px"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-xs font-semibold text-ink">{p.name}</p>
                            <p className="mt-0.5 text-xs text-ink-dim">{formatBDT(p.price)}</p>
                          </div>
                          {isSelected && <Check size={16} className="shrink-0 text-brand-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-line bg-surface p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-ink">Your Build</h2>

          {selectedList.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">Select parts on the left to start your build.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {selectedList.map((p) => (
                <li key={p.id} className="flex justify-between gap-3 text-ink-soft">
                  <span className="line-clamp-1">{p.name}</span>
                  <span className="shrink-0 font-medium text-ink">{formatBDT(p.price)}</span>
                </li>
              ))}
            </ul>
          )}

          {compatWarning && (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
              ⚠ {compatWarning}
            </p>
          )}

          <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-bold text-ink">
            <span>Total</span>
            <span>{formatBDT(total)}</span>
          </div>

          <Button
            onClick={addAllToCart}
            disabled={missingRequired || !!compatWarning || selectedList.length === 0}
            size="lg"
            className="mt-5 w-full"
          >
            {added ? "Added to Cart ✓" : "Add Build to Cart"}
          </Button>
          {missingRequired && (
            <p className="mt-2 text-center text-xs text-ink-dim">
              Select CPU, Motherboard, RAM and Storage to continue.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
