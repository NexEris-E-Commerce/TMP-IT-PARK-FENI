import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ChevronRight } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { AddressBook, type SavedAddress } from "@/components/account/AddressBook";

export const metadata = { title: "My Addresses" };

export default async function AddressesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account/addresses");

  const { data: addresses } = await supabase
    .from("addresses")
    .select("id, label, full_name, phone, zone_id, address_line, city, is_default")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <Container className="py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/account" className="transition hover:text-brand-700">
          My Account
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">My Addresses</span>
      </nav>

      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Saved Addresses
      </h1>
      <p className="mt-1.5 max-w-lg text-sm text-ink-soft">
        Save delivery addresses for faster checkout — pick one at checkout instead of typing it every time.
      </p>

      <div className="mt-8">
        <AddressBook addresses={(addresses ?? []) as SavedAddress[]} />
      </div>
    </Container>
  );
}
