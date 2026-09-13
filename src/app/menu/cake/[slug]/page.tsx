import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CakeDetailClient from "@/components/customer/CakeDetailClient";
import {
  getCachedCake,
  getCachedRelatedCakes,
  getCachedWebsiteSettings,
  getCachedWhatsAppSetting,
} from "@/lib/cache";

export const revalidate = 60; // ISR: revalidate every 60s, memory cache handles freshness

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const cake = await getCachedCake(slug);

  if (!cake) {
    return {
      title: "Cake Not Found | Raman Sweet & Luxury Pâtisserie",
      description: "Explore our handcrafted eggless luxury cakes.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sweetdelights.com";
  const canonicalUrl = `${appUrl.replace(/\/$/, "")}/menu/cake/${cake.slug}`;
  const startingPrice = cake.prices?.[0]?.price ? ` from ₹${cake.prices[0].price}` : "";
  const title = `${cake.name}${startingPrice} | 100% Eggless Luxury Cake`;
  const description =
    cake.description ||
    "Handcrafted artisanal 100% eggless luxury confections. Order & enquire directly on WhatsApp.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: cake.coverImage,
          width: 800,
          height: 800,
          alt: cake.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cake.coverImage],
    },
  };
}

export default async function CakeDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [cake, settings, whatsappSetting] = await Promise.all([
    getCachedCake(slug),
    getCachedWebsiteSettings(),
    getCachedWhatsAppSetting(),
  ]);

  if (!cake) {
    notFound();
  }

  // Targeted related cakes query (same category, deterministic top 3, minimal fields)
  const relatedCakes = await getCachedRelatedCakes(cake.categoryId, cake.id);

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://sweetdelights.com").replace(/\/$/, "");
  const canonicalUrl = `${appUrl}/menu/cake/${cake!.slug}`;

  // Schema.org Product structured data — only real stored data, no fabricated reviews
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: cake!.name,
    description: cake!.description,
    image: cake!.coverImage,
    brand: {
      "@type": "Brand",
      name: settings?.restaurantName || "Raman Sweet Bakery",
    },
    offers: (cake!.prices || []).map((p: any) => ({
      "@type": "Offer",
      price: p.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026"),
        }}
      />
      <CakeDetailClient
        cake={cake}
        relatedCakes={relatedCakes}
        settings={settings || undefined}
        whatsappSetting={whatsappSetting || undefined}
      />
    </>
  );
}
