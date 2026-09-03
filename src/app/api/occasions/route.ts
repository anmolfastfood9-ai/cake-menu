import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ensureOccurrencesForYear, clearOccasionCache } from "@/lib/festivals/occasionEngine";
import { invalidateAppCache } from "@/lib/cache";

// GET /api/occasions - List all occasions with current year status and cake counts
export async function GET() {
  try {
    const currentYear = new Date().getUTCFullYear();
    await ensureOccurrencesForYear(currentYear);

    const occasions = await prisma.occasion.findMany({
      include: {
        _count: {
          select: { cakes: true },
        },
        cakes: {
          select: { cakeId: true },
        },
        occurrences: {
          where: { year: currentYear },
        },
      },
      orderBy: { priority: "desc" },
    });

    const now = new Date();
    const formatted = occasions.map((occ) => {
      const occurrence = occ.occurrences[0] || null;
      let status: "ACTIVE" | "UPCOMING" | "PAST" | "INACTIVE" = "INACTIVE";

      if (!occ.active) {
        status = "INACTIVE";
      } else if (occurrence) {
        if (now >= occurrence.displayStart && now <= occurrence.displayEnd) {
          status = "ACTIVE";
        } else if (now < occurrence.displayStart) {
          status = "UPCOMING";
        } else {
          status = "PAST";
        }
      }

      return {
        ...occ,
        cakeCount: occ._count.cakes,
        cakeIds: occ.cakes.map((c) => c.cakeId),
        currentOccurrence: occurrence,
        status,
      };
    });

    return NextResponse.json({ success: true, occasions: formatted, currentYear });
  } catch (error: any) {
    console.error("Fetch occasions error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch occasions" },
      { status: 500 }
    );
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// POST /api/occasions - Create a custom occasion manually (Admin only)
export async function POST(req: NextRequest) {
  try {
    const { getSessionAdminFromRequest } = await import("@/lib/auth");
    const { clearOccasionCache } = await import("@/lib/festivals/occasionEngine");

    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug: customSlug,
      type = "CUSTOM",
      badgeText,
      description,
      accentColor = "#D4AF37",
      priority = 75,
      active = true,
      eventDate, // "YYYY-MM-DD" e.g. "2026-09-15"
      daysBefore = 5,
      daysAfter = 1,
      cakeIds = [],
    } = body;

    if (!name || !eventDate) {
      return NextResponse.json(
        { error: "Occasion Name and Celebration Date are required" },
        { status: 400 }
      );
    }

    const baseSlug = customSlug ? generateSlug(customSlug) : generateSlug(name);
    let slug = baseSlug;
    const existing = await prisma.occasion.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const calendarKey = `custom_${slug.replace(/-/g, "_")}`;
    const numDaysBefore = Math.max(0, Number(daysBefore) || 5);
    const numDaysAfter = Math.max(0, Number(daysAfter) || 1);

    const occasion = await prisma.occasion.create({
      data: {
        name,
        slug,
        type: type || "CUSTOM",
        calendarKey,
        badgeText: badgeText || `🎉 ${name.toUpperCase()} SPECIAL`,
        description: description || `Handcrafted artisanal eggless cakes curated for ${name}.`,
        accentColor: accentColor || "#D4AF37",
        priority: Number(priority) || 75,
        active: Boolean(active),
        daysBefore: numDaysBefore,
        daysAfter: numDaysAfter,
        cakes:
          Array.isArray(cakeIds) && cakeIds.length > 0
            ? {
                create: cakeIds.map((cakeId: string) => ({ cakeId })),
              }
            : undefined,
      },
      include: {
        _count: { select: { cakes: true } },
      },
    });

    // Create occurrence for the specified eventDate
    const parsedEventDate = new Date(`${eventDate}T00:00:00.000Z`);
    const year = parsedEventDate.getUTCFullYear();

    const displayStart = new Date(
      parsedEventDate.getTime() - numDaysBefore * 24 * 60 * 60 * 1000
    );
    // Ends at 23:59:59 IST (18:29:59 UTC) on the night of (eventDate + daysAfter)
    const displayEnd = new Date(
      parsedEventDate.getTime() +
        numDaysAfter * 24 * 60 * 60 * 1000 +
        (18 * 60 + 29) * 60 * 1000 +
        59 * 1000
    );

    await prisma.festivalOccurrence.create({
      data: {
        occasionId: occasion.id,
        year,
        eventDate: parsedEventDate,
        displayStart,
        displayEnd,
        source: "MANUAL_OVERRIDE",
      },
    });

    clearOccasionCache();
    invalidateAppCache();

    return NextResponse.json({ success: true, occasion });
  } catch (error: any) {
    console.error("Create custom occasion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create custom occasion" },
      { status: 500 }
    );
  }
}
