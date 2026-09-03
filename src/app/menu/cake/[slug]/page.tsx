import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CakeDetailClient from "@/components/customer/CakeDetailClient";
import {
  getCachedCake,
  getCachedAllCakes,
  getCachedWebsiteSettings,
  getCachedWhatsAppSetting,
} from "@/lib/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const [cake, allCakes, settings, whatsappSetting] = await Promise.all([
    getCachedCake(slug),
    getCachedAllCakes(),
    getCachedWebsiteSettings(),
    getCachedWhatsAppSetting(),
  ]);

  if (!cake) {
    notFound();
  }

  // Filter related cakes in same category from memory in 0.01ms
  const relatedCakes = allCakes
    .filter((c: any) => c.categoryId === cake.categoryId && c.id !== cake.id)
    .slice(0, 3);

  return (
    <CakeDetailClient
      cake={cake}
      relatedCakes={relatedCakes}
      settings={settings || undefined}
      whatsappSetting={whatsappSetting || undefined}
    />
  );
}
