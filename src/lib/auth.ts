import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "admin_token";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing.");
  }
  return secret;
}

export interface AdminPayload {
  userId: string;
  email: string;
  name: string;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("Authentication check failed: JWT_SECRET environment variable is missing.");
      return null;
    }
    return jwt.verify(token, secret) as AdminPayload;
  } catch (error) {
    return null;
  }
}

export async function getSessionAdmin(): Promise<AdminPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function getSessionAdminFromRequest(req: NextRequest): AdminPayload | null {
  const token = req.cookies.get(COOKIE_NAME)?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyAdminToken(token);
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
