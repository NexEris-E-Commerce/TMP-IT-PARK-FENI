import Link from "next/link";
import { createBillboardSlide, getDistinctProductTags, getProductPickerOptions } from "@/lib/actions/billboard";
import { BillboardSlideForm } from "@/components/admin/BillboardSlideForm";

export const metadata = { title: "Add Slide · Billboard" };

export default async function NewBillboardSlidePage() {
  const [products, existingTags] = await Promise.all([getProductPickerOptions(), getDistinctProductTags()]);

  return (
    <div>
      <Link href="/admin/billboard" className="text-sm font-semibold text-brand-700 hover:underline">
        ← Back to Billboard
      </Link>
      <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">Add Slide</h1>

      <div className="mt-6 max-w-3xl">
        <BillboardSlideForm
          action={createBillboardSlide}
          submitLabel="Add Slide"
          products={products}
          existingTags={existingTags}
        />
      </div>
    </div>
  );
}
