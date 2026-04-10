function required(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

export function buildDatabaseUrl(direct = false): string {
  const password = required("SUPABASE_DB_PASSWORD");
  const db = required("SUPABASE_DB_NAME");

  const host = direct
    ? process.env["SUPABASE_DB_HOST_DIRECT"] ?? required("SUPABASE_DB_HOST")
    : required("SUPABASE_DB_HOST");
  const user = direct
    ? process.env["SUPABASE_DB_USER_DIRECT"] ?? required("SUPABASE_DB_USER")
    : required("SUPABASE_DB_USER");
  const port = direct
    ? process.env["SUPABASE_DB_PORT_DIRECT"] ?? "5432"
    : process.env["SUPABASE_DB_PORT"] ?? "6543";

  return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${db}`;
}
