"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { calculateRd, formatInr } from "@/lib/india";

export function RdCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("6.5");
  const [months, setMonths] = useState("12");

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: calculateRd(Number(monthly), Number(rate), Number(months)),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [monthly, rate, months]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Recurring deposit. Each installment compounds quarterly for the remaining
        tenure. Banks round and may use a different day-count. Not a quote.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Monthly" htmlFor="rd-monthly" prefix="₹">
          <input
            id="rd-monthly"
            value={monthly}
            onChange={(event) => setMonthly(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Annual rate" htmlFor="rd-rate" suffix="%">
          <input
            id="rd-rate"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Tenure" htmlFor="rd-months" suffix="mo">
          <input
            id="rd-months"
            value={months}
            onChange={(event) => setMonths(event.target.value)}
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
          setMonthly("5000");
          setRate("6.5");
          setMonths("12");
        }}
      >
        Reset example
      </Button>
    </ToolShell>
  );
}
