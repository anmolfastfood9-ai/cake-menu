import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionAdminFromRequest } from "@/lib/auth";
import { processImageUpload, deleteFromImageKit, validateImageBuffer, getImageUsageMap, purgeUnusedImages } from "@/lib/upload";
import { getClientIp } from "@/lib/rateLimit";
import { checkGenericRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import {
  safeValidate,
  validationErrorResponse,
  ImageFolderSchema,
  DeleteImageQuerySchema,
  MAX_FILES_PER_UPLOAD,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
} from "@/lib/validations";
import fs from "fs";
import path from "path";

// GET /api/images - List all uploaded media (Admin only)
export async function GET(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:images:get:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 60, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const [images, usageMap] = await Promise.all([
      prisma.imageMedia.findMany({ orderBy: { createdAt: "desc" } }),
      getImageUsageMap(),
    ]);

    const enrichedImages = images.map((img) => {
      const usages = usageMap.get(img.url) || [];
      return {
        ...img,
        isUsed: usages.length > 0,
        usedIn: usages,
      };
    });

    return NextResponse.json({ success: true, images: enrichedImages });
  } catch (error: any) {
    console.error("Fetch images error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}


// POST /api/images - Upload one or more images (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:images:upload:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 15, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json(
        { error: "Invalid form data" },
        { status: 400 }
      );
    }

    const rawFiles = formData.getAll("files") as File[];
    let files: File[] = rawFiles.filter((f) => f && typeof f.size === "number" && f.size > 0);

    if (files.length === 0) {
      const single = formData.get("file") as File;
      if (single && typeof single.size === "number" && single.size > 0) {
        files = [single];
      } else {
        return NextResponse.json(
          { error: "No files provided for upload" },
          { status: 400 }
        );
      }
    }

    // 1. Enforce max files limit
    if (files.length > MAX_FILES_PER_UPLOAD) {
      return NextResponse.json(
        {
          error: `Too many files. Maximum ${MAX_FILES_PER_UPLOAD} files allowed per request`,
        },
        { status: 400 }
      );
    }

    // 2. Enforce folder allowlist (prevents path traversal)
    const rawFolder = (formData.get("folder") as string) || "/cakes";
    const folderRes = safeValidate(ImageFolderSchema, rawFolder);
    if (!folderRes.success) {
      return validationErrorResponse(folderRes.error);
    }
    const folder = folderRes.data;

    // 3. Pre-validate all files (size & binary magic bytes & allowed MIME)
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds maximum allowed size of 5 MB`,
          },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const validation = validateImageBuffer(buffer);

      if (!validation.isValid || !validation.mimeType) {
        return NextResponse.json(
          {
            error: validation.error || `Invalid image binary signature for "${file.name}"`,
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(validation.mimeType)) {
        return NextResponse.json(
          {
            error: `Unsupported image format "${validation.mimeType}". Accept only JPEG, PNG, and WebP.`,
          },
          { status: 400 }
        );
      }
    }

    // 4. Process upload
    const uploadedImages = [];
    for (const file of files) {
      try {
        const uploadResult = await processImageUpload(file, { folder });
        const saved = await prisma.imageMedia.create({
          data: {
            url: uploadResult.url,
            filename: uploadResult.filename,
            publicId: uploadResult.publicId,
            size: uploadResult.size,
            mimeType: uploadResult.mimeType,
          },
        });
        uploadedImages.push(saved);
      } catch (uploadErr: any) {
        return NextResponse.json(
          { error: uploadErr.message || "Image upload failed" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, images: uploadedImages }, { status: 201 });
  } catch (error: any) {
    console.error("Image upload route error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// DELETE /api/images?id=... - Delete image (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = getSessionAdminFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientIp = getClientIp(req);
    const rlKey = `ratelimit:images:delete:${session.userId}:${clientIp}`;
    const rl = await checkGenericRateLimit(rlKey, 20, 60);
    if (!rl.allowed) {
      return rateLimitResponse(rl.retryAfter);
    }

    const { searchParams } = new URL(req.url);

    // Handle bulk cleanup action for unused/orphaned images
    if (searchParams.get("action") === "cleanup" || searchParams.get("cleanup") === "true") {
      const result = await purgeUnusedImages();
      return NextResponse.json({
        success: true,
        message: `Successfully cleaned up ${result.deletedCount} unused/orphaned image(s)`,
        deletedCount: result.deletedCount,
        deletedIds: result.deletedIds,
      });
    }

    const rawQuery = { id: searchParams.get("id") ?? undefined };
    const queryRes = safeValidate(DeleteImageQuerySchema, rawQuery);
    if (!queryRes.success) {
      return validationErrorResponse(queryRes.error);
    }
    const { id } = queryRes.data;

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
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
