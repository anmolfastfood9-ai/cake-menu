import { z } from "zod";

export const CategoryParamSchema = z.object({
  id: z.string().trim().min(1, "Category ID is required").max(50, "Category ID too long"),
});

export const GetCategoriesQuerySchema = z.object({
  activeOnly: z.enum(["true", "false"]).optional(),
});

export const CreateCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(100, "Category name must not exceed 100 characters"),
  slug: z.string().trim().max(100, "Slug must not exceed 100 characters").optional(),
  description: z.string().trim().max(1000, "Description must not exceed 1000 characters").nullable().optional(),
  image: z
    .string()
    .trim()
    .max(1000, "Image URL too long")
    .refine((val) => !val || /^https?:\/\//i.test(val) || val.startsWith("/"), "Image must be a valid URL or path")
    .nullable()
    .optional(),
  icon: z.string().trim().max(50, "Icon identifier too long").nullable().optional(),
  displayOrder: z.coerce
    .number()
    .int("Display order must be an integer")
    .min(0, "Display order must be >= 0")
    .max(10000, "Display order must not exceed 10000")
    .default(0),
  active: z.coerce.boolean().default(true),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();
