import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { invalidateAppCache } from "@/lib/cache";
import { getClientIp } from "@/lib/rateLimit";
import { checkGenericRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import {
  safeValidate,
  validationErrorResponse,
  CategoryParamSchema,
  UpdateCategorySchema,
} from "@/lib/validations";

// PUT /api/categories/[id] - Update category (Admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:categories:put:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 30, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const paramRes = safeValidate(CategoryParamSchema, params);
    if (!paramRes.success) {
      return validationErrorResponse(paramRes.error);
    }
    const { id } = paramRes.data;

    const rawBody = await req.json().catch(() => ({}));
    const bodyRes = safeValidate(UpdateCategorySchema, rawBody);
    if (!bodyRes.success) {
      return validationErrorResponse(bodyRes.error);
    }

    const { name, slug, description, image, icon, displayOrder, active } = bodyRes.data;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (icon !== undefined) updateData.icon = icon;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (active !== undefined) updateData.active = Boolean(active);

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    invalidateAppCache();

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:categories:delete:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 20, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const paramRes = safeValidate(CategoryParamSchema, params);
    if (!paramRes.success) {
      return validationErrorResponse(paramRes.error);
    }
    const { id } = paramRes.data;

    // Check if category has cakes attached to prevent accidental cascade deletion
    const attachedCakesCount = await prisma.cake.count({
      where: { categoryId: id },
    });

    if (attachedCakesCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: ${attachedCakesCount} cake(s) are assigned to it. Please reassign or delete these cakes first, or toggle category status to inactive.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    invalidateAppCache();

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
