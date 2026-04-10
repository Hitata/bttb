import "dotenv/config";
import { defineConfig } from "prisma/config";
import { buildDatabaseUrl } from "./src/lib/supabase-db";

// Set DATABASE_URL so the schema's env("DATABASE_URL") resolves correctly
process.env.DATABASE_URL = buildDatabaseUrl(true);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: buildDatabaseUrl(true),
  },
  seed: {
    command: "npx tsx prisma/seed-hexagrams.ts",
  },
});
