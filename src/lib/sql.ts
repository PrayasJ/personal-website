import { format as formatSqlLib } from "sql-formatter";

export type SqlDialect = "sql" | "postgresql" | "mysql" | "sqlite";

export const sqlDialects: { value: SqlDialect; label: string }[] = [
  { value: "sql", label: "Standard SQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
];

export function formatSql(
  input: string,
  dialect: SqlDialect,
): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste some SQL first." };
  }
  try {
    const value = formatSqlLib(trimmed, {
      language: dialect,
      tabWidth: 2,
      keywordCase: "upper",
    });
    return { ok: true, value: `${value}\n` };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "Could not format SQL.",
    };
  }
}
