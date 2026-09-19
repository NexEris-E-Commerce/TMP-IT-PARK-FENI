import Link from "next/link";
import { createBillboardSlide, getDistinctProductTags, getProductPickerOptions } from "@/lib/actions/billboard";
import { getBillboardThemes } from "@/lib/actions/billboard-themes";
import { BillboardSlideForm } from "@/components/admin/BillboardSlideForm";

export const metadata = { title: "Add Slide · Billboard" };

export default async function NewBillboardSlidePage() {
  const [products, existingTags, themes] = await Promise.all([
    getProductPickerOptions(),
    getDistinctProductTags(),
    getBillboardThemes(),
  ]);

  return (
    <div>
      <Link href="/admin/billboard" className="text-sm font-semibold text-brand-700 hover:underline">
        ← Back to Billboard
      </Link>
      <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">Add Slide</h1>

      <div className="mt-6 max-w-5xl">
        <BillboardSlideForm
          action={createBillboardSlide}
          submitLabel="Add Slide"
          products={products}
          existingTags={existingTags}
          themes={themes}
        />
      </div>
    </div>
  );
}
