"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { useRef, useState } from "react";
import { downloadBlob, downloadBytes, objectUrl, revokeUrl, stem } from "@/lib/files";
import {
  buildIco,
  canvasPreviewUrl,
  canvasPngBytes,
  fileToCanvas,
  resizeCanvas,
} from "@/lib/image";

const ICO_SIZES = [16, 32, 48];

type Packed = {
  ico: Blob;
  icoName: string;
  apple: Uint8Array;
  thumbs: MediaItem[];
};

export function FaviconGenerator() {
  const sourceUrl = useRef<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [source, setSource] = useState<MediaItem[]>([]);
  const [packed, setPacked] = useState<Packed | null>(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState<"ico" | "apple" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const file = files[0] ?? null;

  function revokeSource() {
    revokeUrl(sourceUrl.current);
    sourceUrl.current = null;
  }

  function onFiles(next: File[]) {
    revokeSource();
    setFiles(next);
    setPacked(null);
    setError(null);
    const first = next[0];
    if (!first) {
      setSource([]);
      return;
    }
    const url = objectUrl(first);
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
      const pngs = [];
      const thumbs: MediaItem[] = [];
      for (const size of ICO_SIZES) {
        const canvas = resizeCanvas(original, size, size);
        pngs.push({
          width: size,
          height: size,
          data: await canvasPngBytes(canvas),
        });
        thumbs.push({
          src: canvasPreviewUrl(canvas, size),
          caption: `${size}×${size}`,
        });
      }
      const appleCanvas = resizeCanvas(original, 180, 180);
      thumbs.push({
        src: canvasPreviewUrl(appleCanvas, 180),
        caption: "180×180 Apple",
      });
      setPacked({
        ico: buildIco(pngs),
        icoName: `${stem(file.name)}.ico`,
        apple: await canvasPngBytes(appleCanvas),
        thumbs,
      });
    } catch (caught) {
      setPacked(null);
      setError(caught instanceof Error ? caught.message : "Could not build favicons.");
    } finally {
      setBusy(false);
    }
  }

  const output = packed?.thumbs ?? [];
  const icoThumbs = packed?.thumbs.filter((item) => item.caption !== "180×180 Apple") ?? [];
  const appleThumbs = packed?.thumbs.filter((item) => item.caption === "180×180 Apple") ?? [];

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Square-resize the image and pack 16, 32, and 48 px PNG frames into an
        ICO. The 180 px Apple touch icon is a separate PNG. Non-square sources
        are stretched. Preview every size, then confirm the download.
      </p>
      <div className="mt-4">
        <FileDrop
          accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
          files={files}
          onChange={onFiles}
          label="Source image"
        />
      </div>
      <MediaWorkspace
        source={source}
        result={output}
        sourceEmpty="Drop a source image to see it here."
        resultEmpty="Preview to see 16, 32, 48, and 180 px icons."
        sourceLabel="Source"
        resultLabel="Favicon sizes"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy || !file} onClick={preview}>
          {busy ? "Building…" : "Preview icons"}
        </Button>
        <Button disabled={busy || !packed} onClick={() => setAsk("ico")}>
          Download .ico
        </Button>
        <Button disabled={busy || !packed} onClick={() => setAsk("apple")}>
          Download 180 PNG
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            revokeSource();
            setFiles([]);
            setSource([]);
            setPacked(null);
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
        open={ask === "ico"}
        filename={packed?.icoName ?? "favicon.ico"}
        bytes={packed?.ico.size}
        detail="Contains 16, 32, and 48 px PNG frames."
        previews={icoThumbs}
        onCancel={() => setAsk(null)}
        onConfirm={() => {
          if (!packed) {
            return;
          }
          downloadBlob(packed.ico, packed.icoName);
          setAsk(null);
        }}
      />
      <DownloadConfirm
        open={ask === "apple"}
        filename="apple-touch-icon.png"
        bytes={packed?.apple.length}
        previews={appleThumbs}
        onCancel={() => setAsk(null)}
        onConfirm={() => {
          if (!packed) {
            return;
          }
          downloadBytes(packed.apple, "apple-touch-icon.png", "image/png");
          setAsk(null);
        }}
      />
    </ToolShell>
  );
}
