import { z } from "zod";

export const UpdateWhatsAppSettingsSchema = z.object({
  id: z.string().trim().max(50).optional(),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,25}$/, "Invalid WhatsApp number format")
    .optional(),
  callNumber: z.string().trim().max(30, "Call number too long").nullable().optional(),
  defaultMessageTemplate: z
    .string()
    .max(2000, "Message template must not exceed 2000 characters")
    .optional(),
  isEnabled: z.coerce.boolean().optional(),
});
