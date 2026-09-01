import { getPaymentSettings } from "@/lib/actions/settings";
import { PaymentSettingsForm } from "@/components/admin/PaymentSettingsForm";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getPaymentSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Configure online payments (bKash/Nagad/Rocket/card via SSLCommerz). Cash on Delivery always
        works and needs no setup.
      </p>

      <div className="mt-6 max-w-xl">
        <PaymentSettingsForm initial={settings} />
      </div>
    </div>
  );
}
