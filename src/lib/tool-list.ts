import type { ToolCategory } from "@/lib/site";

/** Card / search fields only — keep SEO blobs off the client. */
export type ToolListItem = {
  slug: string;
  name: string;
  description: string;
  path: string;
  category: ToolCategory;
  keywords: string[];
  popular?: boolean;
};

export function matchToolListItem(
  tool: ToolListItem,
  query: string,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  const terms = normalized.split(/\s+/);
  const haystack = [tool.name, tool.description, tool.category, ...tool.keywords]
    .join(" ")
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
}
