import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { invalidateAppCache, getCachedApiQuery } from "@/lib/cache";
import { getClientIp, checkGenericRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import {
  CreateCakeSchema,
  GetCakesQuerySchema,
  safeValidate,
} from "@/lib/validations";

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
    // 1. Distributed Public Rate Limit: 60 requests / minute / IP
    const clientIp = getClientIp(req);
    const rateCheck = await checkGenericRateLimit(
      `cakes:get:${clientIp}`,
      60,
      60,
      "ratelimit:cakes:get"
    );
    if (!rateCheck.success) {
      return rateLimitResponse(rateCheck.retryAfter ?? 60);
    }

    const { searchParams } = new URL(req.url);
    const queryParamsRaw: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      queryParamsRaw[key] = val;
    });

    const queryValidation = safeValidate(GetCakesQuerySchema, queryParamsRaw);
    if (!queryValidation.success) {
      return queryValidation.response;
    }

    const {
      category: categorySlug,
      categoryId,
      search,
      tag,
      cakesOnly,
      availableOnly,
      page,
      limit,
    } = queryValidation.data;

    const whereClause: any = {};

    if (availableOnly === "true") {
      whereClause.available = true;
    }

    // Active productType model is CAKE ONLY
    whereClause.productType = "CAKE";

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

    // Build cache key strictly from recognized parameters
    const recognizedKeyParts: string[] = [];
    if (categorySlug) recognizedKeyParts.push(`cat:${categorySlug.toLowerCase().trim()}`);
    if (categoryId) recognizedKeyParts.push(`catId:${categoryId.trim()}`);
    if (search) recognizedKeyParts.push(`q:${search.toLowerCase().trim().slice(0, 50)}`);
    if (tag) recognizedKeyParts.push(`tag:${tag.toLowerCase().trim()}`);
    if (cakesOnly) recognizedKeyParts.push("cakesOnly:1");
    if (availableOnly) recognizedKeyParts.push("availOnly:1");
    if (page) recognizedKeyParts.push(`p:${page}`);
    if (limit) recognizedKeyParts.push(`l:${limit}`);

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
        ...(limit ? { take: limit, skip: ((page || 1) - 1) * limit } : {}),
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

    // Distributed Rate Limit: 30 mutations / minute / admin + IP
    const clientIp = getClientIp(req);
    const identifier = `cake:post:${session.userId}:${clientIp}`;
    const rateCheck = await checkGenericRateLimit(identifier, 30, 60, "ratelimit:cakes:post");
    if (!rateCheck.success) {
      return rateLimitResponse(rateCheck.retryAfter ?? 60);
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const validation = safeValidate(CreateCakeSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const {
      name,
      slug: customSlug,
      categoryId,
      description,
      coverImage,
      images = [],
      ingredients,
      preparationNotes,
      featured = false,
      bestseller = false,
      isNew = false,
      available = true,
      rating = 4.9,
      customizationInfo,
      prices,
      occasionIds = [],
    } = validation.data;

    let slug = customSlug ? generateSlug(customSlug) : generateSlug(name);
    const existing = await prisma.cake.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const cake = await prisma.cake.create({
      data: {
        name,
        productType: "CAKE",
        slug,
        categoryId,
        description,
        coverImage,
        images: JSON.stringify(images),
        ingredients,
        preparationNotes,
        featured: Boolean(featured),
        bestseller: Boolean(bestseller),
        isNew: Boolean(isNew),
        available: Boolean(available),
        rating: typeof rating === "number" ? rating : 4.9,
        customizationInfo,
        prices: {
          create: prices.map((p, idx) => ({
            weight: p.weight,
            price: p.price,
            originalPrice: p.originalPrice ?? null,
            isDefault: p.isDefault ?? idx === 0,
            image: p.image || (p.images && p.images.length > 0 ? p.images[0] : null),
            images: JSON.stringify(p.images || []),
          })),
        },
        occasions:
          occasionIds && occasionIds.length > 0
            ? {
                create: occasionIds.map((occId: string) => ({
                  occasionId: occId,
                })),
              }
            : undefined,
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
