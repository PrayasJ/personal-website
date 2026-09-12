"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Stat } from "@/components/ui/Field";
import { useRef, useState } from "react";
import { downloadBytes, formatBytes, readFileBuffer, stem } from "@/lib/files";
import {
  compressPdfToMaxBytes,
  pageThumbs,
  pdfPreview,
  previewPdfBytes,
} from "@/lib/pdf";

type Result = { bytes: Uint8Array; name: string; alreadyUnder: boolean };

type Props = {
  maxBytes: number;
  label: string;
};

export function TargetPdfCompress({ maxBytes, label }: Props) {
  const tick = useRef(0);
  const [files, setFiles] = useState<File[]>([]);
  const [source, setSource] = useState<MediaItem[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [output, setOutput] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const file = files[0] ?? null;

  async function onFiles(next: File[]) {
    const id = ++tick.current;
    setFiles(next);
    setResult(null);
    setOutput([]);
    setError(null);
    const first = next[0];
    if (!first) {
      setSource([]);
      return;
    }
    try {
      const preview = await pdfPreview(await readFileBuffer(first));
      if (id !== tick.current) {
        return;
      }
      setSource(pageThumbs(preview.urls));
    } catch (caught) {
      if (id !== tick.current) {
        return;
      }
      setSource([]);
      setError(caught instanceof Error ? caught.message : "Could not preview.");
    }
  }

  async function preview() {
    if (!file) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const compressed = await compressPdfToMaxBytes(
        await readFileBuffer(file),
        maxBytes,
        ({ page, total, attempt, attempts }) => {
          setProgress(`Attempt ${attempt}/${attempts} · page ${page}/${total}`);
        },
      );
      const thumbs = compressed.alreadyUnder
        ? source
        : pageThumbs((await previewPdfBytes(compressed.bytes)).urls);
      setResult({
        bytes: compressed.bytes,
        name: compressed.alreadyUnder
          ? file.name
          : `${stem(file.name)}-${label.replace(/\s+/g, "").toLowerCase()}.pdf`,
        alreadyUnder: compressed.alreadyUnder,
      });
      setOutput(thumbs);
    } catch (caught) {
      setResult(null);
      setOutput([]);
      setError(caught instanceof Error ? caught.message : "Could not compress.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Rasterize pages to JPEG with progressively lower quality until the file is
        ≤ {label} ({formatBytes(maxBytes)}), or report failure honestly. Vector
        text becomes an image. Preview, then confirm download. Nothing is
        uploaded.
      </p>
      <div className="mt-4">
        <FileDrop accept="application/pdf,.pdf" files={files} onChange={onFiles} label="PDF" />
      </div>
      {file ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Stat label="Original" value={formatBytes(file.size)} />
          {result ? (
            <Stat
              label={result.alreadyUnder ? "Already under target" : `Result (≤ ${label})`}
              value={formatBytes(result.bytes.length)}
              tone="accent"
            />
          ) : null}
        </div>
      ) : null}
      {progress ? <p className="mt-3 text-xs text-muted">{progress}</p> : null}
      <MediaWorkspace
        source={source}
        result={output}
        sourceEmpty="Drop a PDF to see the original pages."
        resultEmpty={`Preview to encode under ${label}.`}
        sourceLabel="Original"
        resultLabel={
          result ? `Result · ${formatBytes(result.bytes.length)}` : "Compressed"
        }
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy || !file} onClick={preview}>
          {busy ? "Compressing…" : "Preview"}
        </Button>
        <Button disabled={busy || !result} onClick={() => setAsk(true)}>
          Download
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            tick.current += 1;
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
        filename={result?.name ?? "compressed.pdf"}
        bytes={result?.bytes.length}
        previews={output}
        onCancel={() => setAsk(false)}
        onConfirm={() => {
          if (!result) {
            return;
          }
          downloadBytes(result.bytes, result.name, "application/pdf");
          setAsk(false);
        }}
      />
    </ToolShell>
  );
}
