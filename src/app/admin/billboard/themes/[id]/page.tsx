import Link from "next/link";
import { notFound } from "next/navigation";
import { getBillboardThemes, updateBillboardTheme } from "@/lib/actions/billboard-themes";
import { ThemeForm } from "@/components/admin/ThemeForm";

export const metadata = { title: "Edit Theme · Billboard" };

export default async function EditBillboardThemePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const themes = await getBillboardThemes();
  const theme = themes.find((t) => t.id === id);
  if (!theme) notFound();
  if (theme.isBuiltin) notFound();

  const boundAction = updateBillboardTheme.bind(null, id);

  return (
    <div>
      <Link href="/admin/billboard/themes" className="text-sm font-semibold text-brand-700 hover:underline">
        ← Back to Themes
      </Link>
      <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">Edit Theme</h1>

      <div className="mt-6 max-w-2xl">
        <ThemeForm action={boundAction} initial={theme} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
