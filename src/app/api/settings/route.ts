import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { invalidateAppCache, getCachedWebsiteSettings } from "@/lib/cache";
import { revalidatePath } from "next/cache";
import { getClientIp } from "@/lib/rateLimit";
import { checkGenericRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import {
  safeValidate,
  validationErrorResponse,
  UpdateSettingsSchema,
} from "@/lib/validations";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

// GET /api/settings - Fetch current website settings
export async function GET(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:settings:get:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 60, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const settings = await getCachedWebsiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Fetch settings error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// Common update logic for PUT / POST / PATCH
async function handleUpdateSettings(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in as admin." }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:settings:put:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 20, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const rawBody = await req.json().catch(() => ({}));
    const bodyRes = safeValidate(UpdateSettingsSchema, rawBody);
    if (!bodyRes.success) {
      return validationErrorResponse(bodyRes.error);
    }
    const body = bodyRes.data;

    // Explicitly whitelist permitted writable fields
    const allowedFields = [
      "restaurantName",
      "tagline",
      "logo",
      "heroTitle",
      "heroSubtitle",
      "heroImage",
      "about",
      "phone",
      "whatsapp",
      "address",
      "openingHours",
      "instagram",
      "facebook",
      "footerText",
    ] as const;

    if (body.id && body.id !== "default") {
      return NextResponse.json({ error: "Cannot modify protected ID field" }, { status: 400 });
    }

    const sanitizedData: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in body && (body as any)[key] !== undefined) {
        sanitizedData[key] = (body as any)[key];
      }
    }

    if (sanitizedData.whatsapp) {
      sanitizedData.whatsapp = normalizeWhatsAppNumber(sanitizedData.whatsapp);
    }
    if (sanitizedData.phone !== undefined && typeof sanitizedData.phone === "string") {
      sanitizedData.phone = sanitizedData.phone.trim();
    }

    // 1. Primary write to WebsiteSetting table
    const settings = await prisma.websiteSetting.upsert({
      where: { id: "default" },
      update: sanitizedData,
      create: {
        id: "default",
        ...sanitizedData,
      },
    });

    // 2. Dual-sync phone & whatsapp into WhatsAppSetting table to ensure complete system-wide sync
    if (sanitizedData.whatsapp !== undefined || sanitizedData.phone !== undefined) {
      const waUpdate: Record<string, any> = {};
      if (sanitizedData.whatsapp !== undefined) {
        waUpdate.whatsappNumber = sanitizedData.whatsapp ? normalizeWhatsAppNumber(sanitizedData.whatsapp) : "";
      }
      if (sanitizedData.phone !== undefined) {
        waUpdate.callNumber = sanitizedData.phone || "";
      }

      await prisma.whatsAppSetting.upsert({
        where: { id: "default" },
        update: waUpdate,
        create: {
          id: "default",
          whatsappNumber: waUpdate.whatsappNumber || "919876543210",
          callNumber: waUpdate.callNumber || "+91 98765 43210",
        },
      });
    }

    // 3. Invalidate in-memory cache and trigger Next.js cache revalidation
    invalidateAppCache();
    try {
      revalidatePath("/", "layout");
      revalidatePath("/menu");
      revalidatePath("/menu/cakes");
      revalidatePath("/menu/order");
      revalidatePath("/admin/settings");
      revalidatePath("/admin/whatsapp");
    } catch (_) {}

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update website settings (Admin only)
export async function PUT(req: NextRequest) {
  return handleUpdateSettings(req);
}

// POST /api/settings - Fallback for proxies/hosts that restrict PUT
export async function POST(req: NextRequest) {
  return handleUpdateSettings(req);
}

// PATCH /api/settings - Partial update
export async function PATCH(req: NextRequest) {
  return handleUpdateSettings(req);
}
