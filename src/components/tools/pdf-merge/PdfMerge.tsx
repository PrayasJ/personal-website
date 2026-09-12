"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { useRef, useState } from "react";
import { downloadBytes, formatBytes, readFileBuffer } from "@/lib/files";
import { mergePdfs, pageThumbs, pdfPreview, previewPdfBytes } from "@/lib/pdf";

type Result = { bytes: Uint8Array; name: string };

export function PdfMerge() {
  const tick = useRef(0);
  const [files, setFiles] = useState<File[]>([]);
  const [source, setSource] = useState<MediaItem[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [output, setOutput] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(next: File[]) {
    const id = ++tick.current;
    setFiles(next);
    setResult(null);
    setOutput([]);
    setError(null);
    if (next.length === 0) {
      setSource([]);
      return;
    }
    try {
      const items: MediaItem[] = [];
      for (const file of next.slice(0, 8)) {
        const preview = await pdfPreview(await readFileBuffer(file), { maxPages: 1 });
        if (preview.urls[0]) {
          items.push({ src: preview.urls[0], caption: file.name });
        }
      }
      if (id !== tick.current) {
        return;
      }
      setSource(items);
    } catch (caught) {
      if (id !== tick.current) {
        return;
      }
      setSource([]);
      setError(caught instanceof Error ? caught.message : "Could not preview.");
    }
  }

  async function preview() {
    setBusy(true);
    setError(null);
    try {
      const buffers = await Promise.all(files.map((file) => readFileBuffer(file)));
      const bytes = await mergePdfs(buffers);
      const thumbs = await previewPdfBytes(bytes);
      setResult({ bytes, name: "merged.pdf" });
      setOutput(pageThumbs(thumbs.urls));
    } catch (caught) {
      setResult(null);
      setOutput([]);
      setError(caught instanceof Error ? caught.message : "Could not merge.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Files are read in this tab with pdf-lib. Order in the list is the order
        of pages in the result. Encrypted PDFs will fail. Preview the merge
        before downloading.
      </p>
      <div className="mt-4">
        <FileDrop
          accept="application/pdf,.pdf"
          multiple
          files={files}
          onChange={onFiles}
          label="PDFs to merge"
        />
      </div>
      <MediaWorkspace
        source={source}
        result={output}
        sourceEmpty="Add at least two PDFs to see the first page of each."
        resultEmpty="Preview the merge to see the combined PDF."
        sourceLabel={
          files.length > 8 ? `Source pages · first 8 of ${files.length}` : "Source pages"
        }
        resultLabel={result ? `Merged · ${formatBytes(result.bytes.length)}` : "Merged PDF"}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy || files.length < 2} onClick={preview}>
          {busy ? "Merging…" : "Preview merge"}
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
        filename={result?.name ?? "merged.pdf"}
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
