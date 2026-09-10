import { requireSuperAdmin } from "@/lib/require-admin";
import { SettingsTabs } from "@/components/admin/SettingsTabs";

export default async function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
  await requireSuperAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Settings</h1>

      <div className="mt-5">
        <SettingsTabs />
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
