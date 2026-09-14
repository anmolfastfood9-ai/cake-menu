import type { Metadata } from "next";
import "./globals.css";
import NavigationProgress from "@/components/NavigationProgress";
import { Suspense } from "react";
import { getAppUrl } from "@/lib/appUrl";
import { getCachedWebsiteSettings } from "@/lib/cache";

const appUrl = getAppUrl();

function resolveFaviconUrl(rawFavicon?: string | null): string {
  const trimmed = rawFavicon?.trim();
  if (!trimmed) {
    return `${appUrl}/images/logo_emblem.png`;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${appUrl}${normalizedPath}`;
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
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href={faviconUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-luxury-950 text-cream-100 antialiased selection:bg-gold-500 selection:text-luxury-950">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
