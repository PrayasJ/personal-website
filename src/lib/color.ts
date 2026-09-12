export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

export function parseHex(input: string): Rgb {
  const hex = input.trim().replace(/^#/, "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error("Use a 3- or 6-digit hex color.");
  }
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const part = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === nr) {
      h = ((ng - nb) / delta) % 6;
    } else if (max === ng) {
      h = (nb - nr) / delta + 2;
    } else {
      h = (nr - ng) / delta + 4;
    }
  }
  h = Math.round(((h * 60) + 360) % 360);
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sat = s / 100;
  const lig = l / 100;
  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lig - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function parseRgb(input: string): Rgb {
  const match = input.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) {
    throw new Error("Use rgb(r, g, b).");
  }
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}
