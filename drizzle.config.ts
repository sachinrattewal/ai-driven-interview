import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/utils/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://ai-driven-interview_owner:dOVrnfcT9U6N@ep-empty-smoke-a19wmj02.ap-southeast-1.aws.neon.tech/ai-driven-interview?sslmode=require",
  },
  verbose: true,
  strict: true,
} as any);
