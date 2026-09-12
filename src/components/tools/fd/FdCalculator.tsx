"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { calculateFd, formatInr } from "@/lib/finance";

const COMPOUND_OPTIONS = [
  { value: "1", label: "Yearly", hint: "1× / year" },
  { value: "2", label: "Half-yearly", hint: "2× / year" },
  { value: "4", label: "Quarterly", hint: "Usual Indian default" },
  { value: "12", label: "Monthly", hint: "12× / year" },
];

export function FdCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("7.1");
  const [years, setYears] = useState("5");
  const [compound, setCompound] = useState("4");

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: calculateFd(Number(principal), Number(rate), Number(years), Number(compound)),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [principal, rate, years, compound]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Compound interest FD. Quarterly compounding is the usual Indian default.
        Banks round and add TDS. This is not a quote.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Principal" htmlFor="fd-principal" prefix="₹">
          <input
            id="fd-principal"
            value={principal}
            onChange={(event) => setPrincipal(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Annual rate" htmlFor="fd-rate" suffix="%">
          <input
            id="fd-rate"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Tenure" htmlFor="fd-years" suffix="yrs">
          <input
            id="fd-years"
            value={years}
            onChange={(event) => setYears(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Select
          label="Compounding"
          value={compound}
          onChange={setCompound}
          options={COMPOUND_OPTIONS}
        />
      </div>
      {!result.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {result.error}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Maturity" value={formatInr(result.value.maturity)} tone="accent" />
          <Stat label="Interest" value={formatInr(result.value.interest)} tone="success" />
          <Stat label="Principal" value={formatInr(Number(principal) || 0)} />
        </div>
      )}
      <Button
        variant="ghost"
        className="mt-4"
        onClick={() => {
          setPrincipal("100000");
          setRate("7.1");
          setYears("5");
          setCompound("4");
        }}
      >
        Reset example
      </Button>
    </ToolShell>
  );
}
