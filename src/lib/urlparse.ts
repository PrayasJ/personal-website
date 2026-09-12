export type QueryPair = { key: string; value: string };

export type InspectedUrl = {
  href: string;
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: QueryPair[];
};

function coerceUrl(raw: string): URL {
  const trimmed = raw.trim();
  if (trimmed.startsWith("?")) {
    return new URL(`https://example.invalid/${trimmed}`);
  }
  try {
    return new URL(trimmed);
  } catch {
    return new URL(`https://${trimmed}`);
  }
}

export function inspectUrl(raw: string): InspectedUrl {
  const url = coerceUrl(raw);
  const params: QueryPair[] = [];
  url.searchParams.forEach((value, key) => {
    params.push({ key, value });
  });
  return {
    href: url.href,
    protocol: url.protocol,
    username: url.username,
    password: url.password ? "••••" : "",
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    origin: url.origin,
    params,
  };
}

export function buildQuery(pairs: QueryPair[]): string {
  const params = new URLSearchParams();
  for (const pair of pairs) {
    if (pair.key === "" && pair.value === "") {
      continue;
    }
    params.append(pair.key, pair.value);
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : "";
}
