import Link from "next/link";
import { getAdminBillboardSlides } from "@/lib/actions/billboard";
import { BillboardSlideRowActions } from "@/components/admin/BillboardSlideRowActions";

export const metadata = { title: "Billboard" };

const MODE_LABEL: Record<string, string> = {
  manual: "Specific Product",
  category: "Category",
  tag: "Tag",
  random: "Random",
};

function modeDetail(slide: Awaited<ReturnType<typeof getAdminBillboardSlides>>[number]): string {
  if (slide.mode === "manual") return slide.productName ?? "(product deleted)";
  if (slide.mode === "category") return slide.category ?? "—";
  if (slide.mode === "tag") return slide.tag ?? "—";
  return "any product, re-picked each visit";
}

export default async function AdminBillboardPage() {
  const slides = await getAdminBillboardSlides();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Homepage Billboard</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Controls the big rotating banner at the top of the homepage. Add slides that pull from a specific
            product, a category, a product tag, or a random pick — instead of the generic default.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/billboard/themes"
            className="inline-flex h-10 items-center rounded-xl border border-line-strong px-4 text-sm font-semibold text-ink transition hover:bg-muted"
          >
            Manage Themes
          </Link>
          <Link
            href="/admin/billboard/new"
            className="inline-flex h-10 items-center rounded-xl bg-brand-600 px-4 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            + Add Slide
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-dim">
              <th className="p-4">Slide</th>
              <th className="p-4">Mode</th>
              <th className="p-4">Source</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-sm text-ink-dim">
                  No slides configured yet — the homepage is showing the built-in default banner.{" "}
                  <Link href="/admin/billboard/new" className="font-semibold text-brand-700 hover:underline">
                    Add your first slide
                  </Link>
                  .
                </td>
              </tr>
            ) : (
              slides.map((s, idx) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="max-w-[240px] p-4">
                    <p className="line-clamp-1 font-semibold text-ink">{s.title || "(auto from product)"}</p>
                    {s.eyebrow && <p className="text-xs text-ink-dim">{s.eyebrow}</p>}
                  </td>
                  <td className="p-4 text-ink-soft">{MODE_LABEL[s.mode]}</td>
                  <td className="p-4 capitalize text-ink-soft">{modeDetail(s)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <BillboardSlideRowActions
                        id={s.id}
                        enabled={s.enabled}
                        isFirst={idx === 0}
                        isLast={idx === slides.length - 1}
                      />
                      <Link
                        href={`/admin/billboard/${s.id}`}
                        className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-muted"
                      >
                        Edit
                      </Link>
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
