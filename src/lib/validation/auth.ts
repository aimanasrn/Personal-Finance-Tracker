import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(72, "Password must be 72 characters or fewer.");

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const loginSchema = signUpSchema;

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
