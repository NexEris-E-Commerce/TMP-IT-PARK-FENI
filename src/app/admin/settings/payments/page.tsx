import { getPaymentSettings } from "@/lib/actions/settings";
import { PaymentSettingsForm } from "@/components/admin/PaymentSettingsForm";

export const metadata = { title: "Payments · Settings" };

export default async function AdminPaymentSettingsPage() {
  const settings = await getPaymentSettings();

  return (
    <div>
      <p className="text-sm text-ink-soft">
        Configure online payments (bKash/Nagad/Rocket/card via SSLCommerz). Cash on Delivery always
        works and needs no setup.
      </p>

      <div className="mt-6 max-w-xl">
        <PaymentSettingsForm initial={settings} />
      </div>
    </div>
  );
}
