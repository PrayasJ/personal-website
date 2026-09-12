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

export type CompressToMaxBytesResult = {
  blob: Blob;
  canvas: HTMLCanvasElement;
  quality: number;
  width: number;
  height: number;
  bytes: number;
};

export type CompressToMaxBytesOptions = {
  maxBytes: number;
  mime?: "image/jpeg" | "image/webp";
  /** Starting max long edge before quality search. Defaults to source edge. */
  startMaxEdge?: number;
  /** Smallest long edge to try when quality alone is not enough. */
  minEdge?: number;
};

/**
 * Encode until blob.size <= maxBytes. Binary-searches JPEG/WebP quality, then
 * downscales the long edge if needed. Throws if the target cannot be reached.
 */
export async function compressToMaxBytes(
  source: HTMLCanvasElement,
  options: CompressToMaxBytesOptions,
): Promise<CompressToMaxBytesResult> {
  const maxBytes = options.maxBytes;
  if (!(maxBytes > 0)) {
    throw new Error("Target size must be positive.");
  }
  const mime = options.mime ?? "image/jpeg";
  const minEdge = Math.max(32, options.minEdge ?? 320);
  let edge = Math.max(
    source.width,
    source.height,
    options.startMaxEdge ?? Math.max(source.width, source.height),
  );
  edge = Math.min(edge, Math.max(source.width, source.height));

  let best: CompressToMaxBytesResult | null = null;

  while (edge >= minEdge) {
    const sized = fitMaxEdge(source, edge);
    let lo = 0.08;
    let hi = 0.95;
    let localBest: CompressToMaxBytesResult | null = null;

    for (let step = 0; step < 10; step += 1) {
      const quality = (lo + hi) / 2;
      const blob = await canvasToBlob(sized, mime, quality);
      if (blob.size <= maxBytes) {
        localBest = {
          blob,
          canvas: sized,
          quality,
          width: sized.width,
          height: sized.height,
          bytes: blob.size,
        };
        lo = quality;
      } else {
        hi = quality;
      }
    }

    if (localBest) {
      best = localBest;
      break;
    }

    // Still too large at lowest quality — shrink and retry.
    const next = Math.floor(edge * 0.75);
    if (next >= edge) {
      break;
    }
    edge = next;
  }

  // Final attempt at minEdge + floor quality.
  if (!best) {
    const sized = fitMaxEdge(source, minEdge);
    const blob = await canvasToBlob(sized, mime, 0.08);
    if (blob.size <= maxBytes) {
      best = {
        blob,
        canvas: sized,
        quality: 0.08,
        width: sized.width,
        height: sized.height,
        bytes: blob.size,
      };
    }
  }

  if (!best) {
    throw new Error(
      `Could not reach ${Math.round(maxBytes / 1024)} KB. Try a smaller photo or a different format.`,
    );
  }
  return best;
}

export type PhotoPreset = {
  id: string;
  label: string;
  width: number;
  height: number;
  hint: string;
};

/** Common photo sizes in pixels (not official exam requirements). */
export const passportPresets: PhotoPreset[] = [
  {
    id: "35x45-300",
    label: "35 × 45 mm",
    width: 413,
    height: 531,
    hint: "Common Indian passport / form size at ~300 dpi",
  },
  {
    id: "2x2-300",
    label: "2 × 2 inch",
    width: 600,
    height: 600,
    hint: "Common US-style square photo at ~300 dpi",
  },
  {
    id: "51x51-300",
    label: "51 × 51 mm",
    width: 600,
    height: 600,
    hint: "Common square form photo (~2×2 in)",
  },
];

export const signaturePresets: {
  id: string;
  label: string;
  maxEdge: number;
  maxBytes?: number;
  hint: string;
}[] = [
  {
    id: "sig-200",
    label: "Max edge 200 px",
    maxEdge: 200,
    hint: "Small signature for many online forms",
  },
  {
    id: "sig-140-20kb",
    label: "140 px · under 20 KB",
    maxEdge: 140,
    maxBytes: 20 * 1024,
    hint: "Common tight signature target",
  },
  {
    id: "sig-300-50kb",
    label: "300 px · under 50 KB",
    maxEdge: 300,
    maxBytes: 50 * 1024,
    hint: "Larger signature with a byte cap",
  },
];

/** Center-crop to cover target aspect, then resize to exact pixels. */
export function fitCoverResize(
  source: HTMLCanvasElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const targetRatio = width / height;
  const sourceRatio = source.width / source.height;
  let cropW = source.width;
  let cropH = source.height;
  let x = 0;
  let y = 0;
  if (sourceRatio > targetRatio) {
    cropW = Math.round(source.height * targetRatio);
    x = Math.round((source.width - cropW) / 2);
  } else {
    cropH = Math.round(source.width / targetRatio);
    y = Math.round((source.height - cropH) / 2);
  }
  const cropped = cropCanvas(source, x, y, cropW, cropH);
  return resizeCanvas(cropped, width, height);
}

export async function exportPassportPhoto(
  source: HTMLCanvasElement,
  preset: PhotoPreset,
  mime: "image/jpeg" | "image/png" = "image/jpeg",
  quality = 0.9,
): Promise<{ blob: Blob; canvas: HTMLCanvasElement }> {
  const canvas = fitCoverResize(source, preset.width, preset.height);
  const blob = await canvasToBlob(canvas, mime, quality);
  return { blob, canvas };
}

export async function exportSignature(
  source: HTMLCanvasElement,
  maxEdge: number,
  maxBytes?: number,
): Promise<{ blob: Blob; canvas: HTMLCanvasElement }> {
  let canvas = fitMaxEdge(source, maxEdge);
  if (maxBytes) {
    const result = await compressToMaxBytes(canvas, {
      maxBytes,
      mime: "image/jpeg",
      startMaxEdge: maxEdge,
      minEdge: 48,
    });
    return { blob: result.blob, canvas: result.canvas };
  }
  const blob = await canvasToBlob(canvas, "image/png");
  return { blob, canvas };
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
