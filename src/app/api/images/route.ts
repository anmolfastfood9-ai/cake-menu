import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { processImageUpload, deleteFromImageKit } from "@/lib/upload";
import fs from "fs";
import path from "path";

// GET /api/images - List all uploaded media
export async function GET() {
  try {
    const images = await prisma.imageMedia.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error("Fetch images error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST /api/images - Upload one or more images (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "/cakes";

    if (!files || files.length === 0) {
      // Check single file field
      const single = formData.get("file") as File;
      if (single) {
        files.push(single);
      } else {
        return NextResponse.json({ error: "No files provided for upload" }, { status: 400 });
      }
    }

    const uploadedImages = [];

    for (const file of files) {
      try {
        const uploadResult = await processImageUpload(file, { folder });
        const saved = await prisma.imageMedia.create({
          data: {
            url: uploadResult.url,
            filename: uploadResult.filename,
            publicId: uploadResult.publicId, // ImageKit fileId
            size: uploadResult.size,
            mimeType: uploadResult.mimeType,
          },
        });
        uploadedImages.push(saved);
      } catch (uploadErr: any) {
        return NextResponse.json(
          { error: uploadErr.message || "Image validation or upload failed" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, images: uploadedImages }, { status: 201 });
  } catch (error: any) {
    console.error("Image upload route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image(s)" },
      { status: 500 }
    );
  }
}

// DELETE /api/images?id=... - Delete image (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }

    const image = await prisma.imageMedia.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ error: "Image record not found" }, { status: 404 });
    }

    // 1. If ImageKit fileId exists, delete the asset from ImageKit CDN
    if (image.publicId && !image.publicId.endsWith(".jpg") && !image.publicId.endsWith(".png")) {
      try {
        await deleteFromImageKit(image.publicId);
      } catch (ikErr) {
        console.warn(`Failed to delete ImageKit asset (${image.publicId}):`, ikErr);
        // We log and continue so the database row is still safely cleaned up
      }
    }

    // 2. If it was a legacy local file in /public/uploads, clean up safely
    if (image.url && image.url.startsWith("/uploads/")) {
      try {
        const localPath = path.join(process.cwd(), "public", image.url.replace(/^\//, ""));
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      } catch (localErr) {
        console.warn("Failed to delete local fallback file:", localErr);
      }
    }

    // 3. Remove DB record
    await prisma.imageMedia.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("Delete image route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete image" },
      { status: 500 }
    );
  }
}
