function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function formatKey(key: string): string {
  if (key.length === 0) {
    return '""';
  }
  if (/^[A-Za-z_][A-Za-z0-9_-]*$/.test(key)) {
    return key;
  }
  return JSON.stringify(key);
}

function formatScalar(value: string): string {
  if (value === "") {
    return '""';
  }
  if (/^(?:true|false|null|~|yes|no|on|off)$/i.test(value)) {
    return JSON.stringify(value);
  }
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value)) {
    return JSON.stringify(value);
  }
  if (/[:#{}[\],&*!|>'"%@`]/.test(value) || /^\s|\s$/.test(value) || /[\n\r]/.test(value)) {
    return JSON.stringify(value);
  }
  return value;
}

function dump(value: unknown, indent: number): string {
  const pad = "  ".repeat(indent);

  if (value === null || value === undefined) {
    return "null";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "null";
  }
  if (typeof value === "string") {
    return formatScalar(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    return value
      .map((item) => {
        const dumped = dump(item, indent + 1);
        if (isPlainObject(item) && Object.keys(item).length > 0) {
          const [first, ...rest] = dumped.split("\n");
          const head = `${pad}- ${first.trimStart()}`;
          if (rest.length === 0) {
            return head;
          }
          return [head, ...rest].join("\n");
        }
        if (Array.isArray(item) && item.length > 0) {
          return `${pad}-\n${dumped}`;
        }
        return `${pad}- ${dumped}`;
      })
      .join("\n");
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return "{}";
    }
    return entries
      .map(([key, nested]) => {
        const safeKey = formatKey(key);
        const nestedIsEmptyArray = Array.isArray(nested) && nested.length === 0;
        const nestedIsEmptyObject = isPlainObject(nested) && Object.keys(nested).length === 0;
        if (
          nested !== null &&
          typeof nested === "object" &&
          !nestedIsEmptyArray &&
          !nestedIsEmptyObject
        ) {
          return `${pad}${safeKey}:\n${dump(nested, indent + 1)}`;
        }
        return `${pad}${safeKey}: ${dump(nested, indent + 1)}`;
      })
      .join("\n");
  }

  return formatScalar(String(value));
}

export function jsonToYaml(value: unknown): string {
  const body = dump(value, 0);
  return body.endsWith("\n") ? body : `${body}\n`;
}

type Line = {
  indent: number;
  text: string;
};

function stripComment(text: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (ch === "#" && !inSingle && !inDouble) {
      return text.slice(0, i).trimEnd();
    }
  }
  return text;
}

function parseScalar(raw: string): unknown {
  const text = raw.trim();
  if (text === "" || text === "~" || text === "null") {
    return null;
  }
  if (text === "true" || text === "True" || text === "TRUE") {
    return true;
  }
  if (text === "false" || text === "False" || text === "FALSE") {
    return false;
  }
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    try {
      if (text.startsWith("'")) {
        return text.slice(1, -1).replace(/''/g, "'");
      }
      return JSON.parse(text) as string;
    } catch {
      return text.slice(1, -1);
    }
  }
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(text)) {
    return Number(text);
  }
  return text;
}

function splitPair(text: string): { key: string; value: string | null } | null {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (ch === ":" && !inSingle && !inDouble) {
      const next = text[i + 1];
      if (next === undefined || next === " " || next === "\t") {
        const key = parseScalar(text.slice(0, i));
        if (typeof key !== "string" && typeof key !== "number") {
          return null;
        }
        const rest = text.slice(i + 1).trim();
        return { key: String(key), value: rest.length === 0 ? null : rest };
      }
    }
  }
  return null;
}

function parseBlock(lines: Line[], start: number, indent: number): { value: unknown; next: number } {
  if (start >= lines.length || lines[start].indent < indent) {
    return { value: null, next: start };
  }

  const first = lines[start];

  if (first.text.startsWith("- ") || first.text === "-") {
    const items: unknown[] = [];
    let index = start;
    while (
      index < lines.length &&
      lines[index].indent === first.indent &&
      (lines[index].text.startsWith("- ") || lines[index].text === "-")
    ) {
      const rest = lines[index].text === "-" ? "" : lines[index].text.slice(2).trim();
      index += 1;
      if (rest.length === 0) {
        if (index < lines.length && lines[index].indent > first.indent) {
          const nested = parseBlock(lines, index, lines[index].indent);
          items.push(nested.value);
          index = nested.next;
        } else {
          items.push(null);
        }
        continue;
      }
      const pair = splitPair(rest);
      if (!pair) {
        items.push(parseScalar(rest));
        continue;
      }
      const record: Record<string, unknown> = {};
      if (pair.value !== null) {
        record[pair.key] = parseScalar(pair.value);
      }
      if (index < lines.length && lines[index].indent > first.indent) {
        const nested = parseBlock(lines, index, lines[index].indent);
        if (pair.value === null) {
          record[pair.key] = nested.value;
        } else if (isPlainObject(nested.value)) {
          Object.assign(record, nested.value);
        }
        index = nested.next;
      } else if (pair.value === null) {
        record[pair.key] = null;
      }
      items.push(record);
    }
    return { value: items, next: index };
  }

  const record: Record<string, unknown> = {};
  let index = start;
  while (index < lines.length && lines[index].indent === indent) {
    const pair = splitPair(lines[index].text);
    if (!pair) {
      throw new Error(`Could not parse YAML mapping at "${lines[index].text}".`);
    }
    index += 1;
    if (pair.value !== null) {
      record[pair.key] = parseScalar(pair.value);
      continue;
    }
    if (index < lines.length && lines[index].indent > indent) {
      const nested = parseBlock(lines, index, lines[index].indent);
      record[pair.key] = nested.value;
      index = nested.next;
    } else {
      record[pair.key] = null;
    }
  }
  return { value: record, next: index };
}

export function yamlToValue(input: string): unknown {
  const source = input.replace(/^\uFEFF/, "");
  const trimmed = source.trim();
  if (trimmed.length === 0) {
    throw new Error("YAML is empty.");
  }
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed) as unknown;
  }

  const lines: Line[] = [];
  for (const raw of source.split(/\r?\n/)) {
    const withoutComment = stripComment(raw);
    if (withoutComment.trim().length === 0) {
      continue;
    }
    const indentMatch = withoutComment.match(/^ */)?.[0].length ?? 0;
    lines.push({
      indent: indentMatch,
      text: withoutComment.trim(),
    });
  }

  if (lines.length === 0) {
    throw new Error("YAML is empty.");
  }

  if (lines.length === 1 && !lines[0].text.includes(":") && !lines[0].text.startsWith("-")) {
    return parseScalar(lines[0].text);
  }

  const parsed = parseBlock(lines, 0, lines[0].indent);
  return parsed.value;
}
