import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import CakeForm from "@/components/admin/CakeForm";

export const dynamic = "force-dynamic";

export default async function EditCakePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [cake, categories] = await Promise.all([
    prisma.cake.findUnique({
      where: { id },
      include: {
        prices: {
          orderBy: { price: "asc" },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  if (!cake) {
    notFound();
  }

  return <CakeForm categories={categories} initialData={cake} isEditing={true} />;
}
