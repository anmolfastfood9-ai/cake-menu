import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";

// GET /api/whatsapp - Fetch current whatsapp settings
export async function GET() {
  try {
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
    return NextResponse.json({ error: error.message || "Failed to fetch WhatsApp settings" }, { status: 500 });
  }
}

// PUT /api/whatsapp - Update WhatsApp settings (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // Explicitly whitelist permitted writable fields
    const allowedFields = [
      "whatsappNumber",
      "defaultMessageTemplate",
      "callNumber",
      "isEnabled",
    ];

    if (body.id && body.id !== "default") {
      return NextResponse.json({ error: "Cannot modify protected ID field" }, { status: 400 });
    }

    const sanitizedData: Record<string, any> = {};
    if (body.whatsappNumber !== undefined) {
      sanitizedData.whatsappNumber = String(body.whatsappNumber).trim();
    }
    if (body.defaultMessageTemplate !== undefined) {
      sanitizedData.defaultMessageTemplate = String(body.defaultMessageTemplate);
    }
    if (body.callNumber !== undefined) {
      sanitizedData.callNumber = String(body.callNumber).trim();
    }
    if (body.isEnabled !== undefined) {
      sanitizedData.isEnabled = Boolean(body.isEnabled);
    }

    const settings = await prisma.whatsAppSetting.upsert({
      where: { id: "default" },
      update: sanitizedData,
      create: {
        id: "default",
        ...sanitizedData,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Update WhatsApp settings error:", error);
    return NextResponse.json({ error: error.message || "Failed to update WhatsApp settings" }, { status: 500 });
  }
}
