export type QueryPair = { key: string; value: string };

export function parseQuery(raw: string): QueryPair[] {
  const trimmed = raw.trim().replace(/^[?#]/, "");
  if (!trimmed) {
    return [];
  }
  const params = new URLSearchParams(trimmed);
  return [...params.entries()].map(([key, value]) => ({ key, value }));
}

export function buildQuery(pairs: QueryPair[], question = true): string {
  const params = new URLSearchParams();
  for (const pair of pairs) {
    if (!pair.key.trim() && !pair.value) {
      continue;
    }
    params.append(pair.key, pair.value);
  }
  const encoded = params.toString();
  if (!encoded) {
    return "";
  }
  return question ? `?${encoded}` : encoded;
}
