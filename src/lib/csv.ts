const ROW_CAP = 2000;

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      if (rows.length >= ROW_CAP) {
        break;
      }
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((entry) => entry.some((cell) => cell.length > 0));
}

export function csvToJson(text: string, headerRow: boolean): unknown {
  const rows = parseCsv(text);
  if (rows.length === 0) {
    return [];
  }
  if (!headerRow) {
    return rows;
  }
  const [header, ...body] = rows;
  return body.map((line) => {
    const record: Record<string, string> = {};
    header.forEach((key, index) => {
      record[key || `col${index + 1}`] = line[index] ?? "";
    });
    return record;
  });
}

function escapeCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function jsonToCsv(raw: string): string {
  const value = JSON.parse(raw) as unknown;
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("JSON must be a non-empty array.");
  }
  if (Array.isArray(value[0])) {
    return (value as unknown[][])
      .map((row) => row.map((cell) => escapeCell(String(cell ?? ""))).join(","))
      .join("\n");
  }
  if (value.every((row) => row && typeof row === "object" && !Array.isArray(row))) {
    const keys = Array.from(
      new Set((value as Record<string, unknown>[]).flatMap((row) => Object.keys(row))),
    );
    const lines = [
      keys.map(escapeCell).join(","),
      ...(value as Record<string, unknown>[]).map((row) =>
        keys.map((key) => escapeCell(String(row[key] ?? ""))).join(","),
      ),
    ];
    return lines.join("\n");
  }
  throw new Error("Use an array of objects or an array of arrays.");
}
