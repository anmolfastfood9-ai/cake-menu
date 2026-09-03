import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { invalidateAppCache } from "@/lib/cache";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/cakes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const tag = searchParams.get("tag"); // "featured", "bestseller", "new"
    const availableOnly = searchParams.get("availableOnly") === "true";

    const whereClause: any = {};

    if (availableOnly) {
      whereClause.available = true;
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    } else if (categorySlug && categorySlug !== "all") {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { ingredients: { contains: search } },
      ];
    }

    if (tag === "featured") whereClause.featured = true;
    if (tag === "bestseller") whereClause.bestseller = true;
    if (tag === "new") whereClause.isNew = true;

    const cakes = await prisma.cake.findMany({
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
      orderBy: [{ featured: "desc" }, { bestseller: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, cakes });
  } catch (error: any) {
    console.error("Fetch cakes error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch cakes" }, { status: 500 });
  }
}

// POST /api/cakes (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug: customSlug,
      categoryId,
      description,
      coverImage,
      images,
      ingredients,
      preparationNotes,
      featured = false,
      bestseller = false,
      isNew = false,
      available = true,
      rating = 4.9,
      customizationInfo,
      prices = [],
      occasionIds = [],
    } = body;

    if (!name || !categoryId || !description || !coverImage) {
      return NextResponse.json(
        { error: "Name, category, description, and cover image are required" },
        { status: 400 }
      );
    }

    let slug = customSlug ? generateSlug(customSlug) : generateSlug(name);
    const existing = await prisma.cake.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const cake = await prisma.cake.create({
      data: {
        name,
        slug,
        categoryId,
        description,
        coverImage,
        images: Array.isArray(images) ? JSON.stringify(images) : typeof images === "string" ? images : "[]",
        ingredients,
        preparationNotes,
        featured: Boolean(featured),
        bestseller: Boolean(bestseller),
        isNew: Boolean(isNew),
        available: Boolean(available),
        rating: Number(rating) || 4.9,
        customizationInfo,
        prices: {
          create: (prices.length > 0 ? prices : [{ weight: "1 kg", price: 999, isDefault: true }]).map(
            (p: any, idx: number) => ({
              weight: p.weight || "1 kg",
              price: Number(p.price) || 0,
              originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
              isDefault: p.isDefault ?? idx === 0,
              image: p.image || null,
            })
          ),
        },
        occasions: occasionIds && occasionIds.length > 0 ? {
          create: occasionIds.map((occId: string) => ({
            occasionId: occId,
          })),
        } : undefined,
      },
      include: {
        category: true,
        prices: true,
        occasions: {
          include: { occasion: true },
        },
      },
    });

    invalidateAppCache();

    return NextResponse.json({ success: true, cake }, { status: 201 });
  } catch (error: any) {
    console.error("Create cake error:", error);
    return NextResponse.json({ error: error.message || "Failed to create cake" }, { status: 500 });
  }
}
