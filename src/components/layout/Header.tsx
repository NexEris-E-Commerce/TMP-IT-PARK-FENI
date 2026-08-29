"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, mainNav } from "@/lib/site";
import { categories } from "@/lib/data/categories";
import { formatPhone } from "@/lib/format";
import { Container } from "../ui/Container";
import { Logo } from "../ui/Logo";
import { SearchBar } from "./SearchBar";
import { CategoryIcon } from "../ui/CategoryIcon";
import {
  Heart,
  Compare,
  User,
  Cart,
  Menu,
  Close,
  ChevronDown,
  ChevronRight,
  Phone,
} from "../ui/icons";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useCompare } from "@/lib/compare-context";

const actionLinks = [
  { href: "/compare", label: "Compare", Icon: Compare },
  { href: "/wishlist", label: "Wishlist", Icon: Heart },
  { href: "/account", label: "Account", Icon: User },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation + lock body scroll while it is open.
  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "border-b bg-surface/95 backdrop-blur transition-shadow",
          scrolled ? "border-line shadow-[0_6px_24px_-16px_rgba(15,27,51,0.4)]" : "border-transparent",
        )}
      >
        {/* Main row */}
        <Container className="flex h-16 items-center gap-3 lg:h-20 lg:gap-6">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-ink-soft transition hover:bg-muted lg:hidden"
          >
            <Menu size={22} />
          </button>

          <Link href="/" aria-label={`${site.fullName} home`} className="shrink-0">
            <span className="flex lg:hidden">
              <Logo showTagline={false} />
            </span>
            <span className="hidden lg:flex">
              <Logo />
            </span>
          </Link>

          <div className="hidden flex-1 lg:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1 lg:gap-2">
            <div className="hidden items-center gap-1 lg:flex">
              {actionLinks.map(({ href, label, Icon }) => {
                const badge = href === "/wishlist" ? wishCount : href === "/compare" ? compareCount : 0;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-label={label}
                    className="group relative grid h-11 w-11 place-items-center rounded-xl text-ink-soft transition hover:bg-muted hover:text-brand-700"
                  >
                    <Icon size={21} />
                    {badge > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-white">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                    <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition hover:bg-brand-100"
            >
              <Cart size={21} />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent-600 px-1 text-[11px] font-bold text-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          </div>
        </Container>

        {/* Mobile search row */}
        <Container className="pb-3 lg:hidden">
          <SearchBar />
        </Container>

        {/* Desktop nav row */}
        <div className="hidden border-t border-line lg:block">
          <Container>
            <nav className="flex items-center gap-1" aria-label="Primary">
              {mainNav.map((item) => {
                if (item.href === "/shop") {
                  return (
                    <div key={item.href} className="group relative">
                      <Link
                        href="/shop"
                        className={cn(
                          "inline-flex h-12 items-center gap-1 px-3 text-sm font-semibold transition",
                          isActive(item.href)
                            ? "text-brand-700"
                            : "text-ink-soft hover:text-brand-700",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          size={15}
                          className="transition group-hover:rotate-180"
                        />
                      </Link>
                      {/* Mega dropdown */}
                      <div className="invisible absolute left-0 top-full z-40 w-[560px] translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <div className="mt-1 rounded-2xl border border-line bg-surface p-3 shadow-lift">
                          <div className="grid grid-cols-2 gap-1">
                            {categories.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/shop?category=${cat.slug}`}
                                className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-brand-50"
                              >
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-brand-600">
                                  <CategoryIcon icon={cat.icon} size={20} />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-semibold text-ink">
                                    {cat.name}
                                  </span>
                                  <span className="block truncate text-xs text-ink-dim">
                                    {cat.tagline}
                                  </span>
                                </span>
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/shop"
                            className="mt-2 flex items-center justify-center gap-1 rounded-xl bg-muted py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                          >
                            View all products <ChevronRight size={15} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex h-12 items-center px-3 text-sm font-semibold transition",
                      item.label === "Deals" && !isActive(item.href)
                        ? "text-danger hover:text-danger"
                        : isActive(item.href)
                          ? "text-brand-700"
                          : "text-ink-soft hover:text-brand-700",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href={`tel:${site.phone}`}
                className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-ink"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
                  <Phone size={16} />
                </span>
                {formatPhone(site.phone)}
              </a>
            </nav>
          </Container>
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        shopOpen={shopOpen}
        setShopOpen={setShopOpen}
        isActive={isActive}
      />
    </header>
  );
}

function MobileDrawer({
  open,
  onClose,
  shopOpen,
  setShopOpen,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  shopOpen: boolean;
  setShopOpen: (v: boolean) => void;
  isActive: (href: string) => boolean;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-surface shadow-glass transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-lg text-ink-soft transition hover:bg-muted"
          >
            <Close size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <nav className="flex flex-col" aria-label="Mobile">
            {mainNav.map((item) => {
              if (item.href === "/shop") {
                return (
                  <div key={item.href}>
                    <button
                      type="button"
                      onClick={() => setShopOpen(!shopOpen)}
                      aria-expanded={shopOpen}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-ink transition hover:bg-muted"
                    >
                      Shop
                      <ChevronDown
                        size={18}
                        className={cn("transition", shopOpen && "rotate-180")}
                      />
                    </button>
                    {shopOpen && (
                      <div className="mb-1 ml-2 flex flex-col border-l border-line pl-2">
                        {categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/shop?category=${cat.slug}`}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
                          >
                            <CategoryIcon icon={cat.icon} size={18} />
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-3 text-[15px] font-semibold transition hover:bg-muted",
                    item.label === "Deals"
                      ? "text-danger"
                      : isActive(item.href)
                        ? "text-brand-700"
                        : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="my-3 h-px bg-line" />

          <div className="grid grid-cols-3 gap-2">
            {actionLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs font-semibold text-ink-soft transition hover:border-brand-200 hover:text-brand-700"
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-line bg-canvas px-4 py-4">
          <a
            href={`tel:${site.phone}`}
            className="flex items-center gap-2 text-sm font-semibold text-ink"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
              <Phone size={16} />
            </span>
            {formatPhone(site.phone)}
          </a>
          <p className="mt-2 text-xs leading-relaxed text-ink-dim">
            {site.showrooms[0].address}
          </p>
        </div>
      </div>
    </div>
  );
}
