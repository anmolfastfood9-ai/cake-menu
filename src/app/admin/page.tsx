import prisma from "@/lib/db";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalCakes, totalCategories, totalImages, recentCakes, images, settings, whatsappSetting] =
    await Promise.all([
      prisma.cake.count(),
      prisma.category.count(),
      prisma.imageMedia.count(),
      prisma.cake.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          prices: {
            orderBy: { price: "asc" },
          },
        },
      }),
      prisma.imageMedia.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
      prisma.websiteSetting.findUnique({ where: { id: "default" } }),
      prisma.whatsAppSetting.findUnique({ where: { id: "default" } }),
    ]);

  return (
    <AdminDashboardClient
      totalCakes={totalCakes}
      totalCategories={totalCategories}
      totalImages={totalImages}
      recentCakes={recentCakes}
      sampleImages={images}
      settings={settings || undefined}
      whatsappSetting={whatsappSetting || undefined}
    />
  );
}
