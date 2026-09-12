"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { CheckChip } from "@/components/ui/CheckChip";
import { calculateInHand, formatInr, splitCtc } from "@/lib/salary";

export function InHandSalary() {
  const [mode, setMode] = useState<"ctc" | "gross">("ctc");
  const [ctc, setCtc] = useState("1200000");
  const [gross, setGross] = useState("85000");
  const [basic, setBasic] = useState("35000");
  const [basicPercent, setBasicPercent] = useState("40");
  const [city, setCity] = useState<"metro" | "other">("metro");
  const [pfCapped, setPfCapped] = useState(false);
  const [pt, setPt] = useState("200");

  const result = useMemo(() => {
    try {
      if (mode === "ctc") {
        const split = splitCtc(Number(ctc), Number(basicPercent), city === "metro", pfCapped);
        return {
          ok: true as const,
          split,
          value: calculateInHand(split.gross, split.basic, pfCapped, Number(pt)),
        };
      }
      const monthlyGross = Number(gross);
      const monthlyBasic = Number(basic);
      return {
        ok: true as const,
        split: null,
        value: calculateInHand(monthlyGross * 12, monthlyBasic * 12, pfCapped, Number(pt)),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [mode, ctc, gross, basic, basicPercent, city, pfCapped, pt]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        New regime as after Budget 2025: ₹75,000 standard deduction, rebate so
        taxable income up to ₹12 lakh pays no income tax, then slabs and 4% cess.
        Employee PF still leaves the payslip. Surcharge above ₹50 lakh is not
        modelled. Not tax advice.
      </p>
      <Segmented
        className="mt-4"
        label="Start from"
        value={mode}
        onChange={setMode}
        options={[
          { value: "ctc", label: "Annual CTC" },
          { value: "gross", label: "Monthly gross" },
        ]}
      />
      {mode === "ctc" ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Annual CTC" htmlFor="hand-ctc" prefix="₹">
            <input
              id="hand-ctc"
              value={ctc}
              onChange={(event) => setCtc(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
          <Field label="Basic" htmlFor="hand-basic-pct" suffix="%">
            <input
              id="hand-basic-pct"
              value={basicPercent}
              onChange={(event) => setBasicPercent(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Monthly gross" htmlFor="hand-gross" prefix="₹">
            <input
              id="hand-gross"
              value={gross}
              onChange={(event) => setGross(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
          <Field label="Monthly basic" htmlFor="hand-basic" prefix="₹">
            <input
              id="hand-basic"
              value={basic}
              onChange={(event) => setBasic(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
        </div>
      )}
      {mode === "ctc" ? (
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
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Professional tax / month" htmlFor="hand-pt" prefix="₹">
          <input
            id="hand-pt"
            value={pt}
            onChange={(event) => setPt(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <div className="flex items-end">
          <CheckChip checked={pfCapped} onChange={setPfCapped}>
            Cap PF wage at ₹15,000 / month
          </CheckChip>
        </div>
      </div>
      {!result.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {result.error}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Monthly in-hand" value={formatInr(result.value.monthlyInHand)} tone="accent" />
          <Stat label="Annual in-hand" value={formatInr(result.value.annualInHand)} />
          <Stat label="Income tax + cess" value={formatInr(result.value.totalTax)} />
          <Stat label="Employee PF / yr" value={formatInr(result.value.employeePf)} />
          <Stat label="Professional tax / yr" value={formatInr(result.value.professionalTax)} />
          <Stat label="Taxable income" value={formatInr(result.value.taxable)} hint="after ₹75,000 standard deduction" />
        </div>
      )}
    </ToolShell>
  );
}
