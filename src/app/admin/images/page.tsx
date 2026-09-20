import prisma from "@/lib/db";
import ImageLibraryClient from "@/components/admin/ImageLibraryClient";
import { getImageUsageMap } from "@/lib/upload";

export const dynamic = "force-dynamic";

export default async function AdminImagesPage() {
  const [images, usageMap] = await Promise.all([
    prisma.imageMedia.findMany({
      orderBy: { createdAt: "desc" },
    }),
    getImageUsageMap(),
  ]);

  const enrichedImages = images.map((img) => {
    const usages = usageMap.get(img.url) || [];
    return {
      ...img,
      isUsed: usages.length > 0,
      usedIn: usages,
    };
  });

  return <ImageLibraryClient initialImages={enrichedImages} />;
}

