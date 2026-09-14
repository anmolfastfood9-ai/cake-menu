import { z } from "zod";

const ImageUrlOrPathSchema = z
  .string()
  .trim()
  .max(1000, "Image URL too long")
  .refine(
    (val) => !val || /^https?:\/\//i.test(val) || val.startsWith("/"),
    "Image must be a valid URL or relative path"
  );

export const CakePriceInputSchema = z
  .object({
    weight: z.string().trim().min(1, "Weight is required").max(50, "Weight must not exceed 50 characters"),
    isCustomQuote: z.coerce.boolean().optional().default(false),
    price: z.preprocess(
      (val) => (val === "" || val === undefined || val === null ? null : val),
      z.coerce
        .number()
        .positive("Price must be greater than 0")
        .max(1_000_000, "Price must not exceed 1,000,000")
        .nullable()
        .optional()
    ),
    originalPrice: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z.coerce
        .number()
        .positive("Original price must be greater than 0")
        .max(1_000_000, "Original price must not exceed 1,000,000")
        .nullable()
        .optional()
    ),
    isDefault: z.coerce.boolean().optional(),
    image: z.preprocess(
      (val) => (val === "" ? null : val),
      ImageUrlOrPathSchema.nullable().optional()
    ),
  images: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    },
    z
      .array(ImageUrlOrPathSchema)
      .max(10, "Maximum 10 images allowed per tier")
      .optional()
      .default([])
  ),
})
.refine(
  (data) => {
    if (data.isCustomQuote) {
      return true;
    }
    return typeof data.price === "number" && data.price > 0;
  },
  {
    message: "Price must be greater than 0 for standard pricing",
    path: ["price"],
  }
);

export const CreateCakeSchema = z.object({
  name: z.string().trim().min(1, "Cake name is required").max(150, "Cake name must not exceed 150 characters"),
  productType: z.literal("CAKE").default("CAKE"),
  isCustomQuote: z.coerce.boolean().optional().default(false),
  slug: z.string().trim().max(150, "Slug must not exceed 150 characters").optional(),
  categoryId: z.string().trim().min(1, "Category ID is required").max(50, "Category ID too long"),
  description: z.string().trim().min(1, "Description is required").max(3000, "Description must not exceed 3000 characters"),
  coverImage: ImageUrlOrPathSchema.refine((val) => Boolean(val && val.length > 0), "Valid cover image URL is required"),
  images: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    },
    z
      .array(ImageUrlOrPathSchema)
      .max(10, "Maximum 10 main gallery images allowed")
      .optional()
      .default([])
  ),
  ingredients: z.string().trim().max(2000, "Ingredients must not exceed 2000 characters").optional(),
  preparationNotes: z.string().trim().max(1000, "Preparation notes must not exceed 1000 characters").optional(),
  featured: z.coerce.boolean().optional().default(false),
  bestseller: z.coerce.boolean().optional().default(false),
  isNew: z.coerce.boolean().optional().default(false),
  available: z.coerce.boolean().optional().default(true),
  rating: z.preprocess(
    (val) => (val === undefined || val === null || val === "" ? 4.9 : Number(val)),
    z.number().min(0, "Rating cannot be negative").max(5, "Rating cannot exceed 5.0").default(4.9)
  ),
  displayRating: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "" || (typeof val === "string" && val.trim() === "")) {
        return null;
      }
      const num = Number(val);
      return isNaN(num) ? val : num;
    },
    z.number()
      .min(4.5, "Display rating must be between 4.5 and 5.0")
      .max(5.0, "Display rating must be between 4.5 and 5.0")
      .refine(
        (val) => Math.round(val * 10) / 10 === val,
        "Display rating can have at most 1 decimal place"
      )
      .nullable()
      .optional()
  ),
  ratingLabel: z.preprocess(
    (val) => (val === undefined || val === null ? null : typeof val === "string" ? val.trim() : val),
    z.string().max(30, "Rating label must not exceed 30 characters").nullable().optional()
  ),
  editorialQuote: z.preprocess(
    (val) => (val === undefined || val === null ? null : typeof val === "string" ? val.trim() : val),
    z.string().max(180, "Editorial quote must not exceed 180 characters").nullable().optional()
  ),
  customizationInfo: z.string().trim().max(1000, "Customization info must not exceed 1000 characters").optional(),
  prices: z
    .array(CakePriceInputSchema)
    .min(1, "At least one price tier is required")
    .max(20, "Maximum 20 price tiers allowed"),
  occasionIds: z
    .array(z.string().trim().max(50, "Occasion ID too long"))
    .max(30, "Maximum 30 occasions allowed")
    .optional()
    .default([]),
});

export const UpdateCakeSchema = CreateCakeSchema.partial();

export const CakeIdParamSchema = z.object({
  id: z.string().trim().min(1, "ID is required").max(150, "ID too long"),
});

export const GetCakesQuerySchema = z.object({
  search: z.string().trim().max(100, "Search query must not exceed 100 characters").optional(),
  category: z.string().trim().max(100, "Category slug too long").optional(),
  categoryId: z.string().trim().max(50, "Category ID too long").optional(),
  tag: z.enum(["featured", "bestseller", "new"]).optional(),
  productType: z.literal("CAKE").optional(),
  cakesOnly: z.enum(["true", "false"]).optional(),
  availableOnly: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().min(1, "Page must be >= 1").optional(),
  limit: z.coerce.number().int().min(1, "Limit must be >= 1").max(100, "Limit cannot exceed 100").optional(),
});
