import { z } from "zod";

export const UpdateWhatsAppSettingsSchema = z.object({
  id: z.string().trim().max(50).optional(),
  whatsappNumber: z
    .union([
      z
        .string()
        .trim()
        .regex(/^\+?[0-9\s\-().,/]{7,30}$/, "Invalid WhatsApp number format"),
      z.literal(""),
      z.null(),
    ])
    .nullable()
    .optional(),
  callNumber: z
    .union([
      z.string().trim().max(50, "Call number too long"),
      z.literal(""),
      z.null(),
    ])
    .nullable()
    .optional(),
  defaultMessageTemplate: z
    .string()
    .max(2000, "Message template must not exceed 2000 characters")
    .optional(),
  isEnabled: z.coerce.boolean().optional(),
});
