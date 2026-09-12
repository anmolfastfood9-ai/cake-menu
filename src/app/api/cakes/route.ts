import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { invalidateAppCache, getCachedApiQuery } from "@/lib/cache";

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
    const productType = searchParams.get("productType");
    const cakesOnly = searchParams.get("cakesOnly") === "true";
    const availableOnly = searchParams.get("availableOnly") === "true";

    const whereClause: any = {};

    if (availableOnly) {
      whereClause.available = true;
    }

    if (cakesOnly) {
      whereClause.productType = "CAKE";
    } else if (productType && productType !== "ALL") {
      whereClause.productType = productType;
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
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { ingredients: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tag === "featured") whereClause.featured = true;
    if (tag === "bestseller") whereClause.bestseller = true;
    if (tag === "new") whereClause.isNew = true;

    // Build cache key strictly from recognized parameters to prevent cache flooding/poisoning
    const recognizedKeyParts: string[] = [];
    if (categorySlug) recognizedKeyParts.push(`cat:${categorySlug.toLowerCase().trim()}`);
    if (categoryId) recognizedKeyParts.push(`catId:${categoryId.trim()}`);
    if (search) recognizedKeyParts.push(`q:${search.toLowerCase().trim().slice(0, 50)}`);
    if (tag) recognizedKeyParts.push(`tag:${tag.toLowerCase().trim()}`);
    if (productType) recognizedKeyParts.push(`pt:${productType.trim()}`);
    if (cakesOnly) recognizedKeyParts.push("cakesOnly:1");
    if (availableOnly) recognizedKeyParts.push("availOnly:1");

    const cacheKey = `api_cakes_${recognizedKeyParts.sort().join("|") || "all"}`;
    const cakes = await getCachedApiQuery(cacheKey, async () => {
      return await prisma.cake.findMany({
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
    });

    return NextResponse.json({ success: true, cakes });
  } catch (error: any) {
    console.error("Fetch cakes error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
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
      productType = "CAKE",
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
        productType: productType || "CAKE",
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
            (p: any, idx: number) => {
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
            }
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
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
