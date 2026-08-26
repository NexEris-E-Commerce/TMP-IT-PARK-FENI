import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

export const metadata: Metadata = {
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
};

export const viewport: Viewport = {
  themeColor: "#2a49dd",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${display.variable} ${bengali.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <TopBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
