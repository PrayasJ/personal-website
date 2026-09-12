"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { useEffect, useRef, useState } from "react";
import {
  downloadBytes,
  formatBytes,
  objectUrl,
  revokeUrl,
} from "@/lib/files";
import { imagesToPdf, isPdfImageFile } from "@/lib/images-pdf";
import { pageThumbs, previewPdfBytes } from "@/lib/pdf";

type Result = { bytes: Uint8Array; name: string };

export function ImagesToPdf() {
  const tick = useRef(0);
  const sourceUrls = useRef<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [source, setSource] = useState<MediaItem[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [output, setOutput] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      sourceUrls.current.forEach((url) => revokeUrl(url));
      sourceUrls.current = [];
    };
  }, []);

  function clearSourceUrls() {
    sourceUrls.current.forEach((url) => revokeUrl(url));
    sourceUrls.current = [];
  }

  function onFiles(next: File[]) {
    const id = ++tick.current;
    setResult(null);
    setOutput([]);
    setError(null);
    const images = next.filter(isPdfImageFile);
    if (images.length !== next.length) {
      setError("Only PNG, JPEG, and WebP are supported.");
    }
    setFiles(images);
    clearSourceUrls();
    if (images.length === 0) {
      setSource([]);
      return;
    }
    const items = images.map((file, index) => {
      const src = objectUrl(file);
      sourceUrls.current.push(src);
      return { src, caption: `${index + 1}. ${file.name}` };
    });
    if (id !== tick.current) {
      return;
    }
    setSource(items);
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= files.length) {
      return;
    }
    const nextFiles = [...files];
    const [file] = nextFiles.splice(index, 1);
    nextFiles.splice(target, 0, file);
    onFiles(nextFiles);
  }

  async function preview() {
    setBusy(true);
    setError(null);
    try {
      const bytes = await imagesToPdf(files);
      const thumbs = await previewPdfBytes(bytes, { maxPages: 8 });
      setResult({ bytes, name: "images.pdf" });
      setOutput(pageThumbs(thumbs.urls));
    } catch (caught) {
      setResult(null);
      setOutput([]);
      setError(caught instanceof Error ? caught.message : "Could not build PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Each image becomes one PDF page at its pixel size. WebP is re-encoded to
        PNG or JPEG in this tab. Preview the PDF, then confirm download. Nothing
        is uploaded.
      </p>
      <div className="mt-4">
        <FileDrop
          accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
          multiple
          files={files}
          onChange={onFiles}
          label="Images to PDF"
        />
      </div>
      {files.length > 1 ? (
        <ul className="mt-3 space-y-1 text-sm text-muted">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-ink">
                {index + 1}. {file.name}
              </span>
              <Button
                variant="ghost"
                className="h-7 px-2 text-xs"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                Up
              </Button>
              <Button
                variant="ghost"
                className="h-7 px-2 text-xs"
                disabled={index === files.length - 1}
                onClick={() => move(index, 1)}
              >
                Down
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      <MediaWorkspace
        source={source}
        result={output}
        sourceEmpty="Add PNG, JPEG, or WebP images."
        resultEmpty="Preview to see the PDF pages."
        sourceLabel="Source images"
        resultLabel={result ? `PDF · ${formatBytes(result.bytes.length)}` : "PDF pages"}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy || files.length < 1} onClick={preview}>
          {busy ? "Building…" : "Preview PDF"}
        </Button>
        <Button disabled={busy || !result} onClick={() => setAsk(true)}>
          Download
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            tick.current += 1;
            clearSourceUrls();
            setFiles([]);
            setSource([]);
            setResult(null);
            setOutput([]);
            setError(null);
          }}
        >
          Clear
        </Button>
      </div>
      {error ? (
        <p
          className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <DownloadConfirm
        open={ask}
        filename={result?.name ?? "images.pdf"}
        bytes={result?.bytes.length}
        previews={output}
        onCancel={() => setAsk(false)}
        onConfirm={() => {
          if (result) {
            downloadBytes(result.bytes, result.name, "application/pdf");
          }
          setAsk(false);
        }}
      />
    </ToolShell>
  );
}
