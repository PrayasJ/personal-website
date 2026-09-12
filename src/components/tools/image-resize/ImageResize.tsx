"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { CheckChip } from "@/components/ui/CheckChip";
import { Segmented } from "@/components/ui/Segmented";
import { useRef, useState } from "react";
import { downloadBlob, formatBytes, objectUrl, revokeUrl, stem } from "@/lib/files";
import {
  canvasToBlob,
  extFor,
  fileToCanvas,
  resizeCanvas,
  type ImageFormat,
} from "@/lib/image";

type Result = { blob: Blob; name: string; src: string };

export function ImageResize() {
  const sourceUrl = useRef<string | null>(null);
  const resultUrl = useRef<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState("1280");
  const [height, setHeight] = useState("720");
  const [lock, setLock] = useState(true);
  const [ratio, setRatio] = useState(16 / 9);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [format, setFormat] = useState<ImageFormat>("image/png");
  const [source, setSource] = useState<MediaItem[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const file = files[0] ?? null;

  function invalidate() {
    revokeUrl(resultUrl.current);
    resultUrl.current = null;
    setResult(null);
  }

  async function onFiles(next: File[]) {
    invalidate();
    setFiles(next);
    setError(null);
    const first = next[0];
    if (!first) {
      revokeUrl(sourceUrl.current);
      sourceUrl.current = null;
      setNatural(null);
      setSource([]);
      return;
    }
    try {
      const canvas = await fileToCanvas(first);
      const url = objectUrl(first, sourceUrl.current);
      sourceUrl.current = url;
      setNatural({ w: canvas.width, h: canvas.height });
      setWidth(String(canvas.width));
      setHeight(String(canvas.height));
      setRatio(canvas.width / canvas.height);
      setSource([{ src: url, caption: `${first.name} · ${canvas.width}×${canvas.height}` }]);
    } catch (caught) {
      revokeUrl(sourceUrl.current);
      sourceUrl.current = null;
      setNatural(null);
      setSource([]);
      setError(caught instanceof Error ? caught.message : "Could not read the image.");
    }
  }

  async function preview() {
    if (!file) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const original = await fileToCanvas(file);
      const resized = resizeCanvas(original, Number(width), Number(height));
      const blob = await canvasToBlob(resized, format, 0.92);
      const src = objectUrl(blob, resultUrl.current);
      resultUrl.current = src;
      setResult({
        blob,
        name: `${stem(file.name)}-${width}x${height}.${extFor(format)}`,
        src,
      });
    } catch (caught) {
      invalidate();
      setError(caught instanceof Error ? caught.message : "Could not resize.");
    } finally {
      setBusy(false);
    }
  }

  const output = result ? [{ src: result.src, caption: result.name }] : [];

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Resize in this browser with high-quality smoothing. Lock aspect to keep
        the original ratio. Preview the new size, then confirm the download.
      </p>
      <div className="mt-4">
        <FileDrop
          accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
          files={files}
          onChange={onFiles}
          label="Image"
        />
      </div>
      {natural ? (
        <Stat className="mt-4" label="Original" value={`${natural.w} × ${natural.h}`} />
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Width" htmlFor="img-w" suffix="px">
          <input
            id="img-w"
            value={width}
            onChange={(event) => {
              const next = event.target.value;
              setWidth(next);
              invalidate();
              if (lock && ratio > 0) {
                const w = Number(next);
                if (w > 0) {
                  setHeight(String(Math.round(w / ratio)));
                }
              }
            }}
            className="field-input"
            inputMode="numeric"
          />
        </Field>
        <Field label="Height" htmlFor="img-h" suffix="px">
          <input
            id="img-h"
            value={height}
            onChange={(event) => {
              const next = event.target.value;
              setHeight(next);
              invalidate();
              if (lock && ratio > 0) {
                const h = Number(next);
                if (h > 0) {
                  setWidth(String(Math.round(h * ratio)));
                }
              }
            }}
            className="field-input"
            inputMode="numeric"
          />
        </Field>
      </div>
      <CheckChip className="mt-3" checked={lock} onChange={setLock}>
        Lock aspect
      </CheckChip>
      <Segmented
        className="mt-4"
        label="Output"
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
        result={output}
        sourceEmpty="Drop an image to see the original."
        resultEmpty="Preview resize to see the new dimensions."
        sourceLabel="Original"
        resultLabel={result ? `Resized · ${formatBytes(result.blob.size)}` : "Resized"}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy || !file} onClick={preview}>
          {busy ? "Resizing…" : "Preview"}
        </Button>
        <Button disabled={busy || !result} onClick={() => setAsk(true)}>
          Download
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            invalidate();
            revokeUrl(sourceUrl.current);
            sourceUrl.current = null;
            setFiles([]);
            setNatural(null);
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
        filename={result?.name ?? "resized.png"}
        bytes={result?.blob.size}
        previews={output}
        onCancel={() => setAsk(false)}
        onConfirm={() => {
          if (!result) {
            return;
          }
          downloadBlob(result.blob, result.name);
          setAsk(false);
        }}
      />
    </ToolShell>
  );
}
