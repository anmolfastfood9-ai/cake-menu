import prisma from "@/lib/db";
import CategoryManagerClient from "@/components/admin/CategoryManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { cakes: true },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  return <CategoryManagerClient initialCategories={categories} />;
}
