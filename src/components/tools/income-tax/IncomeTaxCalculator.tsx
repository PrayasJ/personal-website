"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { calculateIncomeTax, formatInr } from "@/lib/salary";

export function IncomeTaxCalculator() {
  const [mode, setMode] = useState<"taxable" | "gross">("taxable");
  const [amount, setAmount] = useState("1200000");

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: calculateIncomeTax(Number(amount), mode),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [amount, mode]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Budget 2025 new regime only: slabs, §87A rebate (taxable income up to
        ₹12 lakh), and 4% health and education cess. Surcharge above ₹50 lakh is
        not modelled. Not tax advice.
      </p>
      <Segmented
        className="mt-4"
        label="Income figure"
        value={mode}
        onChange={setMode}
        options={[
          { value: "taxable", label: "Already taxable" },
          { value: "gross", label: "Gross − ₹75k SD" },
        ]}
      />
      <div className="mt-4">
        <Field
          label={mode === "taxable" ? "Taxable income / year" : "Gross income / year"}
          htmlFor="it-amount"
          prefix="₹"
        >
          <input
            id="it-amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
      </div>
      {!result.ok ? (
        <p
          className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {result.error}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Taxable income" value={formatInr(result.value.taxable)} />
          {mode === "gross" ? (
            <Stat
              label="Standard deduction"
              value={formatInr(result.value.standardDeduction)}
            />
          ) : null}
          <Stat label="Slab tax (before rebate)" value={formatInr(result.value.slabTax)} />
          <Stat
            label="Tax after §87A"
            value={formatInr(result.value.afterRebate)}
            hint={result.value.rebateApplied ? "Rebate applied" : "Above ₹12 lakh"}
          />
          <Stat label="Cess 4%" value={formatInr(result.value.cess)} />
          <Stat
            label="Total tax"
            value={formatInr(result.value.total)}
            tone="accent"
            hint={`${result.value.effectiveRate.toFixed(2)}% of input`}
          />
        </div>
      )}
    </ToolShell>
  );
}
