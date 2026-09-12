import { PDFDocument } from "pdf-lib";

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export function isPdfImageFile(file: File): boolean {
  if (IMAGE_TYPES.has(file.type)) {
    return true;
  }
  return /\.(png|jpe?g|webp)$/i.test(file.name);
}

async function fileToPngOrJpg(
  file: File,
): Promise<{ kind: "png" | "jpg"; bytes: Uint8Array; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas is not available in this browser.");
    }
    ctx.drawImage(bitmap, 0, 0);
    const preferPng =
      file.type === "image/png" || file.type === "image/webp" || /\.png$/i.test(file.name);
    const mime = preferPng ? "image/png" : "image/jpeg";
    const quality = preferPng ? undefined : 0.92;
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (next) => {
          if (!next) {
            reject(new Error(`Could not encode ${file.name}.`));
            return;
          }
          resolve(next);
        },
        mime,
        quality,
      );
    });
    return {
      kind: preferPng ? "png" : "jpg",
      bytes: new Uint8Array(await blob.arrayBuffer()),
      width: bitmap.width,
      height: bitmap.height,
    };
  } finally {
    bitmap.close();
  }
}

/** Build a PDF with one page per image. PNG/JPEG/WebP; WebP is re-encoded. */
export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("Add at least one image.");
  }
  if (files.some((file) => !isPdfImageFile(file))) {
    throw new Error("Use PNG, JPEG, or WebP images.");
  }
  const out = await PDFDocument.create();
  for (const file of files) {
    const encoded = await fileToPngOrJpg(file);
    const image =
      encoded.kind === "png"
        ? await out.embedPng(encoded.bytes)
        : await out.embedJpg(encoded.bytes);
    const page = out.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }
  return out.save();
}
