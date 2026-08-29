"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ChevronRight, Compare as CompareIcon, Close } from "@/components/ui/icons";
import { useCompare } from "@/lib/compare-context";
import { useCart } from "@/lib/cart-context";
import { formatBDT } from "@/lib/format";

export default function ComparePage() {
  const { items, remove, clear, isLoaded } = useCompare();
  const { addItem } = useCart();

  // Union of every spec label across compared items, in first-seen order.
  const specLabels: string[] = [];
  items.forEach((item) => {
    (item.specs ?? []).forEach((s) => {
      if (!specLabels.includes(s.label)) specLabels.push(s.label);
    });
  });

  return (
    <Container className="py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">Compare</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Compare Products
        </h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-sm font-semibold text-ink-dim transition hover:text-danger"
          >
            Clear all
          </button>
        )}
      </div>

      {!isLoaded ? null : items.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-3xl border border-line bg-surface px-6 py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
            <CompareIcon size={28} />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">No products to compare yet</h2>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            Tap the compare icon on up to 4 products from the same category to see them side by side.
          </p>
          <Button href="/shop" className="mt-6">
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-40 border-b border-line p-4 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-ink-dim">
                  Product
                </th>
                {items.map((item) => (
                  <th key={item.productId} className="border-b border-line p-4 align-top">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => remove(item.productId)}
                        aria-label="Remove from compare"
                        className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-muted text-ink-dim transition hover:bg-danger-soft hover:text-danger"
                      >
                        <Close size={12} />
                      </button>
                      <Link href={`/product/${item.slug}`} className="block">
                        <div className="relative mx-auto aspect-square w-24 overflow-hidden rounded-xl bg-muted">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : null}
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs font-semibold text-ink">{item.name}</p>
                      </Link>
                      <p className="mt-1 text-sm font-bold text-ink">{formatBDT(item.price)}</p>
                      <button
                        type="button"
                        disabled={item.stock <= 0}
                        onClick={() =>
                          addItem(
                            {
                              id: item.productId,
                              slug: item.slug,
                              name: item.name,
                              image: item.image,
                              price: item.price,
                              stock: item.stock,
                              brand: item.brand,
                              category: item.category,
                            },
                            1,
                          )
                        }
                        className="mt-2 h-8 w-full rounded-lg bg-brand-600 text-xs font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {item.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-line bg-muted/40 p-4 text-xs font-semibold text-ink-soft">
                  Brand
                </td>
                {items.map((item) => (
                  <td key={item.productId} className="border-b border-line p-4 text-center capitalize text-ink">
                    {item.brand}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-line bg-muted/40 p-4 text-xs font-semibold text-ink-soft">
                  Rating
                </td>
                {items.map((item) => (
                  <td key={item.productId} className="border-b border-line p-4 text-center text-ink">
                    {item.rating ? `${item.rating.toFixed(1)} / 5` : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-line bg-muted/40 p-4 text-xs font-semibold text-ink-soft">
                  Warranty
                </td>
                {items.map((item) => (
                  <td key={item.productId} className="border-b border-line p-4 text-center text-ink">
                    {item.warranty ?? "—"}
                  </td>
                ))}
              </tr>
              {specLabels.map((label) => (
                <tr key={label}>
                  <td className="border-b border-line bg-muted/40 p-4 text-xs font-semibold text-ink-soft">
                    {label}
                  </td>
                  {items.map((item) => {
                    const spec = item.specs?.find((s) => s.label === label);
                    return (
                      <td key={item.productId} className="border-b border-line p-4 text-center text-ink">
                        {spec?.value ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
