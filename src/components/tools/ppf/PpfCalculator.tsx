"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { calculatePpf, formatInr } from "@/lib/india";

export function PpfCalculator() {
  const [yearly, setYearly] = useState("150000");
  const [rate, setRate] = useState("7.1");
  const [years, setYears] = useState("15");

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: calculatePpf(Number(yearly), Number(rate), Number(years)),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [yearly, rate, years]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Public Provident Fund. Deposit is treated as made at the start of each
        year and compounded annually. The notified rate changes. Not tax or
        investment advice.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Yearly deposit" htmlFor="ppf-yearly" prefix="₹">
          <input
            id="ppf-yearly"
            value={yearly}
            onChange={(event) => setYearly(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Notified rate" htmlFor="ppf-rate" suffix="%">
          <input
            id="ppf-rate"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Tenure" htmlFor="ppf-years" suffix="yrs">
          <input
            id="ppf-years"
            value={years}
            onChange={(event) => setYears(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
      </div>
      {!result.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {result.error}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Maturity" value={formatInr(result.value.maturity)} tone="accent" />
          <Stat label="Invested" value={formatInr(result.value.invested)} />
          <Stat label="Interest" value={formatInr(result.value.interest)} tone="success" />
        </div>
      )}
      <Button
        variant="ghost"
        className="mt-4"
        onClick={() => {
          setYearly("150000");
          setRate("7.1");
          setYears("15");
        }}
      >
        Reset example
      </Button>
    </ToolShell>
  );
}
