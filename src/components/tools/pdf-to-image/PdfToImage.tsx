"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { useRef, useState } from "react";
import { downloadBlob, formatBytes, objectUrl, readFileBuffer, revokeUrl, stem } from "@/lib/files";
import { canvasToBlob, extFor, type ImageFormat } from "@/lib/image";
import { pageThumbs, parsePageRange, pdfPageCount, pdfPreview, renderPdfPages } from "@/lib/pdf";

type OutImage = { blob: Blob; name: string; src: string };

export function PdfToImage() {
  const tick = useRef(0);
  const outUrls = useRef<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<number | null>(null);
  const [range, setRange] = useState("1");
  const [format, setFormat] = useState<ImageFormat>("image/png");
  const [scale, setScale] = useState("2");
  const [source, setSource] = useState<MediaItem[]>([]);
  const [output, setOutput] = useState<OutImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const file = files[0] ?? null;

  function invalidate() {
    outUrls.current.forEach((url) => revokeUrl(url));
    outUrls.current = [];
    setOutput([]);
  }

  async function onFiles(next: File[]) {
    const id = ++tick.current;
    setFiles(next);
    invalidate();
    setError(null);
    const first = next[0];
    if (!first) {
      setPages(null);
      setSource([]);
      return;
    }
    try {
      const buffer = await readFileBuffer(first);
      const count = await pdfPageCount(buffer);
      const preview = await pdfPreview(buffer);
      if (id !== tick.current) {
        return;
      }
      setPages(count);
      setRange("1");
      setSource(pageThumbs(preview.urls));
    } catch (caught) {
      if (id !== tick.current) {
        return;
      }
      setPages(null);
      setSource([]);
      setError(caught instanceof Error ? caught.message : "Could not read the PDF.");
    }
  }

  async function preview() {
    if (!file || pages == null) {
      return;
    }
    setBusy(true);
    setError(null);
      const items: OutImage[] = [];
      try {
        const selected = parsePageRange(range, pages);
        const buffer = await readFileBuffer(file);
        const zoom = Number(scale);
        const canvases = await renderPdfPages(buffer, selected, zoom);
        const ext = extFor(format);
        for (let index = 0; index < canvases.length; index += 1) {
          const canvas = canvases[index];
          const blob = await canvasToBlob(canvas, format, 0.9);
          items.push({
            blob,
            name: `${stem(file.name)}-p${selected[index]}.${ext}`,
            src: objectUrl(blob),
          });
        }
        outUrls.current.forEach((url) => revokeUrl(url));
        outUrls.current = items.map((item) => item.src);
        setOutput(items);
      } catch (caught) {
        items.forEach((item) => revokeUrl(item.src));
        setError(caught instanceof Error ? caught.message : "Could not render.");
      } finally {
        setBusy(false);
      }
  }

  const thumbs = output.map((item) => ({ src: item.src, caption: item.name }));
  const totalBytes = output.reduce((sum, item) => sum + item.blob.size, 0);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Pages render with PDF.js onto a canvas, then encode as PNG, JPEG, or
        WebP. Preview every selected page, then confirm. Several pages download
        one after another — the browser may ask you to allow multiple downloads.
      </p>
      <div className="mt-4">
        <FileDrop accept="application/pdf,.pdf" files={files} onChange={onFiles} label="PDF" />
      </div>
      {pages != null ? <Stat className="mt-4" label="Pages" value={String(pages)} /> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Pages" htmlFor="pdf-img-range" hint="1, or 1-3,5">
          <input
            id="pdf-img-range"
            value={range}
            onChange={(event) => {
              setRange(event.target.value);
              invalidate();
            }}
            className="field-input"
            spellCheck={false}
          />
        </Field>
        <Field label="Scale" htmlFor="pdf-img-scale" hint="1 is 72 dpi">
          <input
            id="pdf-img-scale"
            value={scale}
            onChange={(event) => {
              setScale(event.target.value);
              invalidate();
            }}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
      </div>
      <Segmented
        className="mt-4"
        label="Format"
        value={format}
        onChange={(value) => {
          setFormat(value);
          invalidate();
        }}
        options={[
          { value: "image/png", label: "PNG" },
          { value: "image/jpeg", label: "JPEG" },
          { value: "image/webp", label: "WebP" },
        ]}
      />
      <MediaWorkspace
        source={source}
        result={thumbs}
        sourceEmpty="Drop a PDF to see the original pages."
        resultEmpty="Preview to render the selected pages as images."
        sourceLabel="PDF pages"
        resultLabel={output.length ? `Images · ${formatBytes(totalBytes)}` : "Images"}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy || !file} onClick={preview}>
          {busy ? "Rendering…" : "Preview images"}
        </Button>
        <Button disabled={busy || output.length === 0} onClick={() => setAsk(true)}>
          Download
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            tick.current += 1;
            invalidate();
            setFiles([]);
            setPages(null);
            setSource([]);
            setError(null);
          }}
        >
          Clear
        </Button>
      </div>
      {error ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <DownloadConfirm
        open={ask}
        filename={
          output.length === 1 ? output[0].name : `${output.length} images from ${file?.name ?? "PDF"}`
        }
        bytes={output.length === 1 ? output[0].blob.size : totalBytes}
        count={output.length}
        detail={
          output.length > 1
            ? "The browser may ask you to allow multiple downloads."
            : undefined
        }
        previews={thumbs}
        onCancel={() => setAsk(false)}
        onConfirm={() => {
          setAsk(false);
          void (async () => {
            for (const item of output) {
              downloadBlob(item.blob, item.name);
              if (output.length > 1) {
                await new Promise((resolve) => window.setTimeout(resolve, 350));
              }
            }
          })();
        }}
      />
    </ToolShell>
  );
}
