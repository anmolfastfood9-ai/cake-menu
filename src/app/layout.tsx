import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Inter,
  Playfair_Display,
  Great_Vibes,
  Caveat,
  Montserrat,
} from "next/font/google";
import "./globals.css";
import NavigationProgress from "@/components/NavigationProgress";
import { Suspense } from "react";
import { getAppUrl } from "@/lib/appUrl";
import { getCachedWebsiteSettings } from "@/lib/cache";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  weight: ["400"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const appUrl = getAppUrl();

function resolveFaviconUrl(rawFavicon?: string | null): string {
  const trimmed = rawFavicon?.trim();
  if (!trimmed) {
    return "/images/logo_emblem.png";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedWebsiteSettings().catch(() => null);
  const faviconUrl = resolveFaviconUrl(settings?.favicon);

  return {
    metadataBase: new URL(appUrl),
    title: "Raman Sweet Bakery | Premium Eggless Cakes",
    description:
      "Explore our handcrafted collection of artisanal luxury cakes, Belgian chocolate ganaches, and fresh fruit gateaux. Order & enquire directly via WhatsApp.",
    keywords: [
      "cake menu",
      "luxury cakes",
      "artisanal bakery",
      "digital menu",
      "whatsapp cake order",
      "eggless cakes",
      "premium eggless cakes",
      "raman sweet bakery",
    ],
    alternates: {
      canonical: "/menu",
    },
    openGraph: {
      title: "Raman Sweet Bakery | Premium Eggless Cakes",
      description:
        "Handcrafted Artisanal Cakes & Luxury Confections. Scan, browse and enquire directly on WhatsApp.",
      url: appUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Raman Sweet Bakery | Premium Eggless Cakes",
      description:
        "Handcrafted Artisanal Cakes & Luxury Confections. Scan, browse and enquire directly on WhatsApp.",
    },
    icons: {
      icon: [
        { url: faviconUrl },
      ],
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getCachedWebsiteSettings().catch(() => null);
  const faviconUrl = resolveFaviconUrl(settings?.favicon);

  return (
    <html
      lang="en"
      className={`dark scroll-smooth ${plusJakartaSans.variable} ${inter.variable} ${playfairDisplay.variable} ${greatVibes.variable} ${caveat.variable} ${montserrat.variable}`}
    >
      <head>
        <link rel="icon" href={faviconUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
      </head>
      <body className="min-h-screen bg-luxury-950 text-cream-100 antialiased selection:bg-gold-500 selection:text-luxury-950 font-sans">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
