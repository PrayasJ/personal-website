"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { useEffect, useRef, useState } from "react";
import { downloadBlob, objectUrl, revokeUrl } from "@/lib/files";
import { buildQrPayload, type QrMode } from "@/lib/qr";

type Props = {
  defaultMode?: QrMode;
};

export function QrGenerator({ defaultMode = "url" }: Props) {
  const resultUrl = useRef<string | null>(null);
  const [mode, setMode] = useState<QrMode>(defaultMode);
  const [text, setText] = useState(
    defaultMode === "url" ? "https://prayas.dev" : "",
  );
  const [vpa, setVpa] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState<{
    src: string;
    blob: Blob;
    name: string;
    payload: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      revokeUrl(resultUrl.current);
    };
  }, []);

  function invalidate() {
    revokeUrl(resultUrl.current);
    resultUrl.current = null;
    setPreview(null);
  }

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const payload = buildQrPayload(mode, text, { vpa, name, amount, note });
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(payload, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 512,
        color: { dark: "#0a0a0a", light: "#ffffff" },
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const src = objectUrl(blob, resultUrl.current);
      resultUrl.current = src;
      setPreview({
        src,
        blob,
        name: mode === "upi" ? "upi-qr.png" : "qr-code.png",
        payload,
      });
    } catch (caught) {
      invalidate();
      setError(caught instanceof Error ? caught.message : "Could not generate QR.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Encode a URL, plain text, or UPI payment string into a PNG QR code. Runs
        entirely in this tab — nothing is uploaded.
      </p>
      <Segmented
        className="mt-4"
        label="Type"
        value={mode}
        onChange={(value) => {
          setMode(value);
          invalidate();
        }}
        options={[
          { value: "url", label: "URL" },
          { value: "text", label: "Text" },
          { value: "upi", label: "UPI" },
        ]}
      />
      {mode === "upi" ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="UPI ID (VPA)" htmlFor="qr-vpa">
            <input
              id="qr-vpa"
              value={vpa}
              onChange={(event) => {
                setVpa(event.target.value);
                invalidate();
              }}
              className="field-input"
              placeholder="name@upi"
              autoComplete="off"
            />
          </Field>
          <Field label="Payee name" htmlFor="qr-pn">
            <input
              id="qr-pn"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                invalidate();
              }}
              className="field-input"
            />
          </Field>
          <Field label="Amount (optional)" htmlFor="qr-am" suffix="INR">
            <input
              id="qr-am"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                invalidate();
              }}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
          <Field label="Note (optional)" htmlFor="qr-tn">
            <input
              id="qr-tn"
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                invalidate();
              }}
              className="field-input"
            />
          </Field>
        </div>
      ) : (
        <div className="mt-4">
          <Field label={mode === "url" ? "URL" : "Text"} htmlFor="qr-text">
            <textarea
              id="qr-text"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                invalidate();
              }}
              className="field-input min-h-24"
              rows={3}
            />
          </Field>
        </div>
      )}
      {preview ? (
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview.src}
            alt="Generated QR code"
            className="h-48 w-48 rounded-lg border border-border bg-white p-2"
          />
          <p className="max-w-md break-all font-mono text-xs text-muted">
            {preview.payload}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Generate to preview the QR.</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" disabled={busy} onClick={generate}>
          {busy ? "Encoding…" : "Generate"}
        </Button>
        <Button disabled={busy || !preview} onClick={() => setAsk(true)}>
          Download PNG
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            invalidate();
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
        filename={preview?.name ?? "qr-code.png"}
        bytes={preview?.blob.size}
        previews={
          preview ? [{ src: preview.src, caption: preview.name }] : []
        }
        onCancel={() => setAsk(false)}
        onConfirm={() => {
          if (!preview) {
            return;
          }
          downloadBlob(preview.blob, preview.name);
          setAsk(false);
        }}
      />
    </ToolShell>
  );
}
