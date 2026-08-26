import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata = { title: "My Orders" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Track Your Order"
      description="Order history and live order tracking will be available once accounts and checkout go live. Need an update now? Give us a call."
      breadcrumbs={[{ label: "My Account", href: "/account" }]}
    />
  );
}
