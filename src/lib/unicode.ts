export type CodePoint = {
  char: string;
  hex: string;
  dec: number;
  utf8: string;
};

export function inspectUnicode(input: string): CodePoint[] {
  const encoder = new TextEncoder();
  return Array.from(input).slice(0, 400).map((char) => {
    const code = char.codePointAt(0) ?? 0;
    const bytes = encoder.encode(char);
    const utf8 = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join(" ");
    return {
      char: char === " " ? "␣" : char === "\n" ? "↵" : char,
      hex: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
      dec: code,
      utf8,
    };
  });
}

export function textToHex(input: string): string {
  return [...new TextEncoder().encode(input)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");
}

export function hexToText(input: string): string {
  const hex = input.trim().replace(/^0x/i, "").replace(/[\s,:-]/g, "");
  if (hex.length === 0) {
    return "";
  }
  if (hex.length % 2 !== 0 || /[^0-9a-fA-F]/.test(hex)) {
    throw new Error("Hex must be an even number of 0-9 a-f characters.");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}
