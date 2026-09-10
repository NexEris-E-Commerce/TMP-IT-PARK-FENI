import type { Metadata, Viewport } from "next";
import { cache } from "react";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { CompareProvider } from "@/lib/compare-context";
import { createAdminClient } from "@/lib/supabase/admin";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const bengali = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Reads the (optional) Google Search Console meta-tag / GA / GTM ids that a
// super admin can set at /admin/settings, without ever throwing — every
// caller below just gets empty strings if nothing's configured yet or the
// table doesn't exist yet on a database that hasn't run the latest schema.
const getSiteVerificationSettings = cache(async () => {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("search_console_settings")
      .select("meta_tag_content, ga_measurement_id, gtm_container_id")
      .eq("id", "google_search_console")
      .single();

    return {
      googleSiteVerification: data?.meta_tag_content ?? undefined,
      gaMeasurementId: data?.ga_measurement_id ?? undefined,
      gtmContainerId: data?.gtm_container_id ?? undefined,
    };
  } catch {
    return { googleSiteVerification: undefined, gaMeasurementId: undefined, gtmContainerId: undefined };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const { googleSiteVerification } = await getSiteVerificationSettings();

  return {
    title: {
      default: `${site.fullName} — ${site.tagline}`,
      template: `%s · ${site.fullName}`,
    },
    description: site.description,
    applicationName: site.fullName,
    keywords: [
      "IT Park Feni",
      "computer shop Feni",
      "laptop Feni",
      "gaming PC Bangladesh",
      "PC builder Bangladesh",
      "components Feni",
      "printer Feni",
      "networking Feni",
    ],
    authors: [{ name: site.fullName }],
    openGraph: {
      title: `${site.fullName} — ${site.tagline}`,
      description: site.description,
      siteName: site.fullName,
      locale: "en_BD",
      type: "website",
    },
    robots: { index: true, follow: true },
    ...(googleSiteVerification ? { verification: { google: googleSiteVerification } } : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#2a49dd",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { gaMeasurementId, gtmContainerId } = await getSiteVerificationSettings();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${display.variable} ${bengali.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {gtmContainerId && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmContainerId}');`}
          </Script>
        )}
        {gaMeasurementId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');`}
            </Script>
          </>
        )}
        {gtmContainerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmContainerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <TopBar />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
