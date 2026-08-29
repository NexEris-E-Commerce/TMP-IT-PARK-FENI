import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata = { title: "My Addresses" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Saved Addresses"
      description="Save multiple delivery addresses for faster checkout — coming very soon. The database table is already set up; the UI is next."
      breadcrumbs={[{ label: "My Account", href: "/account" }]}
    />
  );
}
