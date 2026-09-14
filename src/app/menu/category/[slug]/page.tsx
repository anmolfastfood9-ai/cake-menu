import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MenuClient from "@/components/customer/MenuClient";
import prisma from "@/lib/db";
import {
  getCachedCategories,
  getCachedWebsiteSettings,
  getCachedWhatsAppSetting,
} from "@/lib/cache";
import { getActiveOccasion } from "@/lib/festivals/occasionEngine";
import { getAppUrl } from "@/lib/appUrl";

export const revalidate = 60; // ISR: revalidate every 60s

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, slug: true, active: true },
  });

  if (!category || !category.active) {
    return {
      title: "Category Not Found | Raman Sweet Bakery",
      description: "Explore our handcrafted eggless cake collections.",
      robots: { index: false, follow: false },
    };
  }

  const appUrl = getAppUrl();
  const canonicalUrl = `${appUrl}/menu/category/${category.slug}`;
  const title = `${category.name} | Raman Sweet Bakery`;
  const description = `Explore our handcrafted 100% eggless ${category.name} collection at Raman Sweet Bakery. Freshly baked for milestone parties, celebrations, and grand events.`;

  return {
    metadataBase: new URL(appUrl),
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
      siteName: "Raman Sweet Bakery",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryMenuPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, active: true },
  });

  if (!category || !category.active) {
    notFound();
  }

  // Fetch only cakes for this category with available: true, productType: "CAKE"
  const [categoryCakes, allCategories, settings, whatsappSetting, activeOccasion] =
    await Promise.all([
      prisma.cake.findMany({
        where: {
          categoryId: category.id,
          available: true,
          productType: "CAKE",
          NOT: [
            { slug: { contains: "test", mode: "insensitive" } },
            { name: { contains: "test", mode: "insensitive" } },
          ],
        },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          prices: { orderBy: { price: "asc" } },
        },
        orderBy: { createdAt: "asc" },
      }),
      getCachedCategories(),
      getCachedWebsiteSettings(),
      getCachedWhatsAppSetting(),
      getActiveOccasion(),
    ]);

  return (
    <MenuClient
      initialCategories={allCategories as any}
      initialCakes={categoryCakes as any}
      settings={settings as any}
      whatsappSetting={whatsappSetting as any}
      activeOccasion={activeOccasion as any}
      initialSelectedCategory={category.slug}
    />
  );
}
