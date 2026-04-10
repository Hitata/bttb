import "dotenv/config";
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const DB_PATH = "prisma/dev.db";

const pg = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});

function readTable(table: string): Record<string, unknown>[] {
  const out = execSync(
    `sqlite3 "${DB_PATH}" -json "SELECT * FROM \\"${table}\\""`,
    { maxBuffer: 50 * 1024 * 1024 }
  ).toString();
  if (!out.trim()) return [];
  return JSON.parse(out);
}

// SQLite stores booleans as 0/1
const BOOL_FIELDS: Record<string, string[]> = {
  BaziReading: ["isPublic"],
  HumanDesignReading: ["isPublic", "birthTimeUnknown"],
  BaziCase: ["isPublished"],
  TuViReading: ["isPublic"],
};

function fixBooleans(table: string, row: Record<string, unknown>) {
  for (const field of BOOL_FIELDS[table] ?? []) {
    if (field in row) row[field] = row[field] === 1;
  }
}

// SQLite stores dates as strings or integers — Prisma expects Date objects
const DATE_FIELDS: Record<string, string[]> = {
  BaziReading: ["createdAt", "updatedAt"],
  HumanDesignReading: ["createdAt", "updatedAt"],
  BaziCase: ["publishedAt", "createdAt", "updatedAt"],
  BaziClient: ["createdAt", "updatedAt"],
  IChingReading: ["intentionTime", "createdAt"],
  TuViReading: ["createdAt", "updatedAt"],
  Hexagram: [],
};

function fixDates(table: string, row: Record<string, unknown>) {
  for (const field of DATE_FIELDS[table] ?? []) {
    if (row[field] != null && !(row[field] instanceof Date)) {
      row[field] = new Date(row[field] as string | number);
    }
  }
}

const TABLES_WITH_DATA = [
  "BaziReading",
  "HumanDesignReading",
  "BaziCase",
  "BaziClient",
  "IChingReading",
  "TuViReading",
  "Hexagram",
];

// Map table name to Prisma model accessor
function getModel(table: string) {
  const key = table[0].toLowerCase() + table.slice(1);
  return (pg as any)[key];
}

async function main() {
  for (const table of TABLES_WITH_DATA) {
    const rows = readTable(table);
    if (rows.length === 0) {
      console.log(`${table}: 0 rows (skip)`);
      continue;
    }

    // Check if already migrated
    const existing = await getModel(table).count();
    if (existing > 0) {
      console.log(`${table}: ${existing} rows already exist (skip)`);
      continue;
    }

    for (const row of rows) {
      fixBooleans(table, row);
      fixDates(table, row);
      await getModel(table).create({ data: row });
    }
    console.log(`${table}: ${rows.length} rows migrated`);
  }

  await pg.$disconnect();
  console.log("Done!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
