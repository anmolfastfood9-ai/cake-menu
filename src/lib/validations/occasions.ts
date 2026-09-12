import { z } from "zod";

function isValidCalendarDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (year < 2000 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day >= 1 && day <= daysInMonth;
}

export const OccasionParamSchema = z.object({
  id: z.string().trim().min(1, "Occasion ID is required").max(50, "Occasion ID too long"),
});

export const CreateOccasionSchema = z.object({
  name: z.string().trim().min(1, "Occasion name is required").max(100, "Occasion name must not exceed 100 characters"),
  slug: z.string().trim().max(100, "Slug must not exceed 100 characters").optional(),
  type: z.enum(["FESTIVAL", "CELEBRATION", "SEASONAL", "CUSTOM"]).default("CUSTOM"),
  badgeText: z.string().trim().max(100, "Badge text must not exceed 100 characters").optional(),
  description: z.string().trim().max(1000, "Description must not exceed 1000 characters").optional(),
  bannerImage: z
    .union([
      z.string().trim().url("Invalid banner image URL").max(1000, "Banner image URL too long"),
      z.string().trim().max(1000).refine((s) => s.startsWith("/"), "Path must start with /"),
      z.literal(""),
      z.null(),
    ])
    .nullable()
    .optional(),
  accentColor: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Accent color must be valid hex #RGB or #RRGGBB format")
    .default("#D4AF37"),
  priority: z.coerce.number().int("Priority must be integer").min(0, "Priority must be >= 0").max(1000, "Priority must not exceed 1000").default(75),
  active: z.coerce.boolean().default(true),
  eventDate: z
    .string()
    .trim()
    .refine(isValidCalendarDate, "Celebration date must be a valid calendar date in YYYY-MM-DD format"),
  daysBefore: z.coerce.number().int().min(0, "Days before must be >= 0").max(90, "Days before cannot exceed 90").default(5),
  daysAfter: z.coerce.number().int().min(0, "Days after must be >= 0").max(30, "Days after cannot exceed 30").default(1),
  cakeIds: z.array(z.string().trim().max(50, "Cake ID too long")).max(50, "Maximum 50 cakes allowed per occasion").optional().default([]),
});

export const UpdateOccasionSchema = CreateOccasionSchema.partial();

export const CreateOccasionCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(100, "Category name must not exceed 100 characters"),
  displayOrder: z.coerce.number().int().min(0).max(1000, "Display order must not exceed 1000").optional(),
});

export const UpdateOccasionCategorySchema = z.object({
  categoryId: z.string().trim().min(1, "categoryId is required").max(50, "categoryId too long"),
  name: z.string().trim().min(1).max(100, "Category name must not exceed 100 characters").optional(),
  displayOrder: z.coerce.number().int().min(0).max(1000).optional(),
  active: z.coerce.boolean().optional(),
  cakeIds: z.array(z.string().trim().max(50, "Cake ID too long")).max(50, "Maximum 50 cakes allowed").optional(),
});

export const BulkReorderOccasionCategoriesSchema = z.object({
  categories: z
    .array(
      z.object({
        id: z.string().trim().min(1, "Category ID is required").max(50, "Category ID too long"),
        displayOrder: z.coerce.number().int().min(0).max(1000).optional(),
        active: z.coerce.boolean().optional(),
        name: z.string().trim().min(1).max(100).optional(),
      })
    )
    .min(1, "At least one category is required")
    .max(50, "Maximum 50 categories allowed in bulk reorder"),
});

export const OccasionCategoryQuerySchema = z.object({
  categoryId: z.string().trim().min(1, "categoryId is required").max(50, "categoryId too long"),
});
