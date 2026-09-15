import prisma from "@/lib/db";
import QrGeneratorClient from "@/components/admin/QrGeneratorClient";

export const dynamic = "force-dynamic";

export default async function AdminQrPage() {
  try {
    const [settings, whatsappSetting, categories, cakes, mediaImages] = await Promise.all([
      prisma.websiteSetting.findUnique({ where: { id: "default" } }),
      prisma.whatsAppSetting.findUnique({ where: { id: "default" } }),
      prisma.category.findMany({
        where: { active: true },
        select: { id: true, name: true, slug: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.cake.findMany({
        where: { available: true },
        select: { id: true, name: true, slug: true, coverImage: true },
        orderBy: { name: "asc" },
      }),
      prisma.imageMedia.findMany({
        select: { id: true, filename: true, url: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return (
      <QrGeneratorClient
        settings={settings || undefined}
        whatsappSetting={whatsappSetting || undefined}
        categories={categories || []}
        cakes={cakes || []}
        mediaImages={mediaImages || []}
      />
    );
  } catch (error) {
    console.error("AdminQrPage data load warning (using defaults):", error);
    return (
      <QrGeneratorClient
        settings={undefined}
        whatsappSetting={undefined}
        categories={[]}
        cakes={[]}
        mediaImages={[]}
      />
    );
  }
}
