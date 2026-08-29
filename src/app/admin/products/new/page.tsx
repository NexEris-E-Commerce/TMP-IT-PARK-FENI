import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/products";
import { ChevronRight } from "@/components/ui/icons";

export const metadata = { title: "Add Product" };

export default function NewProductPage() {
  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/admin/products" className="transition hover:text-brand-700">
          Products
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">Add Product</span>
      </nav>
      <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">Add Product</h1>

      <div className="mt-6">
        <ProductForm action={createProduct} submitLabel="Add Product" />
      </div>
    </div>
  );
}
