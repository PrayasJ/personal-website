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
  exportSignature,
  fileToCanvas,
  signaturePresets,
} from "@/lib/image";

type Result = { blob: Blob; name: string; src: string };

export function SignatureResizer() {
  const sourceUrl = useRef<string | null>(null);
  const resultUrl = useRef<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [presetId, setPresetId] = useState(signaturePresets[0]!.id);
  const [source, setSource] = useState<MediaItem[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const file = files[0] ?? null;
  const preset =
    signaturePresets.find((item) => item.id === presetId) ?? signaturePresets[0]!;

  function invalidate() {
    revokeUrl(resultUrl.current);
    resultUrl.current = null;
    setResult(null);
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
      const { blob } = await exportSignature(
        original,
        preset.maxEdge,
        preset.maxBytes,
      );
      const ext = preset.maxBytes ? "jpg" : "png";
      const src = objectUrl(blob, resultUrl.current);
      resultUrl.current = src;
      setResult({
        blob,
        name: `${stem(file.name)}-signature.${ext}`,
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
        Fit a signature scan to a common max edge, optionally with a byte cap.
        Presets are typical form limits — not official exam rules. Preview before
        download.
      </p>
      <div className="mt-4">
        <FileDrop
          accept="image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif"
          files={files}
          onChange={onFiles}
          label="Signature"
        />
      </div>
      <Segmented
        className="mt-4"
        label="Preset"
        value={presetId}
        onChange={(value) => {
          setPresetId(value);
          invalidate();
        }}
        options={signaturePresets.map((item) => ({
          value: item.id,
          label: item.label,
        }))}
      />
      <p className="mt-2 text-xs text-muted">{preset.hint}</p>
      {file ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Stat label="Original" value={formatBytes(file.size)} />
          {result ? (
            <Stat label="Output" value={formatBytes(result.blob.size)} tone="accent" />
          ) : null}
        </div>
      ) : null}
      <MediaWorkspace
        source={source}
        result={output}
        sourceEmpty="Drop a signature image."
        resultEmpty="Preview to see the resized signature."
        sourceLabel="Original"
        resultLabel={
          result ? `Result · ${formatBytes(result.blob.size)}` : "Result"
        }
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
        filename={result?.name ?? "signature.png"}
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
