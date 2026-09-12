import { decodeUtf8Base64 } from "@/lib/base64";

export type JwtPart = {
  raw: string;
  json: string;
  value: unknown;
};

export type JwtClaimRow = {
  name: string;
  value: string;
  note?: string;
};

export type JwtDecodeResult =
  | {
      ok: true;
      header: JwtPart;
      payload: JwtPart;
      signature: string;
      claims: JwtClaimRow[];
      expired?: boolean;
    }
  | { ok: false; error: string };

function decodePart(raw: string, label: string): JwtPart {
  const json = decodeUtf8Base64(raw);
  try {
    const value: unknown = JSON.parse(json);
    return {
      raw,
      json: JSON.stringify(value, null, 2),
      value,
    };
  } catch {
    throw new Error(`${label} is not valid JSON.`);
  }
}

function formatClaimTime(value: unknown): string | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  const millis = Math.abs(value) >= 1e12 ? value : value * 1000;
  const date = new Date(millis);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString();
}

export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste a JWT to decode it." };
  }
  const parts = trimmed.split(".");
  if (parts.length < 2) {
    return { ok: false, error: "A JWT has at least two segments separated by dots." };
  }

  try {
    const header = decodePart(parts[0], "Header");
    const payload = decodePart(parts[1], "Payload");
    const signature = parts.slice(2).join(".") || "";
    const claims: JwtClaimRow[] = [];
    let expired = false;

    if (payload.value && typeof payload.value === "object" && !Array.isArray(payload.value)) {
      const record = payload.value as Record<string, unknown>;
      for (const name of ["iss", "sub", "aud", "jti"]) {
        if (record[name] != null) {
          claims.push({ name, value: String(record[name]) });
        }
      }
      for (const name of ["exp", "nbf", "iat"]) {
        if (record[name] != null) {
          const iso = formatClaimTime(record[name]);
          claims.push({
            name,
            value: String(record[name]),
            note: iso,
          });
          if (name === "exp") {
            const exp = record[name];
            if (typeof exp === "number") {
              const millis = Math.abs(exp) >= 1e12 ? exp : exp * 1000;
              expired = millis < Date.now();
            }
          }
        }
      }
    }

    return { ok: true, header, payload, signature, claims, expired };
  } catch (caught) {
    return {
      ok: false,
      error: caught instanceof Error ? caught.message : "The token could not be decoded.",
    };
  }
}
