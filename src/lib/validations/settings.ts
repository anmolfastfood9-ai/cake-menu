import { z } from "zod";

export const UpdateSettingsSchema = z.object({
  id: z.string().trim().max(50).optional(),
  restaurantName: z.string().trim().max(100, "Restaurant name too long").optional(),
  tagline: z.string().trim().max(150, "Tagline too long").nullable().optional(),
  logo: z.string().trim().max(1000, "Logo URL too long").nullable().optional(),
  heroTitle: z.string().trim().max(200, "Hero title too long").nullable().optional(),
  heroSubtitle: z.string().trim().max(500, "Hero subtitle too long").nullable().optional(),
  heroImage: z.string().trim().max(1000, "Hero image URL too long").nullable().optional(),
  about: z.string().trim().max(3000, "About section too long").nullable().optional(),
  phone: z
    .union([
      z.string().trim().max(50, "Phone number too long"),
      z.literal(""),
      z.null(),
    ])
    .nullable()
    .optional(),
  whatsapp: z
    .union([
      z
        .string()
        .trim()
        .regex(/^\+?[0-9\s\-().,/]{7,30}$/, "Invalid WhatsApp phone number format"),
      z.literal(""),
      z.null(),
    ])
    .nullable()
    .optional(),
  address: z.string().trim().max(500, "Address too long").nullable().optional(),
  openingHours: z.string().trim().max(150, "Opening hours too long").nullable().optional(),
  instagram: z.string().trim().max(200, "Instagram link too long").nullable().optional(),
  facebook: z.string().trim().max(200, "Facebook link too long").nullable().optional(),
  footerText: z.string().trim().max(300, "Footer text too long").nullable().optional(),
});
