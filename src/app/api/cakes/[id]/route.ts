import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { invalidateAppCache } from "@/lib/cache";

// GET /api/cakes/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const cake = await prisma.cake.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        category: true,
        prices: {
          orderBy: { price: "asc" },
        },
        occasions: {
          include: {
            occasion: true,
          },
        },
      },
    });

    if (!cake) {
      return NextResponse.json({ error: "Cake not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, cake });
  } catch (error: any) {
    console.error("Fetch single cake error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch cake" }, { status: 500 });
  }
}

// PUT /api/cakes/[id] (Admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const {
      name,
      slug,
      categoryId,
      description,
      coverImage,
      images,
      ingredients,
      preparationNotes,
      featured,
      bestseller,
      isNew,
      available,
      rating,
      customizationInfo,
      prices,
      occasionIds,
    } = body;

    if (prices && Array.isArray(prices)) {
      await prisma.cakePrice.deleteMany({
        where: { cakeId: id },
      });
    }

    if (occasionIds !== undefined && Array.isArray(occasionIds)) {
      await prisma.cakeOccasion.deleteMany({
        where: { cakeId: id },
      });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (description !== undefined) updateData.description = description;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (images !== undefined) {
      updateData.images = Array.isArray(images) ? JSON.stringify(images) : typeof images === "string" ? images : "[]";
    }
    if (ingredients !== undefined) updateData.ingredients = ingredients;
    if (preparationNotes !== undefined) updateData.preparationNotes = preparationNotes;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (bestseller !== undefined) updateData.bestseller = Boolean(bestseller);
    if (isNew !== undefined) updateData.isNew = Boolean(isNew);
    if (available !== undefined) updateData.available = Boolean(available);
    if (rating !== undefined) updateData.rating = Number(rating);
    if (customizationInfo !== undefined) updateData.customizationInfo = customizationInfo;

    if (prices && Array.isArray(prices)) {
      updateData.prices = {
        create: prices.map((p: any, idx: number) => ({
          weight: p.weight || "1 kg",
          price: Number(p.price) || 0,
          originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
          isDefault: p.isDefault ?? idx === 0,
          image: p.image || null,
        })),
      };
    }

    if (occasionIds !== undefined && Array.isArray(occasionIds) && occasionIds.length > 0) {
      updateData.occasions = {
        create: occasionIds.map((occId: string) => ({
          occasionId: occId,
        })),
      };
    }

    const cake = await prisma.cake.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        prices: true,
        occasions: {
          include: { occasion: true },
        },
      },
    });

    invalidateAppCache();

    return NextResponse.json({ success: true, cake });
  } catch (error: any) {
    console.error("Update cake error:", error);
    return NextResponse.json({ error: error.message || "Failed to update cake" }, { status: 500 });
  }
}

// DELETE /api/cakes/[id] (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await prisma.cakePrice.deleteMany({ where: { cakeId: id } });
    await prisma.cake.delete({ where: { id } });

    invalidateAppCache();

    return NextResponse.json({ success: true, message: "Cake deleted successfully" });
  } catch (error: any) {
    console.error("Delete cake error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete cake" }, { status: 500 });
  }
}
