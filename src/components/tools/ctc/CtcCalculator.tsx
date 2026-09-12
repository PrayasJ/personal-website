"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { CheckChip } from "@/components/ui/CheckChip";
import { formatInr, splitCtc } from "@/lib/salary";

export function CtcCalculator() {
  const [ctc, setCtc] = useState("1200000");
  const [basicPercent, setBasicPercent] = useState("40");
  const [city, setCity] = useState<"metro" | "other">("metro");
  const [pfCapped, setPfCapped] = useState(false);

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: splitCtc(Number(ctc), Number(basicPercent), city === "metro", pfCapped),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [ctc, basicPercent, city, pfCapped]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        A common IT structure: basic as a percent of CTC, HRA at 50% (metro) or
        40% of basic, employer PF at 12%, gratuity provision at 4.81% of basic,
        special allowance as the remainder. Not a CTC letter and not tax advice.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Annual CTC" htmlFor="ctc-amount" prefix="₹">
          <input
            id="ctc-amount"
            value={ctc}
            onChange={(event) => setCtc(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Basic" htmlFor="ctc-basic" suffix="%">
          <input
            id="ctc-basic"
            value={basicPercent}
            onChange={(event) => setBasicPercent(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
      </div>
      <Segmented
        className="mt-4"
        label="HRA city"
        value={city}
        onChange={setCity}
        options={[
          { value: "metro", label: "Metro 50%" },
          { value: "other", label: "Other 40%" },
        ]}
      />
      <CheckChip className="mt-3" checked={pfCapped} onChange={setPfCapped}>
        Cap PF wage at ₹15,000 / month
      </CheckChip>
      {!result.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {result.error}
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="Monthly gross" value={formatInr(result.value.gross / 12)} tone="accent" />
            <Stat label="Employer PF / yr" value={formatInr(result.value.employerPf)} />
            <Stat label="Gratuity / yr" value={formatInr(result.value.gratuity)} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Basic" value={formatInr(result.value.basic / 12)} hint="monthly" />
            <Stat label="HRA" value={formatInr(result.value.hra / 12)} hint="monthly" />
            <Stat label="Special" value={formatInr(result.value.special / 12)} hint="monthly" />
            <Stat label="Annual gross" value={formatInr(result.value.gross)} />
          </div>
        </>
      )}
    </ToolShell>
  );
}
