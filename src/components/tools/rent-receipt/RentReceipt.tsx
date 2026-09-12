"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useMemo, useState } from "react";
import { downloadBytes } from "@/lib/files";
import {
  amountInWordsInr,
  buildRentReceiptPdf,
  buildRentReceiptText,
} from "@/lib/rent-receipt";

function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function RentReceipt() {
  const [landlordName, setLandlordName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [amount, setAmount] = useState("15000");
  const [periodLabel, setPeriodLabel] = useState("September 2026");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [receiptDate, setReceiptDate] = useState(todayIso);
  const [city, setCity] = useState("");
  const [landlordPan, setLandlordPan] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draft = useMemo(() => {
    try {
      const value = Number(amount);
      const text = buildRentReceiptText({
        landlordName,
        tenantName,
        amount: value,
        periodLabel,
        propertyAddress,
        receiptDate,
        city,
        landlordPan,
        receiptNo,
      });
      const words = amountInWordsInr(value);
      return { ok: true as const, text, words };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid.",
      };
    }
  }, [
    landlordName,
    tenantName,
    amount,
    periodLabel,
    propertyAddress,
    receiptDate,
    city,
    landlordPan,
    receiptNo,
  ]);

  async function previewPdf() {
    setBusy(true);
    setError(null);
    try {
      const pdf = await buildRentReceiptPdf({
        landlordName,
        tenantName,
        amount: Number(amount),
        periodLabel,
        propertyAddress,
        receiptDate,
        city,
        landlordPan,
        receiptNo,
      });
      setBytes(pdf);
    } catch (caught) {
      setBytes(null);
      setError(caught instanceof Error ? caught.message : "Could not build PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Fill a simple Indian-style rent receipt, preview the wording (including
        amount in words), then download a one-page PDF. Not a legal template —
        use whatever your landlord/tenant agreement requires.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Landlord / owner" htmlFor="rr-landlord">
          <input
            id="rr-landlord"
            value={landlordName}
            onChange={(event) => {
              setLandlordName(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
        <Field label="Tenant" htmlFor="rr-tenant">
          <input
            id="rr-tenant"
            value={tenantName}
            onChange={(event) => {
              setTenantName(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
        <Field label="Amount" htmlFor="rr-amount" suffix="INR">
          <input
            id="rr-amount"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setBytes(null);
            }}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Period" htmlFor="rr-period" hint="e.g. September 2026">
          <input
            id="rr-period"
            value={periodLabel}
            onChange={(event) => {
              setPeriodLabel(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
        <Field label="Receipt date" htmlFor="rr-date">
          <input
            id="rr-date"
            type="date"
            value={receiptDate}
            onChange={(event) => {
              setReceiptDate(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
        <Field label="City (optional)" htmlFor="rr-city">
          <input
            id="rr-city"
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
        <Field label="Landlord PAN (optional)" htmlFor="rr-pan">
          <input
            id="rr-pan"
            value={landlordPan}
            onChange={(event) => {
              setLandlordPan(event.target.value);
              setBytes(null);
            }}
            className="field-input"
            autoComplete="off"
          />
        </Field>
        <Field label="Receipt no. (optional)" htmlFor="rr-no">
          <input
            id="rr-no"
            value={receiptNo}
            onChange={(event) => {
              setReceiptNo(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
      </div>
      <div className="mt-3">
        <Field label="Property address" htmlFor="rr-addr">
          <textarea
            id="rr-addr"
            value={propertyAddress}
            onChange={(event) => {
              setPropertyAddress(event.target.value);
              setBytes(null);
            }}
            className="field-input min-h-20"
            rows={2}
          />
        </Field>
      </div>
      {draft.ok ? (
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-panel px-3 py-3 text-xs leading-5 whitespace-pre-wrap text-ink">
          {draft.text}
        </pre>
      ) : (
        <p className="mt-4 text-sm text-muted">{draft.error}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="primary"
          disabled={busy || !draft.ok}
          onClick={previewPdf}
        >
          {busy ? "Building…" : "Build PDF"}
        </Button>
        <Button disabled={busy || !bytes} onClick={() => setAsk(true)}>
          Download PDF
        </Button>
      </div>
      {bytes ? (
        <p className="mt-3 text-xs text-muted">
          PDF ready ({bytes.length.toLocaleString("en-IN")} bytes). Confirm to
          download.
        </p>
      ) : null}
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
        filename="rent-receipt.pdf"
        bytes={bytes?.length}
        previews={[]}
        detail="Text preview is above. Confirm to download the PDF."
        onCancel={() => setAsk(false)}
        onConfirm={() => {
          if (!bytes) {
            return;
          }
          downloadBytes(bytes, "rent-receipt.pdf", "application/pdf");
          setAsk(false);
        }}
      />
    </ToolShell>
  );
}
