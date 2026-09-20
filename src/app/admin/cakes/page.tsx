import prisma from "@/lib/db";
import CakesManagerClient from "@/components/admin/CakesManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminCakesPage() {
  const [cakes, categories] = await Promise.all([
    prisma.cake.findMany({
      include: {
        category: true,
        prices: {
          orderBy: { price: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return <CakesManagerClient initialCakes={cakes} categories={categories} />;
}
