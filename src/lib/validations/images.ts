import { z } from "zod";

export const ALLOWED_IMAGE_FOLDERS = [
  "/cakes",
  "/occasions",
  "/general",
  "/branding",
  "/hero",
  "/logo",
  "/favicon",
  "/festivals",
  "/categories",
  "/custom",
] as const;

export const ImageFolderSchema = z
  .string()
  .refine(
    (val): val is (typeof ALLOWED_IMAGE_FOLDERS)[number] =>
      (ALLOWED_IMAGE_FOLDERS as readonly string[]).includes(val),
    {
      message: "Invalid upload folder. Must be one of the permitted application folders",
    }
  );

export const DeleteImageQuerySchema = z.object({
  id: z.string().trim().min(1, "Image ID is required").max(50, "Image ID too long"),
});

export const MAX_FILES_PER_UPLOAD = 5;
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
