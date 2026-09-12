function words(input: string): string[] {
  const spaced = input
    .replace(/['’]/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .replace(/[^A-Za-z0-9]+/g, " ");
  return spaced
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function cap(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export type CaseName =
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "title"
  | "slug";

export function convertCase(input: string, name: CaseName): string {
  const parts = words(input);
  if (parts.length === 0) {
    return "";
  }
  switch (name) {
    case "camel":
      return parts[0] + parts.slice(1).map(cap).join("");
    case "pascal":
      return parts.map(cap).join("");
    case "snake":
      return parts.join("_");
    case "kebab":
      return parts.join("-");
    case "constant":
      return parts.map((part) => part.toUpperCase()).join("_");
    case "title":
      return parts.map(cap).join(" ");
    case "slug":
      return parts.join("-");
    default:
      return input;
  }
}

export const caseLabels: Record<CaseName, string> = {
  camel: "camelCase",
  pascal: "PascalCase",
  snake: "snake_case",
  kebab: "kebab-case",
  constant: "CONSTANT_CASE",
  title: "Title Case",
  slug: "slug",
};
