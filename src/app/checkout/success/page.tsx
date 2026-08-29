import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Check } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { formatPhone } from "@/lib/format";

export const metadata = { title: "Order Confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-md place-items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
          <Check size={32} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Order Placed!
        </h1>
        {order && (
          <p className="mt-2 text-sm text-ink-soft">
            Order number <span className="font-bold text-ink">{order}</span>
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Thank you for shopping with {site.fullName}. We&rsquo;ll call you shortly at your
          provided number to confirm delivery details.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/account/orders">Track Order</Button>
          <Button href={`tel:${site.phone}`} variant="outline">
            Call {formatPhone(site.phone)}
          </Button>
        </div>
        <Link href="/shop" className="mt-6 text-sm font-semibold text-brand-700 hover:underline">
          Continue Shopping
        </Link>
      </div>
    </Container>
  );
}
