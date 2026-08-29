import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ChevronRight, User, ReturnBox, Heart, ShieldCheck, ChevronRight as Arrow } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/account/SignOutButton";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, is_admin")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0];

  return (
    <Container className="py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-dim">
        <Link href="/" className="transition hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-ink">My Account</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
            <User size={26} />
          </span>
          <div>
            <h1 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
              Hi, {displayName}
            </h1>
            <p className="text-sm text-ink-soft">{user.email}</p>
          </div>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AccountLink href="/account/orders" icon={<ReturnBox size={20} />} title="My Orders" description="Track and view your order history" />
        <AccountLink href="/wishlist" icon={<Heart size={20} />} title="Wishlist" description="Items you've saved for later" />
        <AccountLink href="/account/addresses" icon={<User size={20} />} title="Addresses" description="Manage delivery addresses" />
        {profile?.is_admin && (
          <AccountLink href="/admin" icon={<ShieldCheck size={20} />} title="Admin Panel" description="Manage products, orders & messages" />
        )}
      </div>
    </Container>
  );
}

function AccountLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-5 transition hover:border-brand-200 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
          {icon}
        </span>
        <div>
          <p className="text-sm font-bold text-ink">{title}</p>
          <p className="text-xs text-ink-dim">{description}</p>
        </div>
      </div>
      <Arrow size={16} className="text-ink-dim" />
    </Link>
  );
}
