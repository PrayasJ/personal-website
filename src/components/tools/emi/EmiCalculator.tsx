"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolPane } from "@/components/tools/ToolPane";
import { Field, Stat } from "@/components/ui/Field";
import { calculateEmi, formatInr } from "@/lib/emi";

export function EmiCalculator() {
  const [principal, setPrincipal] = useState("500000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("20");

  const result = useMemo(() => {
    const p = Number(principal);
    const r = Number(rate);
    const n = Math.round(Number(years) * 12);
    try {
      return { ok: true as const, value: calculateEmi(p, r, n) };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [principal, rate, years]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Reducing-balance EMI. Monthly rate is annual ÷ 12. Figures are in INR and
        are not a loan offer or advice.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Principal" htmlFor="emi-principal" prefix="₹">
          <input
            id="emi-principal"
            value={principal}
            onChange={(event) => setPrincipal(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Annual rate" htmlFor="emi-rate" suffix="%">
          <input
            id="emi-rate"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Tenure" htmlFor="emi-years" suffix="yrs">
          <input
            id="emi-years"
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
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stat label="EMI" value={formatInr(result.value.emi)} tone="accent" />
            <Stat label="Interest" value={formatInr(result.value.totalInterest)} />
            <Stat label="Total" value={formatInr(result.value.totalPayment)} />
          </div>
          <ToolPane tone="out" label="First 12 months" className="mt-4">
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-80 text-left font-mono text-xs">
                <thead className="text-muted">
                  <tr>
                    <th className="py-1 pr-3 font-medium">Mo</th>
                    <th className="py-1 pr-3 font-medium">EMI</th>
                    <th className="py-1 pr-3 font-medium">Interest</th>
                    <th className="py-1 pr-3 font-medium">Principal</th>
                    <th className="py-1 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.value.schedule.slice(0, 12).map((row) => (
                    <tr key={row.month} className="border-t border-border">
                      <td className="py-1 pr-3">{row.month}</td>
                      <td className="py-1 pr-3">{formatInr(row.payment)}</td>
                      <td className="py-1 pr-3">{formatInr(row.interest)}</td>
                      <td className="py-1 pr-3">{formatInr(row.principal)}</td>
                      <td className="py-1">{formatInr(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ToolPane>
        </>
      )}
      <Button
        variant="ghost"
        className="mt-4"
        onClick={() => {
          setPrincipal("500000");
          setRate("8.5");
          setYears("20");
        }}
      >
        Reset example
      </Button>
    </ToolShell>
  );
}
