"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { Select } from "@/components/ui/Select";
import { calculateGst, formatInr, gstRates } from "@/lib/finance";

const GST_HINTS: Record<(typeof gstRates)[number], string> = {
  0: "Exempt / nil",
  5: "Merit goods",
  12: "Lower standard",
  18: "Standard slab",
  28: "Luxury / sin",
};

export function GstCalculator() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [inclusive, setInclusive] = useState(false);

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: calculateGst(Number(amount), Number(rate), inclusive),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [amount, rate, inclusive]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        India GST slabs. CGST and SGST are split equally. IGST for interstate
        supply is the full GST amount. Not tax advice.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Amount" htmlFor="gst-amount" prefix="₹">
          <input
            id="gst-amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Select
          label="GST rate"
          value={rate}
          onChange={setRate}
          options={gstRates.map((value) => ({
            value: String(value),
            label: `${value}%`,
            hint: GST_HINTS[value],
          }))}
        />
      </div>
      <Segmented
        className="mt-4"
        label="GST in amount"
        value={inclusive ? "inc" : "exc"}
        onChange={(next) => setInclusive(next === "inc")}
        options={[
          { value: "exc", label: "Exclusive" },
          { value: "inc", label: "Inclusive" },
        ] as const}
      />
      {!result.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {result.error}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Stat label="Taxable" value={formatInr(result.value.base)} />
          <Stat label="GST" value={formatInr(result.value.gst)} />
          <Stat
            label="CGST / SGST"
            value={`${formatInr(result.value.cgst)} / ${formatInr(result.value.sgst)}`}
          />
          <Stat label="Total" value={formatInr(result.value.total)} tone="accent" />
        </div>
      )}
    </ToolShell>
  );
}
