export type TextStats = {
  characters: number;
  charactersNoSpace: number;
  words: number;
  lines: number;
  bytes: number;
};

export function textStats(input: string): TextStats {
  const words = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;
  return {
    characters: input.length,
    charactersNoSpace: input.replace(/\s/g, "").length,
    words,
    lines: input.length === 0 ? 0 : input.split("\n").length,
    bytes: new TextEncoder().encode(input).length,
  };
}

export function sortLines(input: string, unique: boolean): string {
  const lines = input.split("\n");
  const sorted = [...lines].sort((a, b) => a.localeCompare(b));
  const next = unique ? Array.from(new Set(sorted)) : sorted;
  return next.join("\n");
}

export function reverseLines(input: string): string {
  return input.split("\n").reverse().join("\n");
}
