"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { useRef, useState } from "react";
import { downloadBlob, formatBytes, objectUrl, revokeUrl, stem } from "@/lib/files";
import {
  canvasToBlob,
  extFor,
  fileToCanvas,
  fitMaxEdge,
  type ImageFormat,
} from "@/lib/image";

type Result = { blob: Blob; name: string; src: string };

export function ImageCompress() {
  const sourceUrl = useRef<string | null>(null);
  const resultUrl = useRef<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState("0.75");
  const [maxEdge, setMaxEdge] = useState("1920");
  const [format, setFormat] = useState<ImageFormat>("image/jpeg");
  const [source, setSource] = useState<MediaItem[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const file = files[0] ?? null;

  function dropResult() {
    resultUrl.current = null;
    setResult(null);
  }

  function invalidate() {
    revokeUrl(resultUrl.current);
    dropResult();
  }

  function onFiles(next: File[]) {
    invalidate();
    setFiles(next);
    setError(null);
    const first = next[0];
    if (!first) {
      revokeUrl(sourceUrl.current);
      sourceUrl.current = null;
      setSource([]);
      return;
    }
    const url = objectUrl(first, sourceUrl.current);
    sourceUrl.current = url;
    setSource([{ src: url, caption: first.name }]);
  }

  async function preview() {
    if (!file) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const original = await fileToCanvas(file);
      const fitted = fitMaxEdge(original, Number(maxEdge) || original.width);
      const blob = await canvasToBlob(fitted, format, Number(quality));
      const src = objectUrl(blob, resultUrl.current);
      resultUrl.current = src;
      setResult({
        blob,
        name: `${stem(file.name)}-compressed.${extFor(format)}`,
        src,
      });
    } catch (caught) {
      invalidate();
      setError(caught instanceof Error ? caught.message : "Could not compress.");
    } finally {
      setBusy(false);
    }
  }

  const output = result ? [{ src: result.src, caption: result.name }] : [];

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Decode with createImageBitmap, optionally cap the long edge, then encode
        JPEG or WebP at the quality you set. PNG ignores quality. Preview the
        result, then confirm the download. Nothing is uploaded.
      </p>
      <div className="mt-4">
        <FileDrop
          accept="image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
          files={files}
          onChange={onFiles}
          label="Image"
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Quality" htmlFor="img-q" hint="0.1 – 1, lossy only">
          <input
            id="img-q"
            value={quality}
            onChange={(event) => {
              setQuality(event.target.value);
              invalidate();
            }}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Max edge" htmlFor="img-edge" suffix="px">
          <input
            id="img-edge"
            value={maxEdge}
            onChange={(event) => {
              setMaxEdge(event.target.value);
              invalidate();
            }}
            className="field-input"
            inputMode="numeric"
          />
        </Field>
      </div>
      <Segmented
        className="mt-4"
        label="Output"
        value={format}
        onChange={(value) => {
          setFormat(value);
          invalidate();
        }}
        options={[
          { value: "image/jpeg", label: "JPEG" },
          { value: "image/webp", label: "WebP" },
          { value: "image/png", label: "PNG" },
        ]}
      />
      {file ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Stat label="Original" value={formatBytes(file.size)} />
          {result ? (
            <Stat label="Compressed" value={formatBytes(result.blob.size)} tone="accent" />
          ) : null}
        </div>
      ) : null}
      <MediaWorkspace
        source={source}
        result={output}
        sourceEmpty="Drop an image to see it here."
        resultEmpty="Preview compression to see the encoded image."
        sourceLabel="Original"
        resultLabel={result ? `Compressed · ${formatBytes(result.blob.size)}` : "Compressed"}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy || !file} onClick={preview}>
          {busy ? "Encoding…" : "Preview"}
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
        filename={result?.name ?? "compressed.jpg"}
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
