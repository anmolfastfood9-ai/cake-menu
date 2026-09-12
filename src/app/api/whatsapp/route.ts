import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { invalidateAppCache } from "@/lib/cache";
import { revalidatePath } from "next/cache";
import { getClientIp } from "@/lib/rateLimit";
import { checkGenericRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import {
  safeValidate,
  validationErrorResponse,
  UpdateWhatsAppSettingsSchema,
} from "@/lib/validations";

export const dynamic = "force-dynamic";

// GET /api/whatsapp - Fetch current whatsapp settings
export async function GET(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:whatsapp:get:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 60, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    let settings = await prisma.whatsAppSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.whatsAppSetting.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Fetch WhatsApp settings error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// PUT /api/whatsapp - Update WhatsApp settings (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:whatsapp:put:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 20, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const rawBody = await req.json().catch(() => ({}));
    const bodyRes = safeValidate(UpdateWhatsAppSettingsSchema, rawBody);
    if (!bodyRes.success) {
      return validationErrorResponse(bodyRes.error);
    }
    const body = bodyRes.data;

    if (body.id && body.id !== "default") {
      return NextResponse.json({ error: "Cannot modify protected ID field" }, { status: 400 });
    }

    // Explicitly whitelist permitted writable fields
    const allowedFields = [
      "whatsappNumber",
      "defaultMessageTemplate",
      "callNumber",
      "isEnabled",
    ] as const;

    const sanitizedData: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in body && (body as any)[key] !== undefined) {
        sanitizedData[key] = (body as any)[key];
      }
    }

    const settings = await prisma.whatsAppSetting.upsert({
      where: { id: "default" },
      update: sanitizedData,
      create: {
        id: "default",
        ...sanitizedData,
      },
    });

    // Dual-sync into WebsiteSetting table
    if (sanitizedData.whatsappNumber !== undefined || sanitizedData.callNumber !== undefined) {
      const webUpdate: Record<string, any> = {};
      if (sanitizedData.whatsappNumber !== undefined) webUpdate.whatsapp = sanitizedData.whatsappNumber;
      if (sanitizedData.callNumber !== undefined) webUpdate.phone = sanitizedData.callNumber;

      await prisma.websiteSetting.upsert({
        where: { id: "default" },
        update: webUpdate,
        create: {
          id: "default",
          ...webUpdate,
        },
      });
    }

    // Invalidate cache
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
    console.error("Update WhatsApp settings error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
