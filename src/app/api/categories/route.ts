import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { invalidateAppCache } from "@/lib/cache";
import { getClientIp } from "@/lib/rateLimit";
import { checkGenericRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import {
  safeValidate,
  validationErrorResponse,
  CreateCategorySchema,
  GetCategoriesQuerySchema,
} from "@/lib/validations";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/categories - List all categories
export async function GET(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:categories:get:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 60, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const { searchParams } = new URL(req.url);
    const rawQuery = {
      activeOnly: searchParams.get("activeOnly") ?? undefined,
    };
    const queryRes = safeValidate(GetCategoriesQuerySchema, rawQuery);
    if (!queryRes.success) {
      return validationErrorResponse(queryRes.error);
    }

    const activeOnly = queryRes.data.activeOnly === "true";
    const whereClause = activeOnly ? { active: true } : {};

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { cakes: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("Fetch categories error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create category (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:categories:post:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 30, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const rawBody = await req.json().catch(() => ({}));
    const bodyRes = safeValidate(CreateCategorySchema, rawBody);
    if (!bodyRes.success) {
      return validationErrorResponse(bodyRes.error);
    }

    const { name, slug: customSlug, description, image, icon, displayOrder = 0, active = true } = bodyRes.data;

    let slug = customSlug ? generateSlug(customSlug) : generateSlug(name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        icon: icon || null,
        displayOrder: displayOrder ?? 0,
        active: Boolean(active),
      },
    });

    invalidateAppCache();

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
