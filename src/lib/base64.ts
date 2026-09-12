function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function toBase64Url(value: string): string {
  return value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return `${padded}${pad}`;
}

export function encodeUtf8Base64(input: string, urlSafe = false): string {
  const encoded = bytesToBase64(new TextEncoder().encode(input));
  return urlSafe ? toBase64Url(encoded) : encoded;
}

export function decodeUtf8Base64(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, "");
  if (trimmed.length === 0) {
    return "";
  }
  const normalized = trimmed.includes("-") || trimmed.includes("_") ? fromBase64Url(trimmed) : trimmed;
  return new TextDecoder().decode(base64ToBytes(normalized));
}
