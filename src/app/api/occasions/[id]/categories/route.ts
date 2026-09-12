import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { clearOccasionCache } from "@/lib/festivals/occasionEngine";
import { getSessionAdminFromRequest } from "@/lib/auth";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "category";
}

// GET /api/occasions/[id]/categories
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const categories = await prisma.occasionCategory.findMany({
      where: { occasionId: id },
      orderBy: { displayOrder: "asc" },
      include: {
        cakes: {
          orderBy: { displayOrder: "asc" },
          include: {
            cake: {
              include: {
                category: true,
                prices: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("GET /api/occasions/[id]/categories error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// POST /api/occasions/[id]/categories (Create Category - Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionAdminFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, displayOrder } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const occasion = await prisma.occasion.findUnique({
      where: { id },
    });

    if (!occasion) {
      return NextResponse.json(
        { error: "Occasion not found" },
        { status: 404 }
      );
    }

    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (
      await prisma.occasionCategory.findUnique({
        where: {
          occasionId_slug: {
            occasionId: id,
            slug,
          },
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const maxOrderCategory = await prisma.occasionCategory.findFirst({
      where: { occasionId: id },
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });

    const nextOrder =
      typeof displayOrder === "number"
        ? displayOrder
        : (maxOrderCategory?.displayOrder ?? -1) + 1;

    const newCategory = await prisma.occasionCategory.create({
      data: {
        occasionId: id,
        name: name.trim(),
        slug,
        displayOrder: nextOrder,
      },
      include: {
        cakes: true,
      },
    });

    clearOccasionCache();

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/occasions/[id]/categories error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// PUT /api/occasions/[id]/categories (Update Category, Cake Assignments, or Reorder - Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionAdminFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id: occasionId } = params;
    const body = await request.json();

    // Case 1: Reorder or Bulk Update Multiple Categories
    if (Array.isArray(body.categories)) {
      await prisma.$transaction(
        body.categories.map((cat: any) =>
          prisma.occasionCategory.update({
            where: { id: cat.id },
            data: {
              ...(typeof cat.displayOrder === "number" && {
                displayOrder: cat.displayOrder,
              }),
              ...(typeof cat.active === "boolean" && { active: cat.active }),
              ...(typeof cat.name === "string" &&
                cat.name.trim() && { name: cat.name.trim() }),
            },
          })
        )
      );

      clearOccasionCache();
      return NextResponse.json({ success: true });
    }

    // Case 2: Update Single Category Details / Cake Assignments
    const { categoryId, name, displayOrder, active, cakeIds } = body;

    if (!categoryId) {
      return NextResponse.json(
        { error: "categoryId is required" },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.occasionCategory.findFirst({
      where: { id: categoryId, occasionId },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Occasion category not found for this occasion" },
        { status: 404 }
      );
    }

    // Validate Server-Side: Each cakeId MUST belong to this Occasion via CakeOccasion
    if (Array.isArray(cakeIds)) {
      if (cakeIds.length > 0) {
        const validOccasionCakes = await prisma.cakeOccasion.findMany({
          where: {
            occasionId,
            cakeId: { in: cakeIds },
          },
          select: { cakeId: true },
        });

        const validCakeIds = new Set(validOccasionCakes.map((c) => c.cakeId));
        const invalidCakes = cakeIds.filter((cid) => !validCakeIds.has(cid));

        if (invalidCakes.length > 0) {
          return NextResponse.json(
            {
              error: `The following cakes do not belong to this occasion: ${invalidCakes.join(
                ", "
              )}`,
            },
            { status: 400 }
          );
        }
      }
    }

    const updatedCategory = await prisma.$transaction(async (tx) => {
      // 1. Update basic info if provided
      const updated = await tx.occasionCategory.update({
        where: { id: categoryId },
        data: {
          ...(typeof name === "string" &&
            name.trim() && {
              name: name.trim(),
              slug: generateSlug(name.trim()),
            }),
          ...(typeof displayOrder === "number" && { displayOrder }),
          ...(typeof active === "boolean" && { active }),
        },
      });

      // 2. Update assigned cakes if cakeIds array is provided
      if (Array.isArray(cakeIds)) {
        await tx.occasionCategoryCake.deleteMany({
          where: { occasionCategoryId: categoryId },
        });

        if (cakeIds.length > 0) {
          await tx.occasionCategoryCake.createMany({
            data: cakeIds.map((cakeId: string, idx: number) => ({
              occasionCategoryId: categoryId,
              cakeId,
              displayOrder: idx,
            })),
          });
        }
      }

      return tx.occasionCategory.findUnique({
        where: { id: categoryId },
        include: {
          cakes: {
            orderBy: { displayOrder: "asc" },
            include: {
              cake: {
                include: {
                  category: true,
                  prices: true,
                },
              },
            },
          },
        },
      });
    });

    clearOccasionCache();

    return NextResponse.json({ category: updatedCategory });
  } catch (error: any) {
    console.error("PUT /api/occasions/[id]/categories error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// DELETE /api/occasions/[id]/categories (Delete Category - Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionAdminFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id: occasionId } = params;
    const { searchParams } = new URL(request.url);
    let categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      try {
        const body = await request.json();
        categoryId = body.categoryId;
      } catch (e) {
        // Body reading optional
      }
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "categoryId is required" },
        { status: 400 }
      );
    }

    const category = await prisma.occasionCategory.findFirst({
      where: { id: categoryId, occasionId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Occasion category not found" },
        { status: 404 }
      );
    }

    await prisma.occasionCategory.delete({
      where: { id: categoryId },
    });

    clearOccasionCache();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/occasions/[id]/categories error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
