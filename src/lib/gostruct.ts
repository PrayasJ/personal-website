function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function exportedName(key: string, used: Set<string>): string {
  const cleaned = key.replace(/[^A-Za-z0-9]+/g, " ").trim();
  const parts = cleaned.length === 0 ? ["Field"] : cleaned.split(/\s+/);
  let name = parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  if (!/^[A-Za-z]/.test(name)) {
    name = `Field${name}`;
  }
  let candidate = name;
  let n = 2;
  while (used.has(candidate)) {
    candidate = `${name}${n}`;
    n += 1;
  }
  used.add(candidate);
  return candidate;
}

function goNumber(value: number): string {
  if (Number.isInteger(value) && Number.isSafeInteger(value)) {
    return "int64";
  }
  return "float64";
}

type Pending = { name: string; value: Record<string, unknown> };

function fieldType(
  value: unknown,
  parent: string,
  key: string,
  queue: Pending[],
  named: Map<string, string>,
): string {
  if (value === null || value === undefined) {
    return "any";
  }
  if (typeof value === "boolean") {
    return "bool";
  }
  if (typeof value === "number") {
    return goNumber(value);
  }
  if (typeof value === "string") {
    return "string";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]any";
    }
    const inner = fieldType(value[0], parent, key, queue, named);
    return `[]${inner}`;
  }
  if (isPlainObject(value)) {
    const typeName = uniqueTypeName(`${parent}${exportedName(key, new Set())}`, named);
    named.set(typeName, typeName);
    queue.push({ name: typeName, value });
    return typeName;
  }
  return "any";
}

function uniqueTypeName(base: string, named: Map<string, string>): string {
  let candidate = base || "Struct";
  let n = 2;
  while (named.has(candidate)) {
    candidate = `${base}${n}`;
    n += 1;
  }
  return candidate;
}

function emitStruct(name: string, value: Record<string, unknown>, queue: Pending[], named: Map<string, string>): string {
  const used = new Set<string>();
  const lines = [`type ${name} struct {`];
  const entries = Object.entries(value);
  if (entries.length === 0) {
    lines.push("}");
    return lines.join("\n");
  }
  const rows = entries.map(([key, nested]) => {
    const field = exportedName(key, used);
    const typ = fieldType(nested, name, key, queue, named);
    const tag = JSON.stringify(key).slice(1, -1);
    return { field, typ, tag };
  });
  const fieldWidth = Math.max(...rows.map((row) => row.field.length));
  const typeWidth = Math.max(...rows.map((row) => row.typ.length));
  for (const row of rows) {
    lines.push(
      `	${row.field.padEnd(fieldWidth)} ${row.typ.padEnd(typeWidth)} \`json:"${row.tag}"\``,
    );
  }
  lines.push("}");
  return lines.join("\n");
}

export function jsonToGo(value: unknown, rootName = "Root"): string {
  const named = new Map<string, string>();
  const queue: Pending[] = [];
  const structs: string[] = [];

  if (Array.isArray(value)) {
    const inner = value[0] ?? null;
    if (isPlainObject(inner)) {
      const itemName = uniqueTypeName(`${rootName}Item`, named);
      named.set(itemName, itemName);
      queue.push({ name: itemName, value: inner });
      structs.push(`type ${rootName} []${itemName}`);
    } else {
      const typ = fieldType(inner, rootName, "Item", queue, named);
      structs.push(`type ${rootName} []${typ}`);
    }
  } else if (isPlainObject(value)) {
    named.set(rootName, rootName);
    queue.push({ name: rootName, value });
  } else {
    structs.push(`type ${rootName} ${fieldType(value, rootName, "Value", queue, named)}`);
  }

  const seen = new Set<string>();
  while (queue.length > 0) {
    const next = queue.shift();
    if (!next || seen.has(next.name)) {
      continue;
    }
    seen.add(next.name);
    structs.push(emitStruct(next.name, next.value, queue, named));
  }

  return structs.join("\n\n") + "\n";
}
