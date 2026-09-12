import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { invalidateAppCache } from "@/lib/cache";

// GET /api/cakes/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const session = getSessionAdminFromRequest(req);
    const isAdmin = Boolean(session);

    const whereClause: any = {
      OR: [{ id: id }, { slug: id }],
    };

    // Unauthenticated requests are restricted strictly to available cakes of productType CAKE
    if (!isAdmin) {
      whereClause.available = true;
      whereClause.productType = "CAKE";
    }

    const cake = await prisma.cake.findFirst({
      where: whereClause,
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
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
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
      productType,
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

    const cake = await prisma.$transaction(async (tx) => {
      if (prices && Array.isArray(prices)) {
        await tx.cakePrice.deleteMany({
          where: { cakeId: id },
        });
      }

      if (occasionIds !== undefined && Array.isArray(occasionIds)) {
        await tx.cakeOccasion.deleteMany({
          where: { cakeId: id },
        });
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (productType !== undefined) updateData.productType = productType;
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
          create: prices.map((p: any, idx: number) => {
            let tierGallery: string[] = [];
            if (Array.isArray(p.images)) {
              tierGallery = p.images;
            } else if (typeof p.images === "string" && p.images.trim().length > 0) {
              try {
                const parsed = JSON.parse(p.images);
                if (Array.isArray(parsed)) tierGallery = parsed;
              } catch {
                tierGallery = [];
              }
            }

            // Validate: strings only, non-empty, max 5
            const cleanedTierImages = tierGallery
              .filter((img) => typeof img === "string" && img.trim().length > 0)
              .slice(0, 5);

            return {
              weight: p.weight || "1 kg",
              price: Number(p.price) || 0,
              originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
              isDefault: p.isDefault ?? idx === 0,
              image: p.image || (cleanedTierImages.length > 0 ? cleanedTierImages[0] : null),
              images: JSON.stringify(cleanedTierImages),
            };
          }),
        };
      }

      if (occasionIds !== undefined && Array.isArray(occasionIds) && occasionIds.length > 0) {
        updateData.occasions = {
          create: occasionIds.map((occId: string) => ({
            occasionId: occId,
          })),
        };
      }

      return await tx.cake.update({
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
    });

    invalidateAppCache();

    return NextResponse.json({ success: true, cake });
  } catch (error: any) {
    console.error("Update cake error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
