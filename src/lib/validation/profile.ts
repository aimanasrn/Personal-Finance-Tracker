import { z } from "zod";

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters long.")
    .max(50, "Display name must be 50 characters or fewer."),
  preferredCurrency: z
    .string()
    .trim()
    .regex(/^[A-Z]{3}$/, "Preferred currency must be a 3-letter code like MYR.")
});

export type ProfileInput = z.infer<typeof profileSchema>;
