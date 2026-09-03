import prisma from "@/lib/db";
import CakeForm from "@/components/admin/CakeForm";

export const dynamic = "force-dynamic";

export default async function NewCakePage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return <CakeForm categories={categories} isEditing={false} />;
}
