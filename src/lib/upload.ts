import path from "path";
import fs from "fs";
import prisma from "@/lib/db";

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  publicId: string; // ImageKit fileId or local identifier
}

/**
 * Maximum allowed upload file size in bytes (5 MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Supported MIME types and image formats
 */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];

export const ALLOWED_FOLDERS = [
  "/cakes",
  "/occasions",
  "/general",
  "/branding",
  "/hero",
  "/logo",
  "/festivals",
  "/categories",
  "/custom",
];

/**
 * Validates actual file buffer magic numbers / binary signatures.
 * Prioritizes binary signatures (JPEG, PNG, WebP, AVIF) to prevent false-positive
 * rejections on images containing XML metadata (XMP chunks from Photoshop/Canva).
 * Safely permits clean, script-free SVG vector graphics.
 */
export function validateImageBuffer(buffer: Buffer): {
  isValid: boolean;
  mimeType?: string;
  error?: string;
} {
  if (!buffer || buffer.length < 12) {
    return { isValid: false, error: "File is too small or corrupted" };
  }

  // 1. JPEG: FF D8 FF (High priority check - true binary magic bytes)
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, mimeType: "image/jpeg" };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A (High priority check - true binary magic bytes)
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, mimeType: "image/png" };
  }

  // 3. WebP: RIFF (bytes 0-3) and WEBP (bytes 8-11)
  const riff = buffer.toString("ascii", 0, 4);
  const webp = buffer.toString("ascii", 8, 12);
  if (riff === "RIFF" && webp === "WEBP") {
    return { isValid: true, mimeType: "image/webp" };
  }

  // 4. AVIF: ftyp (bytes 4-7) with avif/mif1/avis (bytes 8-11)
  const ftyp = buffer.toString("ascii", 4, 8);
  if (ftyp === "ftyp") {
    const brand = buffer.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "mif1" || brand === "avis") {
      return { isValid: true, mimeType: "image/avif" };
    }
  }

  // 5. SVG: Text-based vector graphic. Ensure it contains no executable scripts
  const textSample = buffer.slice(0, 4096).toString("utf8").toLowerCase();
  if (
    textSample.includes("<svg") ||
    (textSample.includes("<?xml") && textSample.includes("<svg")) ||
    textSample.includes("xmlns=\"http://www.w3.org/2000/svg")
  ) {
    const fullText = buffer.toString("utf8").toLowerCase();
    // Block <script> tags, javascript: URLs, data: URIs, and ALL on* event handlers
    if (
      fullText.includes("<script") ||
      fullText.includes("javascript:") ||
      /\bon\w+\s*=/i.test(fullText) ||          // all event handlers: onload, onmouseover, onfocus, etc.
      /xlink:href\s*=\s*["']?\s*javascript:/i.test(fullText) ||
      /href\s*=\s*["']?\s*data:/i.test(fullText)
    ) {
      return {
        isValid: false,
        error: "SVG file contains prohibited scripts, event handlers, or unsafe URIs",
      };
    }
    return { isValid: true, mimeType: "image/svg+xml" };
  }

  return {
    isValid: false,
    error: "Unsupported image format. Allowed formats are PNG, JPEG, WebP, AVIF, and clean SVG.",
  };
}

/**
 * Sanitizes input filename for safe cloud storage
 */
export function sanitizeFilename(originalName: string): string {
  const base = path.basename(originalName);
  let ext = path.extname(base).toLowerCase();
  if (!ext || ext === ".") ext = ".jpg";

  const nameWithoutExt = path.basename(base, ext);
  const cleanName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);

  return `${Date.now()}-${cleanName || "cake"}${ext}`;
}

/**
 * Uploads an image buffer directly to ImageKit via their REST API
 */
export async function uploadToImageKit({
  buffer,
  filename,
  folder = "/cakes",
}: {
  buffer: Buffer;
  filename: string;
  folder?: string;
}): Promise<UploadResult> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!privateKey) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is missing from environment variables");
  }

  const safeFolder = ALLOWED_FOLDERS.includes(folder) ? folder : "/cakes";
  const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");

  const formData = new FormData();
  formData.append("file", buffer.toString("base64"));
  formData.append("fileName", filename);
  formData.append("folder", safeFolder);
  formData.append("useUniqueFileName", "true");

  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: authHeader,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("ImageKit upload error:", data);
    throw new Error(data.message || "Failed to upload image to ImageKit");
  }

  return {
    url: data.url,
    publicId: data.fileId,
    filename: data.name || filename,
    size: data.size || buffer.length,
    mimeType: data.fileType === "image" ? "image/jpeg" : data.mime || "image/jpeg",
  };
}

/**
 * Deletes an image from ImageKit by fileId
 */
export async function deleteFromImageKit(fileId: string): Promise<boolean> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is missing from environment variables");
  }

  if (!fileId || typeof fileId !== "string") {
    return true;
  }

  const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");
  const res = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, {
    method: "DELETE",
    headers: {
      Authorization: authHeader,
    },
  });

  // 204: deleted, 404: already gone
  if (res.status === 204 || res.status === 200 || res.status === 404) {
    return true;
  }

  const errData = await res.json().catch(() => ({}));
  console.error("ImageKit delete error:", errData);
  throw new Error(errData.message || "Failed to delete image from ImageKit");
}

/**
 * High-level image processing pipeline:
 * Validates size, verifies magic bytes, sanitizes filename, and uploads to ImageKit.
 */
export async function processImageUpload(
  file: File,
  options?: { folder?: string }
): Promise<UploadResult> {
  // 1. File size validation (Max 5MB)
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File "${file.name}" exceeds the maximum allowed size of 5 MB (${(file.size / (1024 * 1024)).toFixed(2)} MB uploaded)`);
  }

  // 2. Read Buffer & Verify binary magic bytes / content security
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const validation = validateImageBuffer(buffer);
  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid image format");
  }

  // 4. Sanitize Filename
  const cleanFilename = sanitizeFilename(file.name);

  // 5. Upload to ImageKit (Production Mode)
  if (process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
    const result = await uploadToImageKit({
      buffer,
      filename: cleanFilename,
      folder: options?.folder || "/cakes",
    });

    result.mimeType = validation.mimeType || "image/jpeg";
    return result;
  }

  // 6. Optional local dev fallback only if ImageKit keys are explicitly missing
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filepath = path.join(uploadsDir, cleanFilename);
  fs.writeFileSync(filepath, buffer);

  return {
    url: `/uploads/${cleanFilename}`,
    filename: file.name,
    size: file.size,
    mimeType: validation.mimeType || file.type || "image/jpeg",
    publicId: cleanFilename,
  };
}

/**
 * Builds a map of image URLs to their active usage locations across all database models.
 */
export async function getImageUsageMap(): Promise<Map<string, string[]>> {
  const usageMap = new Map<string, string[]>();

  const addUsage = (url: string | null | undefined, label: string) => {
    if (!url || typeof url !== "string" || !url.trim()) return;
    const clean = url.trim();
    const existing = usageMap.get(clean) || [];
    if (!existing.includes(label)) {
      existing.push(label);
    }
    usageMap.set(clean, existing);
  };

  const [cakes, prices, categories, occasions, settings] = await Promise.all([
    prisma.cake.findMany({ select: { name: true, coverImage: true, images: true } }),
    prisma.cakePrice.findMany({ select: { id: true, image: true, images: true } }),
    prisma.category.findMany({ select: { name: true, image: true } }),
    prisma.occasion.findMany({ select: { name: true, bannerImage: true } }),
    prisma.websiteSetting.findMany({ select: { logo: true, favicon: true, heroImage: true } }),
  ]);

  for (const c of cakes) {
    if (c.coverImage) addUsage(c.coverImage, `Cake: ${c.name}`);
    if (c.images) {
      try {
        const arr = typeof c.images === "string" ? JSON.parse(c.images) : c.images;
        if (Array.isArray(arr)) arr.forEach((u: string) => addUsage(u, `Cake Gallery: ${c.name}`));
      } catch (e) {}
    }
  }

  for (const p of prices) {
    if (p.image) addUsage(p.image, `Weight Tier`);
    if (p.images) {
      try {
        const arr = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
        if (Array.isArray(arr)) arr.forEach((u: string) => addUsage(u, `Weight Tier Gallery`));
      } catch (e) {}
    }
  }

  for (const cat of categories) {
    if (cat.image) addUsage(cat.image, `Category: ${cat.name}`);
  }

  for (const occ of occasions) {
    if (occ.bannerImage) addUsage(occ.bannerImage, `Occasion: ${occ.name}`);
  }

  for (const s of settings) {
    if (s.logo) addUsage(s.logo, `Logo`);
    if (s.favicon) addUsage(s.favicon, `Favicon`);
    if (s.heroImage) addUsage(s.heroImage, `Hero Banner`);
  }

  return usageMap;
}

/**
 * Finds and purges all unused / orphaned ImageMedia records from CDN/disk and DB.
 */
export async function purgeUnusedImages(): Promise<{ deletedCount: number; deletedIds: string[] }> {
  const images = await prisma.imageMedia.findMany();
  const usageMap = await getImageUsageMap();

  const unusedImages = images.filter((img) => !usageMap.has(img.url));

  const deletedIds: string[] = [];
  for (const img of unusedImages) {
    try {
      if (img.publicId && !img.publicId.endsWith(".jpg") && !img.publicId.endsWith(".png")) {
        await deleteFromImageKit(img.publicId).catch(() => null);
      }
      if (img.url && img.url.startsWith("/uploads/")) {
        const localPath = path.join(process.cwd(), "public", img.url.replace(/^\//, ""));
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }
      await prisma.imageMedia.delete({ where: { id: img.id } });
      deletedIds.push(img.id);
    } catch (err) {
      console.warn(`Failed to delete unused image (${img.id}):`, err);
    }
  }

  return { deletedCount: deletedIds.length, deletedIds };
}

