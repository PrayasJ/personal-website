const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

export type HashAlgorithm = (typeof ALGORITHMS)[number];

export const hashAlgorithms: HashAlgorithm[] = [...ALGORITHMS];

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function digestHex(algorithm: HashAlgorithm, input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest(algorithm, bytes);
  return toHex(digest);
}

export async function hmacHex(
  algorithm: HashAlgorithm,
  secret: string,
  input: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: { name: algorithm } },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input));
  return toHex(signature);
}
