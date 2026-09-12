"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { FileDrop } from "@/components/tools/FileDrop";
import { MediaStrip, MediaWorkspace, type MediaItem } from "@/components/tools/MediaStrip";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { ToolPane } from "@/components/tools/ToolPane";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { useLayoutEffect, useRef, useState } from "react";
import { downloadBlob, formatBytes, objectUrl, revokeUrl, stem } from "@/lib/files";
import {
  canvasToBlob,
  cropCanvas,
  extFor,
  fileToCanvas,
  type ImageFormat,
} from "@/lib/image";

type Rect = { x: number; y: number; w: number; h: number };
type Result = { blob: Blob; name: string; src: string };

export function ImageCrop() {
  const stageRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const resultUrl = useRef<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [source, setSource] = useState<HTMLCanvasElement | null>(null);
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const [format, setFormat] = useState<ImageFormat>("image/png");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const file = files[0] ?? null;

  useLayoutEffect(() => {
    if (source) {
      paint(source, rect);
    }
  }, [source, rect]);

  function paint(nextSource: HTMLCanvasElement, nextRect: Rect) {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    const maxW = stage.parentElement?.clientWidth || 720;
    const scale = Math.min(1, maxW / nextSource.width);
    stage.width = Math.round(nextSource.width * scale);
    stage.height = Math.round(nextSource.height * scale);
    const ctx = stage.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.drawImage(nextSource, 0, 0, stage.width, stage.height);
    ctx.fillStyle = "rgba(5, 8, 22, 0.45)";
    ctx.fillRect(0, 0, stage.width, stage.height);
    const x = nextRect.x * scale;
    const y = nextRect.y * scale;
    const w = nextRect.w * scale;
    const h = nextRect.h * scale;
    ctx.drawImage(nextSource, nextRect.x, nextRect.y, nextRect.w, nextRect.h, x, y, w, h);
    ctx.strokeStyle = "rgba(129, 140, 248, 0.95)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, Math.max(0, w - 2), Math.max(0, h - 2));
  }

  function invalidate() {
    revokeUrl(resultUrl.current);
    resultUrl.current = null;
    setResult(null);
  }

  async function onFiles(next: File[]) {
    setFiles(next);
    invalidate();
    setError(null);
    const first = next[0];
    if (!first) {
      setSource(null);
      return;
    }
    try {
      const canvas = await fileToCanvas(first);
      setSource(canvas);
      setRect({ x: 0, y: 0, w: canvas.width, h: canvas.height });
    } catch (caught) {
      setSource(null);
      setError(caught instanceof Error ? caught.message : "Could not read the image.");
    }
  }

  function toSourcePoint(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!source) {
      return { x: 0, y: 0 };
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const scaleX = source.width / bounds.width;
    const scaleY = source.height / bounds.height;
    return {
      x: Math.min(source.width, Math.max(0, (event.clientX - bounds.left) * scaleX)),
      y: Math.min(source.height, Math.max(0, (event.clientY - bounds.top) * scaleY)),
    };
  }

  async function preview() {
    if (!file || !source) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const cropped = cropCanvas(source, rect.x, rect.y, rect.w, rect.h);
      const blob = await canvasToBlob(cropped, format, 0.92);
      const src = objectUrl(blob, resultUrl.current);
      resultUrl.current = src;
      setResult({
        blob,
        name: `${stem(file.name)}-crop.${extFor(format)}`,
        src,
      });
    } catch (caught) {
      invalidate();
      setError(caught instanceof Error ? caught.message : "Could not crop.");
    } finally {
      setBusy(false);
    }
  }

  const output: MediaItem[] = result ? [{ src: result.src, caption: result.name }] : [];

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Drag on the preview to set a crop, or type pixel values. Preview the
        cropped image, then confirm the download. Encoding stays in this tab.
      </p>
      <div className="mt-4">
        <FileDrop
          accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
          files={files}
          onChange={onFiles}
          label="Image"
        />
      </div>
      {source ? (
        <>
          <Stat className="mt-4" label="Image" value={`${source.width} × ${source.height}`} />
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <ToolPane tone="in" label="Crop">
              <div className="crop-stage">
                <canvas
                  ref={stageRef}
                  className="crop-canvas"
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    drag.current = toSourcePoint(event);
                    invalidate();
                  }}
                  onPointerMove={(event) => {
                    if (!drag.current || !source) {
                      return;
                    }
                    const point = toSourcePoint(event);
                    const next = {
                      x: Math.min(drag.current.x, point.x),
                      y: Math.min(drag.current.y, point.y),
                      w: Math.abs(point.x - drag.current.x),
                      h: Math.abs(point.y - drag.current.y),
                    };
                    setRect(next);
                    paint(source, next);
                    setResult(null);
                  }}
                  onPointerUp={() => {
                    drag.current = null;
                  }}
                />
              </div>
            </ToolPane>
            <ToolPane tone="out" label={result ? `Cropped · ${formatBytes(result.blob.size)}` : "Cropped"}>
              <MediaStrip items={output} empty="Preview the crop to see the result." large />
            </ToolPane>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {(["x", "y", "w", "h"] as const).map((key) => (
              <Field key={key} label={key.toUpperCase()} htmlFor={`crop-${key}`}>
                <input
                  id={`crop-${key}`}
                  value={Math.round(rect[key])}
                  onChange={(event) => {
                    if (!source) {
                      return;
                    }
                    const next = { ...rect, [key]: Number(event.target.value) };
                    setRect(next);
                    paint(source, next);
                    invalidate();
                  }}
                  className="field-input"
                  inputMode="numeric"
                />
              </Field>
            ))}
          </div>
        </>
      ) : (
        <MediaWorkspace
          source={[]}
          result={[]}
          sourceEmpty="Drop an image to crop it."
          resultEmpty="Preview the crop to see the result."
          sourceLabel="Crop"
          resultLabel="Cropped"
        />
      )}

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
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy || !source} onClick={preview}>
          {busy ? "Cropping…" : "Preview crop"}
        </Button>
        <Button disabled={busy || !result} onClick={() => setAsk(true)}>
          Download
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setFiles([]);
            setSource(null);
            invalidate();
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
        filename={result?.name ?? "crop.png"}
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
