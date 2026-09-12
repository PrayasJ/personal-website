"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { calculateSip, formatInr } from "@/lib/sip";

export function SipCalculator() {
  const [monthly, setMonthly] = useState("10000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const p = Number(monthly);
    const r = Number(rate);
    const n = Math.round(Number(years) * 12);
    try {
      return { ok: true as const, value: calculateSip(p, r, n) };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [monthly, rate, years]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Future value of a monthly SIP with returns compounded monthly. Expected
        return is an assumption, not a forecast. Not investment advice.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Monthly" htmlFor="sip-monthly" prefix="₹">
          <input
            id="sip-monthly"
            value={monthly}
            onChange={(event) => setMonthly(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Expected return" htmlFor="sip-rate" suffix="%">
          <input
            id="sip-rate"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Tenure" htmlFor="sip-years" suffix="yrs">
          <input
            id="sip-years"
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
          <Stat label="Invested" value={formatInr(result.value.invested)} />
          <Stat
            label="Estimated value"
            value={formatInr(result.value.futureValue)}
            tone="accent"
          />
          <Stat label="Gain" value={formatInr(result.value.gain)} tone="success" />
        </div>
      )}
      <Button
        variant="ghost"
        className="mt-4"
        onClick={() => {
          setMonthly("10000");
          setRate("12");
          setYears("10");
        }}
      >
        Reset example
      </Button>
    </ToolShell>
  );
}
