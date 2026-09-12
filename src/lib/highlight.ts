export type HighlightKind =
  | "text"
  | "key"
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "comment"
  | "punct"
  | "keyword"
  | "type"
  | "header"
  | "payload"
  | "signature"
  | "escape"
  | "hit0"
  | "hit1"
  | "hit2";

export type HighlightToken = { kind: HighlightKind; value: string };

export type HighlightLang = "json" | "yaml" | "go" | "ts" | "jwt" | "url" | "plain";

function push(tokens: HighlightToken[], kind: HighlightKind, value: string) {
  if (!value) {
    return;
  }
  const last = tokens[tokens.length - 1];
  if (last && last.kind === kind) {
    last.value += value;
    return;
  }
  tokens.push({ kind, value });
}

function tokenizeByRegex(
  source: string,
  rules: Array<{ kind: HighlightKind; pattern: RegExp }>,
): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  let cursor = 0;
  const combined = new RegExp(rules.map((rule) => `(${rule.pattern.source})`).join("|"), "gm");
  combined.lastIndex = 0;
  for (const match of source.matchAll(combined)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      push(tokens, "text", source.slice(cursor, index));
    }
    const kind = rules[match.findIndex((part, i) => i > 0 && part != null) - 1]?.kind ?? "text";
    push(tokens, kind, match[0]);
    cursor = index + match[0].length;
  }
  if (cursor < source.length) {
    push(tokens, "text", source.slice(cursor));
  }
  return tokens;
}

export function tokenizeJson(source: string): HighlightToken[] {
  return tokenizeByRegex(source, [
    { kind: "key", pattern: /"(?:\\.|[^"\\])*"(?=\s*:)/ },
    { kind: "string", pattern: /"(?:\\.|[^"\\])*"/ },
    { kind: "number", pattern: /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/ },
    { kind: "boolean", pattern: /\b(?:true|false)\b/ },
    { kind: "null", pattern: /\bnull\b/ },
    { kind: "punct", pattern: /[{}\[\]:,]/ },
  ]);
}

export function tokenizeYaml(source: string): HighlightToken[] {
  return tokenizeByRegex(source, [
    { kind: "comment", pattern: /#[^\n]*/ },
    { kind: "key", pattern: /^[ \t-]*[^:#\n][^:\n]*(?=:)/m },
    { kind: "string", pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
    { kind: "number", pattern: /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/ },
    { kind: "boolean", pattern: /\b(?:true|false|yes|no|on|off)\b/i },
    { kind: "null", pattern: /\b(?:null|~)\b/ },
    { kind: "punct", pattern: /[:\-\[\]{},|>]/ },
  ]);
}

export function tokenizeGo(source: string): HighlightToken[] {
  return tokenizeByRegex(source, [
    { kind: "keyword", pattern: /\b(?:type|struct|json)\b/ },
    { kind: "type", pattern: /\b(?:string|int64|float64|bool|any|int|float32)\b/ },
    { kind: "string", pattern: /`[^`]*`|"(?:\\.|[^"\\])*"/ },
    { kind: "punct", pattern: /[{}\[\]:,]/ },
  ]);
}

export function tokenizeTs(source: string): HighlightToken[] {
  return tokenizeByRegex(source, [
    { kind: "keyword", pattern: /\b(?:export|interface|type)\b/ },
    { kind: "type", pattern: /\b(?:string|number|boolean|null|unknown)\b/ },
    { kind: "string", pattern: /"(?:\\.|[^"\\])*"/ },
    { kind: "punct", pattern: /[{}\[\]:;,]/ },
  ]);
}

export function tokenizeJwt(source: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const parts = source.trim().split(".");
  const kinds: HighlightKind[] = ["header", "payload", "signature"];
  parts.forEach((part, index) => {
    if (index > 0) {
      push(tokens, "punct", ".");
    }
    push(tokens, kinds[Math.min(index, 2)], part);
  });
  return tokens;
}

export function tokenizeUrl(source: string): HighlightToken[] {
  return tokenizeByRegex(source, [
    { kind: "escape", pattern: /%[0-9A-Fa-f]{2}/ },
    { kind: "key", pattern: /[?&#][^=&#\s]+(?==)/ },
    { kind: "punct", pattern: /[:/?#[\]@!$&'()*+,;=]/ },
  ]);
}

export function tokenize(source: string, lang: HighlightLang): HighlightToken[] {
  if (!source) {
    return [];
  }
  switch (lang) {
    case "json":
      return tokenizeJson(source);
    case "yaml":
      return tokenizeYaml(source);
    case "go":
      return tokenizeGo(source);
    case "ts":
      return tokenizeTs(source);
    case "jwt":
      return tokenizeJwt(source);
    case "url":
      return tokenizeUrl(source);
    default:
      return [{ kind: "text", value: source }];
  }
}

export function tokenizeMatches(source: string, matches: Array<{ index: number; value: string }>): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const sorted = [...matches]
    .filter((match) => match.value.length > 0 && match.index >= 0)
    .sort((a, b) => a.index - b.index);
  let cursor = 0;
  let hit = 0;
  for (const match of sorted) {
    if (match.index < cursor) {
      continue;
    }
    if (match.index > cursor) {
      push(tokens, "text", source.slice(cursor, match.index));
    }
    const kind = (`hit${hit % 3}` as HighlightKind);
    push(tokens, kind, match.value);
    cursor = match.index + match.value.length;
    hit += 1;
  }
  if (cursor < source.length) {
    push(tokens, "text", source.slice(cursor));
  }
  return tokens;
}

export function tokenizeUlid(value: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  const raw = value.trim();
  push(tokens, "header", raw.slice(0, 10));
  push(tokens, "type", raw.slice(10));
  return tokens;
}

export function tokenizeUuid(value: string): HighlightToken[] {
  const kinds: HighlightKind[] = ["header", "string", "number", "keyword", "type"];
  if (value.includes("-")) {
    const tokens: HighlightToken[] = [];
    value.split("-").forEach((part, index) => {
      if (index > 0) {
        push(tokens, "punct", "-");
      }
      push(tokens, kinds[index] ?? "text", part);
    });
    return tokens;
  }
  const sizes = [8, 4, 4, 4, 12];
  const tokens: HighlightToken[] = [];
  let cursor = 0;
  sizes.forEach((size, index) => {
    push(tokens, kinds[index], value.slice(cursor, cursor + size));
    cursor += size;
  });
  if (cursor < value.length) {
    push(tokens, "text", value.slice(cursor));
  }
  return tokens;
}

export function tokenizeCron(expression: string): HighlightToken[] {
  const kinds: HighlightKind[] = ["number", "string", "keyword", "header", "type"];
  const tokens: HighlightToken[] = [];
  expression.split(/(\s+)/).forEach((part) => {
    if (/^\s+$/.test(part)) {
      push(tokens, "text", part);
      return;
    }
    const index = tokens.filter((token) => token.kind !== "text").length;
    push(tokens, kinds[index] ?? "text", part);
  });
  return tokens;
}
