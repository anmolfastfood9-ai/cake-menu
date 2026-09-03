import { MetadataRoute } from "next";
import prisma from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://sweetdelights.com").replace(/\/$/, "");

  // Static Public Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${appUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${appUrl}/menu/cakes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${appUrl}/menu/order`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    // 1. Available Cakes
    const cakes = await prisma.cake.findMany({
      where: { available: true },
      select: { slug: true, updatedAt: true },
    });

    const cakeRoutes: MetadataRoute.Sitemap = cakes.map((cake) => ({
      url: `${appUrl}/menu/cake/${cake.slug}`,
      lastModified: cake.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // 2. Active Categories
    const categories = await prisma.category.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${appUrl}/menu/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // 3. Active Occasions
    const occasions = await prisma.occasion.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });

    const occasionRoutes: MetadataRoute.Sitemap = occasions.map((occasion) => ({
      url: `${appUrl}/menu/occasion/${occasion.slug}`,
      lastModified: occasion.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...cakeRoutes, ...categoryRoutes, ...occasionRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
