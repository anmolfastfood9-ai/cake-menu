import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { clearOccasionCache } from "@/lib/festivals/occasionEngine";
import { invalidateAppCache } from "@/lib/cache";
import { getClientIp } from "@/lib/rateLimit";
import { checkGenericRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import {
  safeValidate,
  validationErrorResponse,
  OccasionParamSchema,
  UpdateOccasionSchema,
} from "@/lib/validations";

// PUT /api/occasions/[id] - Update occasion content and status (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:occasions:put:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 20, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const paramRes = safeValidate(OccasionParamSchema, params);
    if (!paramRes.success) {
      return validationErrorResponse(paramRes.error);
    }
    const { id } = paramRes.data;

    const rawBody = await req.json().catch(() => ({}));
    const bodyRes = safeValidate(UpdateOccasionSchema, rawBody);
    if (!bodyRes.success) {
      return validationErrorResponse(bodyRes.error);
    }

    const {
      name,
      badgeText,
      description,
      accentColor,
      priority,
      active,
      daysBefore,
      daysAfter,
      eventDate,
      cakeIds,
      bannerImage,
    } = bodyRes.data;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (badgeText !== undefined) updateData.badgeText = badgeText;
    if (description !== undefined) updateData.description = description;
    if (accentColor !== undefined) updateData.accentColor = accentColor;
    if (priority !== undefined) updateData.priority = priority;
    if (active !== undefined) updateData.active = Boolean(active);
    if (daysBefore !== undefined) updateData.daysBefore = daysBefore;
    if (daysAfter !== undefined) updateData.daysAfter = daysAfter;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage || null;

    // Update tagged cakes if provided
    if (cakeIds !== undefined && Array.isArray(cakeIds)) {
      await prisma.cakeOccasion.deleteMany({
        where: { occasionId: id },
      });
      if (cakeIds.length > 0) {
        await prisma.cakeOccasion.createMany({
          data: cakeIds.map((cakeId: string) => ({
            cakeId,
            occasionId: id,
          })),
        });
      }
    }

    const occasion = await prisma.occasion.update({
      where: { id },
      data: updateData,
    });

    // If eventDate or daysBefore/daysAfter were changed, update current year occurrence
    const currentYear = new Date().getUTCFullYear();
    const existingOcc = await prisma.festivalOccurrence.findUnique({
      where: {
        occasionId_year: {
          occasionId: id,
          year: currentYear,
        },
      },
    });

    if (existingOcc || eventDate) {
      const targetEventDate = eventDate
        ? new Date(`${eventDate}T00:00:00.000Z`)
        : existingOcc!.eventDate;

      const numDaysBefore = daysBefore !== undefined ? daysBefore : occasion.daysBefore;
      const numDaysAfter = daysAfter !== undefined ? daysAfter : occasion.daysAfter;

      const displayStart = new Date(
        targetEventDate.getTime() - numDaysBefore * 24 * 60 * 60 * 1000
      );
      // Ends at 23:59:59 IST (18:29:59 UTC) on the night of (eventDate + daysAfter)
      const displayEnd = new Date(
        targetEventDate.getTime() +
          numDaysAfter * 24 * 60 * 60 * 1000 +
          (18 * 60 + 29) * 60 * 1000 +
          59 * 1000
      );

      await prisma.festivalOccurrence.upsert({
        where: {
          occasionId_year: {
            occasionId: id,
            year: currentYear,
          },
        },
        update: {
          eventDate: targetEventDate,
          displayStart,
          displayEnd,
          source: "MANUAL_OVERRIDE",
        },
        create: {
          occasionId: id,
          year: currentYear,
          eventDate: targetEventDate,
          displayStart,
          displayEnd,
          source: "MANUAL_OVERRIDE",
        },
      });
    }

    clearOccasionCache();
    invalidateAppCache();

    return NextResponse.json({ success: true, occasion });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Occasion not found" }, { status: 404 });
    }
    console.error("Update occasion error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// DELETE /api/occasions/[id] - Delete an occasion (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:occasions:delete:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 20, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const paramRes = safeValidate(OccasionParamSchema, params);
    if (!paramRes.success) {
      return validationErrorResponse(paramRes.error);
    }
    const { id } = paramRes.data;

    await prisma.occasion.delete({
      where: { id },
    });

    clearOccasionCache();
    invalidateAppCache();
    return NextResponse.json({ success: true, message: "Occasion deleted successfully" });
  } catch (error: any) {
    console.error("Delete occasion error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
