"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { CopyButton } from "@/components/tools/CopyButton";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useEffect, useMemo, useRef, useState } from "react";
import { downloadBlob, objectUrl, revokeUrl } from "@/lib/files";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppLinkGenerator() {
  const resultUrl = useRef<string | null>(null);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<{
    src: string;
    blob: Blob;
    name: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const link = useMemo(() => {
    try {
      if (!phone.trim()) {
        return null;
      }
      return buildWhatsAppLink(phone, message);
    } catch {
      return null;
    }
  }, [phone, message]);

  useEffect(() => {
    return () => {
      revokeUrl(resultUrl.current);
    };
  }, []);

  function invalidateQr() {
    revokeUrl(resultUrl.current);
    resultUrl.current = null;
    setPreview(null);
  }

  async function generateQr() {
    setBusy(true);
    setError(null);
    try {
      const href = buildWhatsAppLink(phone, message);
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(href, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 512,
        color: { dark: "#0a0a0a", light: "#ffffff" },
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const src = objectUrl(blob, resultUrl.current);
      resultUrl.current = src;
      setPreview({ src, blob, name: "whatsapp-qr.png" });
    } catch (caught) {
      invalidateQr();
      setError(caught instanceof Error ? caught.message : "Could not build link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Build a wa.me click-to-chat link with an optional pre-filled message. 10-digit
        Indian mobiles get +91 automatically. Copy the link, open chat, or download
        a QR — all in this tab.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Phone" htmlFor="wa-phone" hint="10 digits or with country code">
          <input
            id="wa-phone"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              invalidateQr();
              setError(null);
            }}
            className="field-input"
            inputMode="tel"
            placeholder="9876543210"
            autoComplete="tel"
          />
        </Field>
        <Field label="Message (optional)" htmlFor="wa-msg">
          <textarea
            id="wa-msg"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              invalidateQr();
            }}
            className="field-input min-h-24"
            rows={3}
            placeholder="Hi, I wanted to ask about…"
          />
        </Field>
      </div>
      {link ? (
        <p className="mt-4 break-all font-mono text-xs text-muted">{link}</p>
      ) : (
        <p className="mt-4 text-sm text-muted">Enter a phone number to see the link.</p>
      )}
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview.src}
          alt="WhatsApp QR code"
          className="mt-4 h-48 w-48 rounded-lg border border-border bg-white p-2"
        />
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton value={link ?? ""} label="Copy link" disabled={!link} />
        <Button
          variant="primary"
          disabled={!link}
          onClick={() => {
            if (link) {
              window.open(link, "_blank", "noopener,noreferrer");
            }
          }}
        >
          Open chat
        </Button>
        <Button disabled={busy || !phone.trim()} onClick={generateQr}>
          {busy ? "Encoding…" : "QR preview"}
        </Button>
        <Button disabled={busy || !preview} onClick={() => setAsk(true)}>
          Download QR
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
        filename={preview?.name ?? "whatsapp-qr.png"}
        bytes={preview?.blob.size}
        previews={preview ? [{ src: preview.src, caption: preview.name }] : []}
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
