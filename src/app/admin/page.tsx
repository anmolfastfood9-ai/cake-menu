import prisma from "@/lib/db";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalCakes,
    availableCakes,
    featuredCakes,
    bestsellerCakes,
    totalCategories,
    categoriesWithCount,
    activeOccasions,
    totalImages,
    recentCakes,
    images,
    allPrices,
    settings,
    whatsappSetting,
  ] = await Promise.all([
    prisma.cake.count(),
    prisma.cake.count({ where: { available: true } }),
    prisma.cake.count({ where: { featured: true } }),
    prisma.cake.count({ where: { bestseller: true } }),
    prisma.category.count(),
    prisma.category.findMany({
      take: 8,
      include: {
        _count: {
          select: { cakes: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.occasion.findMany({
      where: { active: true },
      take: 4,
      orderBy: { priority: "desc" },
    }),
    prisma.imageMedia.count(),
    prisma.cake.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        prices: {
          orderBy: { price: "asc" },
        },
      },
    }),
    prisma.imageMedia.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.cakePrice.findMany({
      select: { price: true },
    }),
    prisma.websiteSetting.findUnique({ where: { id: "default" } }),
    prisma.whatsAppSetting.findUnique({ where: { id: "default" } }),
  ]);

  // Compute pricing intelligence
  const priceValues = allPrices.map((p) => p.price).filter((p) => p > 0);
  const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : 499;
  const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : 2499;
  const avgPrice =
    priceValues.length > 0
      ? Math.round(priceValues.reduce((a, b) => a + b, 0) / priceValues.length)
      : 899;

  return (
    <AdminDashboardClient
      totalCakes={totalCakes}
      availableCakes={availableCakes}
      featuredCakes={featuredCakes}
      bestsellerCakes={bestsellerCakes}
      totalCategories={totalCategories}
      categoriesWithCount={categoriesWithCount}
      activeOccasions={activeOccasions}
      totalImages={totalImages}
      recentCakes={recentCakes}
      sampleImages={images}
      pricingStats={{ minPrice, maxPrice, avgPrice }}
      settings={settings || undefined}
      whatsappSetting={whatsappSetting || undefined}
    />
  );
}
