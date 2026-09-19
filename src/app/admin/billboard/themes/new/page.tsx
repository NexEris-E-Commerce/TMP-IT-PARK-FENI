import Link from "next/link";
import { createBillboardTheme } from "@/lib/actions/billboard-themes";
import { ThemeForm } from "@/components/admin/ThemeForm";

export const metadata = { title: "New Theme · Billboard" };

export default function NewBillboardThemePage() {
  return (
    <div>
      <Link href="/admin/billboard/themes" className="text-sm font-semibold text-brand-700 hover:underline">
        ← Back to Themes
      </Link>
      <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">New Theme</h1>

      <div className="mt-6 max-w-2xl">
        <ThemeForm action={createBillboardTheme} submitLabel="Create Theme" />
      </div>
    </div>
  );
}
