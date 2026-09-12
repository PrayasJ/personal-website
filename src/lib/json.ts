export type JsonIssue = {
  title: string;
  hint: string;
  technical: string;
  position?: number;
  line?: number;
  column?: number;
};

export type JsonSuccess = {
  ok: true;
  value: unknown;
  pretty: string;
  minified: string;
};

export type JsonFailure = {
  ok: false;
  error: JsonIssue;
};

export type JsonResult = JsonSuccess | JsonFailure;

function stripBom(input: string): string {
  return input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
}

export function isBlankJson(input: string): boolean {
  return stripBom(input).trim().length === 0;
}

function positionToLineCol(text: string, position: number): {
  line: number;
  column: number;
} {
  const safe = Math.max(0, Math.min(position, text.length));
  const prefix = text.slice(0, safe);
  const lines = prefix.split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function extractPosition(message: string, input: string): {
  position?: number;
  line?: number;
  column?: number;
} {
  const positionMatch = message.match(/position\s+(\d+)/i);
  if (positionMatch) {
    const position = Number(positionMatch[1]);
    const { line, column } = positionToLineCol(input, position);
    return { position, line, column };
  }

  const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColMatch) {
    const line = Number(lineColMatch[1]);
    const column = Number(lineColMatch[2]);
    const lines = input.split("\n");
    let position = 0;
    for (let i = 0; i < line - 1 && i < lines.length; i += 1) {
      position += lines[i].length + 1;
    }
    position += Math.max(column - 1, 0);
    return { position, line, column };
  }

  return {};
}

function friendlyHint(message: string, location?: { position?: number }): string {
  const lower = message.toLowerCase();
  const near =
    location?.position != null
      ? ` There appears to be an error near character ${location.position}.`
      : "";

  if (lower.includes("unexpected end") || lower.includes("unterminated")) {
    return "The JSON looks incomplete. A string, array or object may be missing a closing quote, bracket or brace.";
  }
  if (lower.includes("expected property name") || lower.includes("expected ',' or '}'") || lower.includes("expected ',' or ']'")) {
    return "The JSON looks incomplete or has a trailing comma. Check for a missing closing bracket or an extra comma before a closing brace.";
  }
  if (lower.includes("bad control character") || lower.includes("control character")) {
    return "A string contains an unescaped control character. Newlines inside strings must be written as \\n.";
  }
  if (lower.includes("unexpected non-whitespace") || lower.includes("after json")) {
    return "There is extra text after a complete JSON value. Remove trailing characters or wrap multiple values in an array.";
  }
  if (lower.includes("unexpected token") || lower.includes("unexpected character") || lower.includes("unexpected identifier")) {
    return `Check the brackets, quotes and commas in your JSON.${near}`;
  }

  return `Check the brackets, quotes and commas in your JSON.${near}`;
}

export function parseJson(input: string): JsonResult {
  const source = stripBom(input);
  if (source.trim().length === 0) {
    return {
      ok: false,
      error: {
        title: "JSON is empty",
        hint: "Paste JSON into the input area, then format, minify or validate.",
        technical: "No JSON text was provided.",
      },
    };
  }

  try {
    const value = JSON.parse(source) as unknown;
    return {
      ok: true,
      value,
      pretty: JSON.stringify(value, null, 2),
      minified: JSON.stringify(value),
    };
  } catch (caught) {
    const technical =
      caught instanceof Error ? caught.message : "The JSON could not be parsed.";
    const location = extractPosition(technical, source);
    return {
      ok: false,
      error: {
        title: "Invalid JSON",
        hint: friendlyHint(technical, location),
        technical,
        ...location,
      },
    };
  }
}

export function countLines(input: string): number {
  if (input.length === 0) {
    return 0;
  }
  return input.split("\n").length;
}
