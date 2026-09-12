"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { useRef, useState } from "react";
import { downloadBytes, formatBytes, readFileBuffer, stem } from "@/lib/files";
import {
  extractPages,
  pageThumbs,
  parsePageRange,
  pdfPageCount,
  pdfPreview,
  previewPdfBytes,
} from "@/lib/pdf";

type Result = { bytes: Uint8Array; name: string };

export function PdfSplit() {
  const tick = useRef(0);
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1-1");
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
      setRange(count > 1 ? `1-${count}` : "1");
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
    try {
      const selected = parsePageRange(range, pages);
      const bytes = await extractPages(await readFileBuffer(file), selected);
      const thumbs = await previewPdfBytes(bytes);
      setResult({ bytes, name: `${stem(file.name)}-pages.pdf` });
      setOutput(pageThumbs(thumbs.urls));
    } catch (caught) {
      setResult(null);
      setOutput([]);
      setError(caught instanceof Error ? caught.message : "Could not split.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Extract a page range into one PDF. Example: 1-3,5,8-10. Preview the
        pages you keep, then confirm the download. The original file is not
        uploaded.
      </p>
      <div className="mt-4">
        <FileDrop accept="application/pdf,.pdf" files={files} onChange={onFiles} label="PDF" />
      </div>
      {pages != null ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Stat label="Pages" value={String(pages)} />
          <Field label="Keep pages" htmlFor="pdf-range" hint="1-indexed, commas and ranges">
            <input
              id="pdf-range"
              value={range}
              onChange={(event) => {
                setRange(event.target.value);
                setResult(null);
                setOutput([]);
              }}
              className="field-input"
              spellCheck={false}
            />
          </Field>
        </div>
      ) : null}
      <MediaWorkspace
        source={source}
        result={output}
        sourceEmpty="Drop a PDF to see the first pages."
        resultEmpty="Preview the extract to see the pages you keep."
        sourceLabel="Original"
        resultLabel={result ? `Extract · ${formatBytes(result.bytes.length)}` : "Extracted PDF"}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy || !file} onClick={preview}>
          {busy ? "Extracting…" : "Preview extract"}
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
        filename={result?.name ?? "pages.pdf"}
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
