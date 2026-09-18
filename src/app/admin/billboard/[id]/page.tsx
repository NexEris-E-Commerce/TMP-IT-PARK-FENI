import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminBillboardSlides,
  getDistinctProductTags,
  getProductPickerOptions,
  updateBillboardSlide,
} from "@/lib/actions/billboard";
import { BillboardSlideForm } from "@/components/admin/BillboardSlideForm";
import { ChevronRight } from "@/components/ui/icons";

export const metadata = { title: "Edit Slide · Billboard" };

export default async function EditBillboardSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [slides, products, existingTags] = await Promise.all([
    getAdminBillboardSlides(),
    getProductPickerOptions(),
    getDistinctProductTags(),
  ]);

  const slide = slides.find((s) => s.id === id);
  if (!slide) notFound();

  const boundAction = updateBillboardSlide.bind(null, id);

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/admin/billboard" className="transition hover:text-brand-700">
          Billboard
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">Edit Slide</span>
      </nav>
      <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">Edit Slide</h1>

      <div className="mt-6 max-w-3xl">
        <BillboardSlideForm
          action={boundAction}
          initial={slide}
          submitLabel="Save Changes"
          products={products}
          existingTags={existingTags}
        />
      </div>
    </div>
  );
}
