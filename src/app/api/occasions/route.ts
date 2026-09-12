import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ensureOccurrencesForYear, clearOccasionCache } from "@/lib/festivals/occasionEngine";
import { invalidateAppCache } from "@/lib/cache";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { getClientIp } from "@/lib/rateLimit";
import { checkGenericRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import {
  safeValidate,
  validationErrorResponse,
  CreateOccasionSchema,
} from "@/lib/validations";

// GET /api/occasions - List all occasions with current year status and cake counts (Read-only)
export async function GET(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:occasions:get:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 60, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const currentYear = new Date().getUTCFullYear();

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
      { error: "An internal server error occurred" },
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
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:occasions:post:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 20, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const rawBody = await req.json().catch(() => ({}));
    const bodyRes = safeValidate(CreateOccasionSchema, rawBody);
    if (!bodyRes.success) {
      return validationErrorResponse(bodyRes.error);
    }

    const {
      name,
      slug: customSlug,
      type = "CUSTOM",
      badgeText,
      description,
      accentColor = "#D4AF37",
      priority = 75,
      active = true,
      eventDate,
      daysBefore = 5,
      daysAfter = 1,
      cakeIds = [],
      bannerImage,
    } = bodyRes.data;

    const baseSlug = customSlug ? generateSlug(customSlug) : generateSlug(name);
    let slug = baseSlug;
    const existing = await prisma.occasion.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const calendarKey = `custom_${slug.replace(/-/g, "_")}`;
    const numDaysBefore = daysBefore;
    const numDaysAfter = daysAfter;

    const occasion = await prisma.occasion.create({
      data: {
        name,
        slug,
        type: type || "CUSTOM",
        calendarKey,
        badgeText: badgeText || `🎉 ${name.toUpperCase()} SPECIAL`,
        description: description || `Handcrafted artisanal eggless cakes curated for ${name}.`,
        bannerImage: bannerImage || null,
        accentColor: accentColor || "#D4AF37",
        priority: priority ?? 75,
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
    try {
      revalidatePath("/menu");
    } catch (e) {}

    return NextResponse.json({ success: true, occasion }, { status: 201 });
  } catch (error: any) {
    console.error("Create custom occasion error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
