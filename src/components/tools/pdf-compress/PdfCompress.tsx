"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Segmented";
import { Stat } from "@/components/ui/Field";
import { useRef, useState } from "react";
import { downloadBytes, formatBytes, readFileBuffer, stem } from "@/lib/files";
import {
  compressPdf,
  pageThumbs,
  pdfPreview,
  previewPdfBytes,
  type CompressQuality,
} from "@/lib/pdf";

type Result = { bytes: Uint8Array; name: string };

export function PdfCompress() {
  const tick = useRef(0);
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState<CompressQuality>("balanced");
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
      const bytes = await compressPdf(await readFileBuffer(file), quality, (page, total) => {
        setProgress(`Page ${page} / ${total}`);
      });
      const thumbs = await previewPdfBytes(bytes);
      setResult({ bytes, name: `${stem(file.name)}-smaller.pdf` });
      setOutput(pageThumbs(thumbs.urls));
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
        Each page is rasterized to JPEG and written back into a new PDF. Vector
        text becomes an image. That is what actually shrinks most scans in the
        browser. Preview the result, then confirm the download.
      </p>
      <div className="mt-4">
        <FileDrop accept="application/pdf,.pdf" files={files} onChange={onFiles} label="PDF" />
      </div>
      <Segmented
        className="mt-4"
        label="Quality"
        value={quality}
        onChange={(value) => {
          setQuality(value);
          setResult(null);
          setOutput([]);
        }}
        options={[
          { value: "smaller", label: "Smaller" },
          { value: "balanced", label: "Balanced" },
          { value: "sharper", label: "Sharper" },
        ]}
      />
      {file ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Stat label="Original" value={formatBytes(file.size)} />
          {result ? (
            <Stat label="Compressed" value={formatBytes(result.bytes.length)} tone="accent" />
          ) : null}
        </div>
      ) : null}
      <MediaWorkspace
        source={source}
        result={output}
        sourceEmpty="Drop a PDF to see the original pages."
        resultEmpty="Preview compression to compare the rasterized pages."
        sourceLabel="Original"
        resultLabel={result ? `Compressed · ${formatBytes(result.bytes.length)}` : "Compressed PDF"}
      />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="primary" disabled={busy || !file} onClick={preview}>
          {busy ? progress ?? "Compressing…" : "Preview compress"}
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
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <DownloadConfirm
        open={ask}
        filename={result?.name ?? "smaller.pdf"}
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
