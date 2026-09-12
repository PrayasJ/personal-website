function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function typeName(key: string, used: Set<string>): string {
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

function tsIdent(key: string): string {
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    return key;
  }
  return JSON.stringify(key);
}

function tsNumber(value: number): string {
  if (Number.isInteger(value) && Number.isSafeInteger(value)) {
    return "number";
  }
  return "number";
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
    return "null";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  if (typeof value === "number") {
    return tsNumber(value);
  }
  if (typeof value === "string") {
    return "string";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "unknown[]";
    }
    const inner = fieldType(value[0], parent, key, queue, named);
    return `${inner}[]`;
  }
  if (isPlainObject(value)) {
    const name = uniqueTypeName(`${parent}${typeName(key, new Set())}`, named);
    named.set(name, name);
    queue.push({ name, value });
    return name;
  }
  return "unknown";
}

function uniqueTypeName(base: string, named: Map<string, string>): string {
  let candidate = base || "Model";
  let n = 2;
  while (named.has(candidate)) {
    candidate = `${base}${n}`;
    n += 1;
  }
  return candidate;
}

function emitInterface(
  name: string,
  value: Record<string, unknown>,
  queue: Pending[],
  named: Map<string, string>,
): string {
  const lines = [`export interface ${name} {`];
  const entries = Object.entries(value);
  if (entries.length === 0) {
    lines.push("}");
    return lines.join("\n");
  }
  for (const [key, nested] of entries) {
    const typ = fieldType(nested, name, key, queue, named);
    lines.push(`  ${tsIdent(key)}: ${typ};`);
  }
  lines.push("}");
  return lines.join("\n");
}

export function jsonToTs(value: unknown, rootName = "Root"): string {
  const named = new Map<string, string>();
  const queue: Pending[] = [];
  const parts: string[] = [];

  if (Array.isArray(value)) {
    const inner = value[0] ?? null;
    if (isPlainObject(inner)) {
      const itemName = uniqueTypeName(`${rootName}Item`, named);
      named.set(itemName, itemName);
      queue.push({ name: itemName, value: inner });
      parts.push(`export type ${rootName} = ${itemName}[];`);
    } else {
      const typ = fieldType(inner, rootName, "Item", queue, named);
      parts.push(`export type ${rootName} = ${typ}[];`);
    }
  } else if (isPlainObject(value)) {
    named.set(rootName, rootName);
    queue.push({ name: rootName, value });
  } else {
    parts.push(
      `export type ${rootName} = ${fieldType(value, rootName, "Value", queue, named)};`,
    );
  }

  const seen = new Set<string>();
  while (queue.length > 0) {
    const next = queue.shift();
    if (!next || seen.has(next.name)) {
      continue;
    }
    seen.add(next.name);
    parts.push(emitInterface(next.name, next.value, queue, named));
  }

  return `${parts.join("\n\n")}\n`;
}
