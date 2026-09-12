"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { useRef, useState } from "react";
import { downloadBytes, formatBytes, readFileBuffer, stem } from "@/lib/files";
import {
  pageThumbs,
  parsePageRange,
  pdfPageCount,
  pdfPreview,
  previewPdfBytes,
  rotatePages,
} from "@/lib/pdf";

type Result = { bytes: Uint8Array; name: string };

export function PdfRotate() {
  const tick = useRef(0);
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState<"90" | "180" | "270">("90");
  const [range, setRange] = useState("all");
  const [pages, setPages] = useState<number | null>(null);
  const [source, setSource] = useState<MediaItem[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [output, setOutput] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
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
      setRange("all");
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

  function invalidate() {
    setResult(null);
    setOutput([]);
  }

  async function preview() {
    if (!file || pages == null) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const selected = parsePageRange(range, pages);
      const bytes = await rotatePages(
        await readFileBuffer(file),
        selected,
        Number(angle) as 90 | 180 | 270,
      );
      const thumbs = await previewPdfBytes(bytes);
      setResult({ bytes, name: `${stem(file.name)}-rotated.pdf` });
      setOutput(pageThumbs(thumbs.urls));
    } catch (caught) {
      setResult(null);
      setOutput([]);
      setError(caught instanceof Error ? caught.message : "Could not rotate.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Clockwise rotation on selected pages. Use all, or a range like 2-4.
        Preview the rotated pages before you download.
      </p>
      <div className="mt-4">
        <FileDrop accept="application/pdf,.pdf" files={files} onChange={onFiles} label="PDF" />
      </div>
      {pages != null ? <Stat className="mt-4" label="Pages" value={String(pages)} /> : null}
      <Segmented
        className="mt-4"
        label="Clockwise"
        value={angle}
        onChange={(value) => {
          setAngle(value);
          invalidate();
        }}
        options={[
          { value: "90", label: "90°" },
          { value: "180", label: "180°" },
          { value: "270", label: "270°" },
        ]}
      />
      <Field label="Pages" htmlFor="pdf-rotate-range" className="mt-4" hint="all, or 1-3,5">
        <input
          id="pdf-rotate-range"
          value={range}
          onChange={(event) => {
            setRange(event.target.value);
            invalidate();
          }}
          className="field-input"
          spellCheck={false}
        />
      </Field>
      <MediaWorkspace
        source={source}
        result={output}
        sourceEmpty="Drop a PDF to see the original pages."
        resultEmpty="Preview rotation to see the new orientation."
        sourceLabel="Original"
        resultLabel={result ? `Rotated · ${formatBytes(result.bytes.length)}` : "Rotated PDF"}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy || !file} onClick={preview}>
          {busy ? "Rotating…" : "Preview rotate"}
        </Button>
        <Button disabled={busy || !result} onClick={() => setAsk(true)}>
          Download
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            tick.current += 1;
            setFiles([]);
            setPages(null);
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
        filename={result?.name ?? "rotated.pdf"}
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
