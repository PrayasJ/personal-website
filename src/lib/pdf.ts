import { PDFDocument, degrees as pdfDegrees, type PDFPage } from "pdf-lib";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { copyBuffer } from "@/lib/files";

export type CompressQuality = "smaller" | "balanced" | "sharper";

const compressPresets: Record<CompressQuality, { scale: number; jpeg: number }> = {
  smaller: { scale: 1.1, jpeg: 0.52 },
  balanced: { scale: 1.5, jpeg: 0.72 },
  sharper: { scale: 2, jpeg: 0.86 },
};

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

export async function loadPdf(data: ArrayBuffer) {
  return PDFDocument.load(data, { ignoreEncryption: false });
}

export async function pdfPageCount(data: ArrayBuffer): Promise<number> {
  const doc = await loadPdf(data);
  return doc.getPageCount();
}

export function parsePageRange(input: string, pageCount: number): number[] {
  const trimmed = input.trim();
  if (!trimmed || trimmed.toLowerCase() === "all") {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const pages = new Set<number>();
  for (const part of trimmed.split(",")) {
    const piece = part.trim();
    const range = piece.split("-").map((bit) => Number(bit.trim()));
    if (range.length === 1 && Number.isInteger(range[0])) {
      pages.add(range[0]);
      continue;
    }
    if (
      range.length === 2 &&
      Number.isInteger(range[0]) &&
      Number.isInteger(range[1]) &&
      range[0] <= range[1]
    ) {
      for (let page = range[0]; page <= range[1]; page += 1) {
        pages.add(page);
      }
      continue;
    }
    throw new Error(`Could not read page range “${piece}”. Try 1-3,5.`);
  }
  const ordered = [...pages].sort((a, b) => a - b);
  if (ordered.some((page) => page < 1 || page > pageCount)) {
    throw new Error(`Pages must be between 1 and ${pageCount}.`);
  }
  if (ordered.length === 0) {
    throw new Error("Select at least one page.");
  }
  return ordered;
}

export async function mergePdfs(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  if (buffers.length < 2) {
    throw new Error("Add at least two PDFs to merge.");
  }
  const out = await PDFDocument.create();
  for (const buffer of buffers) {
    const src = await loadPdf(buffer);
    const copied = await out.copyPages(src, src.getPageIndices());
    copied.forEach((page) => out.addPage(page));
  }
  return out.save();
}

export async function extractPages(
  data: ArrayBuffer,
  pages: number[],
): Promise<Uint8Array> {
  const src = await loadPdf(data);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(
    src,
    pages.map((page) => page - 1),
  );
  copied.forEach((page) => out.addPage(page));
  return out.save();
}

export async function rotatePages(
  data: ArrayBuffer,
  pages: number[],
  angle: 90 | 180 | 270,
): Promise<Uint8Array> {
  const doc = await loadPdf(data);
  const selected = new Set(pages);
  doc.getPages().forEach((page: PDFPage, index) => {
    if (!selected.has(index + 1)) {
      return;
    }
    const current = page.getRotation().angle;
    page.setRotation(pdfDegrees((current + angle) % 360));
  });
  return doc.save();
}

async function renderLoadedPage(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  scale: number,
): Promise<HTMLCanvasElement> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not available in this browser.");
  }
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  return canvas;
}

export async function renderPdfPage(
  data: ArrayBuffer,
  pageNumber: number,
  scale: number,
): Promise<HTMLCanvasElement> {
  const pdfjs = await loadPdfjs();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  try {
    return await renderLoadedPage(pdf, pageNumber, scale);
  } finally {
    await pdf.cleanup();
  }
}

export async function renderPdfPages(
  data: ArrayBuffer,
  pageNumbers: number[],
  scale: number,
): Promise<HTMLCanvasElement[]> {
  const pdfjs = await loadPdfjs();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  try {
    const canvases: HTMLCanvasElement[] = [];
    for (const pageNumber of pageNumbers) {
      canvases.push(await renderLoadedPage(pdf, pageNumber, scale));
    }
    return canvases;
  } finally {
    await pdf.cleanup();
  }
}

export async function pdfPreview(
  data: ArrayBuffer,
  options?: { maxPages?: number; scale?: number; pages?: number[] },
): Promise<{ urls: string[]; total: number }> {
  const pdfjs = await loadPdfjs();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  try {
    const total = pdf.numPages;
    const pages =
      options?.pages ??
      Array.from(
        { length: Math.min(options?.maxPages ?? 4, total) },
        (_, index) => index + 1,
      );
    const scale = options?.scale ?? 0.55;
    const urls: string[] = [];
    for (const pageNumber of pages) {
      const canvas = await renderLoadedPage(pdf, pageNumber, scale);
      urls.push(canvas.toDataURL("image/jpeg", 0.72));
    }
    return { urls, total };
  } finally {
    await pdf.cleanup();
  }
}

export async function previewPdfBytes(
  bytes: Uint8Array,
  options?: { maxPages?: number; scale?: number; pages?: number[] },
): Promise<{ urls: string[]; total: number }> {
  return pdfPreview(copyBuffer(bytes), options);
}

export function pageThumbs(
  urls: string[],
  startPage = 1,
): { src: string; caption: string }[] {
  return urls.map((src, index) => ({
    src,
    caption: `Page ${startPage + index}`,
  }));
}

export async function compressPdf(
  data: ArrayBuffer,
  quality: CompressQuality,
  onProgress?: (page: number, total: number) => void,
): Promise<Uint8Array> {
  const preset = compressPresets[quality];
  return compressPdfWithSettings(data, preset.scale, preset.jpeg, onProgress);
}

async function compressPdfWithSettings(
  data: ArrayBuffer,
  scale: number,
  jpeg: number,
  onProgress?: (page: number, total: number) => void,
): Promise<Uint8Array> {
  const pdfjs = await loadPdfjs();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  const out = await PDFDocument.create();
  try {
    const count = pdf.numPages;
    for (let page = 1; page <= count; page += 1) {
      onProgress?.(page, count);
      const canvas = await renderLoadedPage(pdf, page, scale);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (next) => {
            if (!next) {
              reject(new Error("Could not JPEG-encode a page."));
              return;
            }
            resolve(next);
          },
          "image/jpeg",
          jpeg,
        );
      });
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const image = await out.embedJpg(bytes);
      const nextPage = out.addPage([image.width, image.height]);
      nextPage.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }
  } finally {
    await pdf.cleanup();
  }
  return out.save({ useObjectStreams: true });
}

const targetCompressLadder: { scale: number; jpeg: number }[] = [
  { scale: 1.5, jpeg: 0.72 },
  { scale: 1.25, jpeg: 0.6 },
  { scale: 1.1, jpeg: 0.52 },
  { scale: 1.0, jpeg: 0.42 },
  { scale: 0.85, jpeg: 0.35 },
  { scale: 0.7, jpeg: 0.28 },
  { scale: 0.55, jpeg: 0.22 },
  { scale: 0.45, jpeg: 0.18 },
];

export type CompressPdfToMaxBytesResult = {
  bytes: Uint8Array;
  alreadyUnder: boolean;
  scale: number;
  jpeg: number;
};

/**
 * Rasterize with progressively lower scale/JPEG quality until size <= maxBytes.
 * If the source is already under the cap, returns the original bytes.
 */
export async function compressPdfToMaxBytes(
  data: ArrayBuffer,
  maxBytes: number,
  onProgress?: (info: {
    page: number;
    total: number;
    attempt: number;
    attempts: number;
  }) => void,
): Promise<CompressPdfToMaxBytesResult> {
  if (!(maxBytes > 0)) {
    throw new Error("Target size must be positive.");
  }
  if (data.byteLength <= maxBytes) {
    return {
      bytes: new Uint8Array(data.slice(0)),
      alreadyUnder: true,
      scale: 0,
      jpeg: 0,
    };
  }

  let best: CompressPdfToMaxBytesResult | null = null;
  const attempts = targetCompressLadder.length;

  for (let i = 0; i < attempts; i += 1) {
    const step = targetCompressLadder[i]!;
    const bytes = await compressPdfWithSettings(
      data,
      step.scale,
      step.jpeg,
      (page, total) => {
        onProgress?.({ page, total, attempt: i + 1, attempts });
      },
    );
    if (!best || bytes.length < best.bytes.length) {
      best = {
        bytes,
        alreadyUnder: false,
        scale: step.scale,
        jpeg: step.jpeg,
      };
    }
    if (bytes.length <= maxBytes) {
      return best;
    }
  }

  if (best && best.bytes.length <= maxBytes) {
    return best;
  }
  throw new Error(
    `Could not reach ${Math.round(maxBytes / 1024)} KB. Try fewer pages or a simpler scan.`,
  );
}
