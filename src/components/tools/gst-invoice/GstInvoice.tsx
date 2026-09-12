"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { DownloadConfirm } from "@/components/tools/DownloadConfirm";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { useMemo, useState } from "react";
import { downloadBytes, formatBytes } from "@/lib/files";
import { formatInr, gstRates } from "@/lib/finance";
import {
  buildGstInvoicePdf,
  buildGstInvoiceTotals,
  type InvoiceLineInput,
} from "@/lib/gst-invoice";

function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function emptyLine(): InvoiceLineInput {
  return { description: "", quantity: 1, rate: 0, gstRate: 18 };
}

export function GstInvoice() {
  const [sellerName, setSellerName] = useState("");
  const [sellerGstin, setSellerGstin] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerGstin, setBuyerGstin] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(todayIso);
  const [intraState, setIntraState] = useState(true);
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<InvoiceLineInput[]>([
    { description: "Consulting", quantity: 1, rate: 10000, gstRate: 18 },
  ]);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: buildGstInvoiceTotals({
          sellerName,
          sellerGstin,
          sellerAddress,
          buyerName,
          buyerGstin,
          buyerAddress,
          invoiceNo,
          invoiceDate,
          intraState,
          lines,
          notes,
        }),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid.",
      };
    }
  }, [
    sellerName,
    sellerGstin,
    sellerAddress,
    buyerName,
    buyerGstin,
    buyerAddress,
    invoiceNo,
    invoiceDate,
    intraState,
    lines,
    notes,
  ]);

  function updateLine(index: number, patch: Partial<InvoiceLineInput>) {
    setBytes(null);
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    );
  }

  async function buildPdf() {
    setBusy(true);
    setError(null);
    try {
      const pdf = await buildGstInvoicePdf({
        sellerName,
        sellerGstin,
        sellerAddress,
        buyerName,
        buyerGstin,
        buyerAddress,
        invoiceNo,
        invoiceDate,
        intraState,
        lines,
        notes,
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
        Build a simple GST tax invoice / estimate with line items, live CGST+SGST
        or IGST split, and amount in words. Download a PDF — not a statutory
        e-invoice. Nothing is uploaded.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Seller / business" htmlFor="inv-seller">
          <input
            id="inv-seller"
            value={sellerName}
            onChange={(event) => {
              setSellerName(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
        <Field label="Seller GSTIN (optional)" htmlFor="inv-sgstin">
          <input
            id="inv-sgstin"
            value={sellerGstin}
            onChange={(event) => {
              setSellerGstin(event.target.value);
              setBytes(null);
            }}
            className="field-input"
            autoComplete="off"
          />
        </Field>
        <Field label="Buyer" htmlFor="inv-buyer">
          <input
            id="inv-buyer"
            value={buyerName}
            onChange={(event) => {
              setBuyerName(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
        <Field label="Buyer GSTIN (optional)" htmlFor="inv-bgstin">
          <input
            id="inv-bgstin"
            value={buyerGstin}
            onChange={(event) => {
              setBuyerGstin(event.target.value);
              setBytes(null);
            }}
            className="field-input"
            autoComplete="off"
          />
        </Field>
        <Field label="Invoice no." htmlFor="inv-no">
          <input
            id="inv-no"
            value={invoiceNo}
            onChange={(event) => {
              setInvoiceNo(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
        <Field label="Date" htmlFor="inv-date">
          <input
            id="inv-date"
            type="date"
            value={invoiceDate}
            onChange={(event) => {
              setInvoiceDate(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Seller address (optional)" htmlFor="inv-saddr">
          <textarea
            id="inv-saddr"
            value={sellerAddress}
            onChange={(event) => {
              setSellerAddress(event.target.value);
              setBytes(null);
            }}
            className="field-input min-h-16"
            rows={2}
          />
        </Field>
        <Field label="Buyer address (optional)" htmlFor="inv-baddr">
          <textarea
            id="inv-baddr"
            value={buyerAddress}
            onChange={(event) => {
              setBuyerAddress(event.target.value);
              setBytes(null);
            }}
            className="field-input min-h-16"
            rows={2}
          />
        </Field>
      </div>

      <Segmented
        className="mt-4"
        label="Supply"
        value={intraState ? "intra" : "inter"}
        onChange={(value) => {
          setIntraState(value === "intra");
          setBytes(null);
        }}
        options={[
          { value: "intra", label: "Same state (CGST+SGST)" },
          { value: "inter", label: "Other state (IGST)" },
        ]}
      />

      <section className="tool-section mt-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-ink">Line items</h2>
          <Button
            variant="ghost"
            onClick={() => {
              setLines((prev) => [...prev, emptyLine()]);
              setBytes(null);
            }}
          >
            Add line
          </Button>
        </div>
        <div className="mt-3 grid gap-4">
          {lines.map((line, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-lg border border-border/80 p-3 sm:grid-cols-2 lg:grid-cols-5"
            >
              <Field label="Description" htmlFor={`inv-desc-${index}`}>
                <input
                  id={`inv-desc-${index}`}
                  value={line.description}
                  onChange={(event) =>
                    updateLine(index, { description: event.target.value })
                  }
                  className="field-input"
                />
              </Field>
              <Field label="Qty" htmlFor={`inv-qty-${index}`}>
                <input
                  id={`inv-qty-${index}`}
                  value={String(line.quantity)}
                  onChange={(event) =>
                    updateLine(index, { quantity: Number(event.target.value) })
                  }
                  className="field-input"
                  inputMode="decimal"
                />
              </Field>
              <Field label="Rate" htmlFor={`inv-rate-${index}`} prefix="₹">
                <input
                  id={`inv-rate-${index}`}
                  value={String(line.rate)}
                  onChange={(event) =>
                    updateLine(index, { rate: Number(event.target.value) })
                  }
                  className="field-input"
                  inputMode="decimal"
                />
              </Field>
              <Field label="GST %" htmlFor={`inv-gst-${index}`}>
                <select
                  id={`inv-gst-${index}`}
                  value={line.gstRate}
                  onChange={(event) =>
                    updateLine(index, { gstRate: Number(event.target.value) })
                  }
                  className="field-input"
                >
                  {gstRates.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}%
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  disabled={lines.length <= 1}
                  onClick={() => {
                    setLines((prev) => prev.filter((_, i) => i !== index));
                    setBytes(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-3">
        <Field label="Notes (optional)" htmlFor="inv-notes">
          <input
            id="inv-notes"
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
              setBytes(null);
            }}
            className="field-input"
          />
        </Field>
      </div>

      {totals.ok ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Taxable" value={formatInr(totals.value.taxable)} />
          <Stat
            label={intraState ? "CGST + SGST" : "IGST"}
            value={
              intraState
                ? `${formatInr(totals.value.cgst)} + ${formatInr(totals.value.sgst)}`
                : formatInr(totals.value.igst)
            }
          />
          <Stat label="Grand total" value={formatInr(totals.value.grand)} tone="accent" />
          <Stat label="In words" value={totals.value.words} />
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">{totals.error}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="primary"
          disabled={busy || !totals.ok}
          onClick={buildPdf}
        >
          {busy ? "Building…" : "Build PDF"}
        </Button>
        <Button disabled={busy || !bytes} onClick={() => setAsk(true)}>
          Download PDF
        </Button>
      </div>
      {bytes ? (
        <p className="mt-3 text-xs text-muted">
          PDF ready ({formatBytes(bytes.length)}). Confirm to download.
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
        filename={`${invoiceNo.trim() || "invoice"}.pdf`}
        bytes={bytes?.length}
        previews={[]}
        detail="Live totals are above. Confirm to download the PDF."
        onCancel={() => setAsk(false)}
        onConfirm={() => {
          if (!bytes) {
            return;
          }
          downloadBytes(
            bytes,
            `${invoiceNo.trim() || "invoice"}.pdf`,
            "application/pdf",
          );
          setAsk(false);
        }}
      />
    </ToolShell>
  );
}
