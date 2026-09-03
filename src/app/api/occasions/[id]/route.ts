import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { clearOccasionCache } from "@/lib/festivals/occasionEngine";
import { invalidateAppCache } from "@/lib/cache";

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

    const { id } = params;
    const body = await req.json();
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
    } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (badgeText !== undefined) updateData.badgeText = badgeText;
    if (description !== undefined) updateData.description = description;
    if (accentColor !== undefined) updateData.accentColor = accentColor;
    if (priority !== undefined) updateData.priority = Number(priority);
    if (active !== undefined) updateData.active = Boolean(active);
    if (daysBefore !== undefined) updateData.daysBefore = Math.max(0, Number(daysBefore));
    if (daysAfter !== undefined) updateData.daysAfter = Math.max(0, Number(daysAfter));

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

      const numDaysBefore = daysBefore !== undefined ? Math.max(0, Number(daysBefore)) : occasion.daysBefore;
      const numDaysAfter = daysAfter !== undefined ? Math.max(0, Number(daysAfter)) : occasion.daysAfter;

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
    console.error("Update occasion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update occasion" },
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

    const { id } = params;
    await prisma.occasion.delete({
      where: { id },
    });

    clearOccasionCache();
    invalidateAppCache();
    return NextResponse.json({ success: true, message: "Occasion deleted successfully" });
  } catch (error: any) {
    console.error("Delete occasion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete occasion" },
      { status: 500 }
    );
  }
}

