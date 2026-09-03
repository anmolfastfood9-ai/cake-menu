import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { invalidateAppCache } from "@/lib/cache";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// GET /api/settings - Fetch current website settings
export async function GET() {
  try {
    let settings = await prisma.websiteSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.websiteSetting.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch settings" }, { status: 500 });
  }
}

// Common update logic for PUT / POST / PATCH
async function handleUpdateSettings(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in as admin." }, { status: 401 });
    }

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

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
    ];

    if (body.id && body.id !== "default") {
      return NextResponse.json({ error: "Cannot modify protected ID field" }, { status: 400 });
    }

    const sanitizedData: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in body && body[key] !== undefined) {
        sanitizedData[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
      }
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
      if (sanitizedData.whatsapp !== undefined) waUpdate.whatsappNumber = sanitizedData.whatsapp;
      if (sanitizedData.phone !== undefined) waUpdate.callNumber = sanitizedData.phone;

      await prisma.whatsAppSetting.upsert({
        where: { id: "default" },
        update: waUpdate,
        create: {
          id: "default",
          whatsappNumber: sanitizedData.whatsapp || "919876543210",
          callNumber: sanitizedData.phone || "+91 98765 43210",
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
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
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

