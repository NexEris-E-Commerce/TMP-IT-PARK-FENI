import Link from "next/link";
import { getBillboardThemes } from "@/lib/actions/billboard-themes";
import { gradientCss } from "@/lib/billboard-color-utils";
import { DeleteThemeButton } from "@/components/admin/DeleteThemeButton";

export const metadata = { title: "Themes · Billboard" };

export default async function AdminBillboardThemesPage() {
  const themes = await getBillboardThemes();

  return (
    <div>
      <Link href="/admin/billboard" className="text-sm font-semibold text-brand-700 hover:underline">
        ← Back to Billboard
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Billboard Themes</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Reusable color combos for billboard slides. Built-in themes can&rsquo;t be edited or deleted — save your
            own instead, and use it on any slide going forward.
          </p>
        </div>
        <Link
          href="/admin/billboard/themes/new"
          className="inline-flex h-10 items-center rounded-xl bg-brand-600 px-4 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          + New Theme
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((t) => (
          <div key={t.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div
              style={{ backgroundImage: gradientCss({ gradientFrom: t.gradientFrom, gradientVia: t.gradientVia, gradientTo: t.gradientTo }) }}
              className="relative h-20"
            >
              <div style={{ backgroundColor: t.glowColor }} className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-50 blur-2xl" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-ink">{t.name}</p>
                {t.isBuiltin && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-dim">
                    Built-in
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                {!t.isBuiltin && (
                  <>
                    <Link
                      href={`/admin/billboard/themes/${t.id}`}
                      className="rounded-lg border border-line-strong px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-muted"
                    >
                      Edit
                    </Link>
                    <DeleteThemeButton id={t.id} name={t.name} />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
