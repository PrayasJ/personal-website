import { downloadBlob } from "@/lib/files";

export type ImageFormat = "image/png" | "image/jpeg" | "image/webp";

export const imageFormats: { value: ImageFormat; label: string; ext: string }[] = [
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

export function extFor(format: ImageFormat): string {
  return imageFormats.find((item) => item.value === format)?.ext ?? "png";
}

export async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas is not available in this browser.");
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas;
}

export function cloneCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }
  ctx.drawImage(source, 0, 0);
  return canvas;
}

export function resizeCanvas(
  source: HTMLCanvasElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  if (!(width > 0) || !(height > 0) || width > 8192 || height > 8192) {
    throw new Error("Width and height must be between 1 and 8192.");
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function cropCanvas(
  source: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number,
): HTMLCanvasElement {
  const left = Math.max(0, Math.round(x));
  const top = Math.max(0, Math.round(y));
  const w = Math.min(Math.round(width), source.width - left);
  const h = Math.min(Math.round(height), source.height - top);
  if (!(w > 0) || !(h > 0)) {
    throw new Error("Crop rectangle is empty.");
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }
  ctx.drawImage(source, left, top, w, h, 0, 0, w, h);
  return canvas;
}

export function fitMaxEdge(source: HTMLCanvasElement, maxEdge: number): HTMLCanvasElement {
  if (!(maxEdge > 0)) {
    return cloneCanvas(source);
  }
  const edge = Math.max(source.width, source.height);
  if (edge <= maxEdge) {
    return cloneCanvas(source);
  }
  const scale = maxEdge / edge;
  return resizeCanvas(source, source.width * scale, source.height * scale);
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: ImageFormat,
  quality = 0.82,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`This browser could not encode ${type}.`));
          return;
        }
        resolve(blob);
      },
      type,
      type === "image/png" ? undefined : quality,
    );
  });
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  name: string,
  type: ImageFormat,
  quality = 0.82,
) {
  const blob = await canvasToBlob(canvas, type, quality);
  downloadBlob(blob, name);
}

export async function canvasPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await canvasToBlob(canvas, "image/png");
  return new Uint8Array(await blob.arrayBuffer());
}

export function canvasPreviewUrl(
  canvas: HTMLCanvasElement,
  maxEdge = 720,
): string {
  const edge = Math.max(canvas.width, canvas.height);
  const scaled = edge > maxEdge ? fitMaxEdge(canvas, maxEdge) : canvas;
  return scaled.toDataURL("image/png");
}

export function buildIco(
  pngs: { width: number; height: number; data: Uint8Array }[],
): Blob {
  const count = pngs.length;
  const header = 6 + 16 * count;
  let offset = header;
  const entries = pngs.map((png) => {
    const entry = {
      width: png.width >= 256 ? 0 : png.width,
      height: png.height >= 256 ? 0 : png.height,
      size: png.data.length,
      offset,
    };
    offset += png.data.length;
    return entry;
  });
  const out = new Uint8Array(offset);
  const view = new DataView(out.buffer);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, count, true);
  entries.forEach((entry, index) => {
    const at = 6 + index * 16;
    out[at] = entry.width;
    out[at + 1] = entry.height;
    out[at + 2] = 0;
    out[at + 3] = 0;
    view.setUint16(at + 4, 1, true);
    view.setUint16(at + 6, 32, true);
    view.setUint32(at + 8, entry.size, true);
    view.setUint32(at + 12, entry.offset, true);
  });
  entries.forEach((entry, index) => {
    out.set(pngs[index].data, entry.offset);
  });
  return new Blob([out], { type: "image/x-icon" });
}
