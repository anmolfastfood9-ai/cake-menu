import { notFound } from "next/navigation";
import type { Metadata } from "next";
import OccasionClient from "@/components/customer/OccasionClient";
import {
  getCachedOccasion,
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
  const occasion = await getCachedOccasion(slug);

  if (!occasion) {
    return {
      title: "Festive Occasion | Raman Sweet Bakery",
      description: "Explore our handcrafted eggless festive cake collections.",
    };
  }

  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "https://sweetdelights.com"
  ).replace(/\/$/, "");
  const canonicalUrl = `${appUrl}/menu/occasion/${occasion.slug}`;
  const cleanName = occasion.name.replace(/\s+special$/i, "").trim();
  const title = `${cleanName} Special | Raman Sweet Bakery`;
  const description =
    occasion.description ||
    `Celebrate ${cleanName} with artisanal 100% eggless luxury cakes. Browse collection & enquire directly on WhatsApp.`;

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function OccasionPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [occasion, settings, whatsappSetting] = await Promise.all([
    getCachedOccasion(slug),
    getCachedWebsiteSettings(),
    getCachedWhatsAppSetting(),
  ]);

  if (!occasion || !occasion.active) {
    notFound();
  }

  // Extract cakes belonging exclusively to this occasion (cakes only)
  const cakes = occasion.cakes
    .map((co: any) => co.cake)
    .filter(
      (cake: any) =>
        cake &&
        cake.available &&
        (!cake.productType || cake.productType.toUpperCase() === "CAKE")
    );

  // Find the active or upcoming occurrence
  const occurrences = (occasion as any).occurrences || [];
  const currentYear = new Date().getFullYear();
  const currentYearOccurrence = occurrences.find(
    (o: any) => o.year === currentYear
  );
  const activeOccurrence = currentYearOccurrence || occurrences[0] || null;

  // Clean serialization for Client Component
  const serializedOccasion = {
    id: occasion.id,
    name: occasion.name,
    slug: occasion.slug,
    description: occasion.description,
    badgeText: occasion.badgeText,
    bannerImage: occasion.bannerImage,
    accentColor: occasion.accentColor,
    type: occasion.type,
  };

  const serializedOccurrence = activeOccurrence
    ? {
        id: activeOccurrence.id,
        year: activeOccurrence.year,
        eventDate: activeOccurrence.eventDate
          ? new Date(activeOccurrence.eventDate).toISOString()
          : "",
        displayStart: activeOccurrence.displayStart
          ? new Date(activeOccurrence.displayStart).toISOString()
          : "",
        displayEnd: activeOccurrence.displayEnd
          ? new Date(activeOccurrence.displayEnd).toISOString()
          : "",
      }
    : null;

  // Serialize festival-specific categories if available
  const rawCategories = (occasion as any).categories || [];
  const serializedCategories = rawCategories.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    displayOrder: cat.displayOrder,
    active: cat.active,
    cakes: (cat.cakes || [])
      .map((occCake: any) => occCake.cake)
      .filter((cake: any) => cake && cake.available),
  }));

  return (
    <OccasionClient
      occasion={serializedOccasion}
      cakes={cakes}
      occasionCategories={serializedCategories}
      settings={settings}
      whatsappSetting={whatsappSetting}
      occurrence={serializedOccurrence}
    />
  );
}
