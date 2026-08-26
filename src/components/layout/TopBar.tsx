import Link from "next/link";
import { site } from "@/lib/site";
import { formatPhone } from "@/lib/format";
import { Container } from "../ui/Container";
import { Phone, MapPin } from "../ui/icons";

/** Slim announcement / utility bar above the header. */
export function TopBar() {
  return (
    <div className="bg-ink text-white">
      <Container className="flex h-9 items-center justify-between gap-4 text-xs">
        <p className="hidden items-center gap-2 text-white/70 sm:flex">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          Genuine products • EMI available • Free delivery over ৳5,000
        </p>
        <a
          href={`tel:${site.phone}`}
          className="flex items-center gap-1.5 font-semibold text-white sm:hidden"
        >
          <Phone size={13} /> {formatPhone(site.phone)}
        </a>
        <div className="flex items-center gap-4 text-white/70">
          <a
            href={`tel:${site.phone}`}
            className="hidden items-center gap-1.5 transition hover:text-white md:flex"
          >
            <Phone size={13} /> {formatPhone(site.phone)}
          </a>
          <Link href="/account/orders" className="hidden transition hover:text-white sm:inline">
            Track Order
          </Link>
          <Link href="/help" className="hidden transition hover:text-white sm:inline">
            Help
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 transition hover:text-white"
          >
            <MapPin size={13} /> Showrooms
          </Link>
        </div>
      </Container>
    </div>
  );
}
