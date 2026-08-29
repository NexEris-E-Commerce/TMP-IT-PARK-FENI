import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/actions/products";
import { createAdminClient } from "@/lib/supabase/admin";
import { ChevronRight } from "@/components/ui/icons";
import type { Product } from "@/lib/types";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: row } = await supabase.from("products").select("*").eq("id", id).single();

  if (!row) notFound();

  const product: Partial<Product> & { id: string } = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    brand: row.brand,
    category: row.category,
    image: row.image ?? undefined,
    price: row.price,
    regularPrice: row.regular_price ?? undefined,
    stock: row.stock,
    lowStockThreshold: row.low_stock_threshold ?? undefined,
    keySpec: row.key_spec ?? undefined,
    warranty: row.warranty ?? undefined,
    specs: row.specs ?? [],
    isFeatured: row.is_featured ?? false,
    isBestSeller: row.is_best_seller ?? false,
    isDeal: row.is_deal ?? false,
  };

  const boundAction = updateProduct.bind(null, id);

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/admin/products" className="transition hover:text-brand-700">
          Products
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">Edit Product</span>
      </nav>
      <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">Edit Product</h1>

      <div className="mt-6">
        <ProductForm action={boundAction} initial={product} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
