import prisma from "@/lib/db";
import ImageLibraryClient from "@/components/admin/ImageLibraryClient";

export const dynamic = "force-dynamic";

export default async function AdminImagesPage() {
  const images = await prisma.imageMedia.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ImageLibraryClient initialImages={images} />;
}
