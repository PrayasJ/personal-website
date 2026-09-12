export const MAX_TOOL_BYTES = 20 * 1024 * 1024;

export function formatBytes(value: number): string {
  if (value < 1024) {
    return `${value} B`;
  }
  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

export function copyBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export function bytesBlob(bytes: Uint8Array, type: string): Blob {
  return new Blob([copyBuffer(bytes)], { type });
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function downloadBytes(bytes: Uint8Array, name: string, type: string) {
  downloadBlob(bytesBlob(bytes, type), name);
}

export async function readFileBuffer(file: File): Promise<ArrayBuffer> {
  if (file.size > MAX_TOOL_BYTES) {
    throw new Error(`Keep files under ${formatBytes(MAX_TOOL_BYTES)}.`);
  }
  return file.arrayBuffer();
}

export function revokeUrl(url: string | null | undefined) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

export function objectUrl(blob: Blob, previous?: string | null): string {
  revokeUrl(previous);
  return URL.createObjectURL(blob);
}

export function stem(name: string): string {
  return name.replace(/\.[^.]+$/, "") || "file";
}
