"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { useRef, useState } from "react";
import { downloadBlob, formatBytes, objectUrl, revokeUrl, stem } from "@/lib/files";
import {
  compressToMaxBytes,
  extFor,
  fileToCanvas,
} from "@/lib/image";

type Result = { blob: Blob; name: string; src: string; bytes: number };

type Props = {
  maxBytes: number;
  label: string;
};

export function TargetCompress({ maxBytes, label }: Props) {
  const sourceUrl = useRef<string | null>(null);
  const resultUrl = useRef<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [mime, setMime] = useState<"image/jpeg" | "image/webp">("image/jpeg");
  const [source, setSource] = useState<MediaItem[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const file = files[0] ?? null;
  const targetKb = Math.round(maxBytes / 1024);

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
      const compressed = await compressToMaxBytes(original, {
        maxBytes,
        mime,
      });
      const src = objectUrl(compressed.blob, resultUrl.current);
      resultUrl.current = src;
      setResult({
        blob: compressed.blob,
        name: `${stem(file.name)}-${targetKb}kb.${extFor(mime)}`,
        src,
        bytes: compressed.bytes,
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
        Encode until the file is ≤ {label} ({formatBytes(maxBytes)}). Quality is
        searched first; the long edge is reduced if needed. Preview, then confirm
        download. Nothing is uploaded.
      </p>
      <div className="mt-4">
        <FileDrop
          accept="image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
          files={files}
          onChange={onFiles}
          label="Image"
        />
      </div>
      <Segmented
        className="mt-4"
        label="Output"
        value={mime}
        onChange={(value) => {
          setMime(value);
          invalidate();
        }}
        options={[
          { value: "image/jpeg", label: "JPEG" },
          { value: "image/webp", label: "WebP" },
        ]}
      />
      {file ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Stat label="Original" value={formatBytes(file.size)} />
          {result ? (
            <Stat
              label={`Result (≤ ${label})`}
              value={formatBytes(result.bytes)}
              tone={result.bytes <= maxBytes ? "accent" : "default"}
            />
          ) : null}
        </div>
      ) : null}
      <MediaWorkspace
        source={source}
        result={output}
        sourceEmpty="Drop an image to see it here."
        resultEmpty={`Preview to encode under ${label}.`}
        sourceLabel="Original"
        resultLabel={
          result ? `Compressed · ${formatBytes(result.bytes)}` : "Compressed"
        }
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
        <p
          className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <DownloadConfirm
        open={ask}
        filename={result?.name ?? `compressed-${targetKb}kb.jpg`}
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
