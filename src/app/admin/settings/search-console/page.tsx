import { getSearchConsoleSettings } from "@/lib/actions/search-console";
import { SearchConsoleSettingsForm } from "@/components/admin/SearchConsoleSettingsForm";

export const metadata = { title: "Google Search Console · Settings" };

export default async function AdminSearchConsoleSettingsPage() {
  const searchConsoleSettings = await getSearchConsoleSettings();

  return (
    <div>
      <p className="text-sm text-ink-soft">Verify site ownership with Google Search Console.</p>

      <div className="mt-6 max-w-xl">
        <SearchConsoleSettingsForm initial={searchConsoleSettings} />
      </div>
    </div>
  );
}
