import type { Metadata } from "next";
import "./globals.css";
import NavigationProgress from "@/components/NavigationProgress";
import { Suspense } from "react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sweetdelights.com";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Raman Sweet & Luxury Pâtisserie | Digital Cake Menu",
  description: "Explore our handcrafted collection of artisanal luxury cakes, Belgian chocolate ganaches, and fresh fruit gateaux. Order & enquire directly via WhatsApp.",
  keywords: ["cake menu", "luxury cakes", "artisanal bakery", "digital menu", "whatsapp cake order", "eggless cakes"],
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Raman Sweet & Luxury Pâtisserie | Digital Cake Menu",
    description: "Handcrafted Artisanal Cakes & Luxury Confections. Scan, browse and enquire directly on WhatsApp.",
    url: appUrl,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
