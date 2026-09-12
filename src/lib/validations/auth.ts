import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(100, "Email must not exceed 100 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password must not exceed 128 characters"),
});

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").max(100, "Name must not exceed 100 characters").optional(),
  email: z.string().trim().email("Invalid email format").max(100, "Email must not exceed 100 characters").optional(),
  currentPassword: z.string().max(128, "Current password must not exceed 128 characters").optional(),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(128, "New password must not exceed 128 characters")
    .optional(),
});
