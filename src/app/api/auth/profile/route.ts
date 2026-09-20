import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { getSessionAdminFromRequest, signAdminToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { getClientIp, checkGenericRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { UpdateProfileSchema, safeValidate } from "@/lib/validations";

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Distributed Rate Limit: 10 attempts / 15 minutes / admin + IP
    const clientIp = getClientIp(req);
    const identifier = `profile:${session.userId}:${clientIp}`;
    const rateCheck = await checkGenericRateLimit(identifier, 10, 15 * 60, "ratelimit:profile");
    if (!rateCheck.success) {
      return rateLimitResponse(rateCheck.retryAfter ?? 900);
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const validation = safeValidate(UpdateProfileSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const { name, email, currentPassword, newPassword } = validation.data;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase().trim();

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: { id: true, name: true, email: true },
    });

    // Re-sign token so session stays completely synced across admin header
    const token = signAdminToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name || "Admin",
    });

    const res = NextResponse.json({ success: true, user: updatedUser });
    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
