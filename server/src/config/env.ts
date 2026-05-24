import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1).default("mysql://root:password@127.0.0.1:3306/personal_finance_tracker"),
  JWT_SECRET: z.string().min(1).default("dev-secret"),
  CLIENT_ORIGIN: z.string().default("http://127.0.0.1:5173")
});

export const env = envSchema.parse(process.env);
