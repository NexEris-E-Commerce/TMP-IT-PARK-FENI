import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatBDT } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { cn } from "@/lib/cn";

export const metadata = { title: "Products" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (filter === "low-stock") query = query.lte("stock", 3);

  const { data: products } = await query;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {filter === "low-stock" ? "Showing low-stock items only. " : ""}
            {products?.length ?? 0} product{products?.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center rounded-xl bg-brand-600 px-4 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          + Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-dim">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {!products?.length ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm text-ink-dim">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="font-semibold text-brand-700 hover:underline">
                    Add your first one
                  </Link>
                  .
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="max-w-[280px] p-4">
                    <p className="line-clamp-1 font-semibold text-ink">{p.name}</p>
                    <p className="text-xs text-ink-dim">{p.slug}</p>
                  </td>
                  <td className="p-4 capitalize text-ink-soft">{p.category}</td>
                  <td className="p-4 font-medium text-ink">{formatBDT(p.price)}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-bold",
                        p.stock <= 0
                          ? "bg-danger-soft text-danger"
                          : p.stock <= (p.low_stock_threshold ?? 3)
                            ? "bg-amber-50 text-amber-700"
                            : "bg-success/10 text-success",
                      )}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-muted"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
