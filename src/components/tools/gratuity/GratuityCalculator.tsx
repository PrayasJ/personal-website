"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { calculateGratuity, formatInr } from "@/lib/india";

export function GratuityCalculator() {
  const [salary, setSalary] = useState("50000");
  const [years, setYears] = useState("7");
  const [covered, setCovered] = useState(true);

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: calculateGratuity(Number(salary), Number(years), covered),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [salary, years, covered]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Payment of Gratuity Act: (last drawn × 15 × years) / 26, with a ₹20 lakh
        cap. Non-covered shops often use /30. More than six months rounds up.
        Not legal advice.
      </p>
      <Segmented
        className="mt-4"
        label="Coverage"
        value={covered ? "act" : "other"}
        onChange={(next) => setCovered(next === "act")}
        options={[
          { value: "act", label: "Act / 26" },
          { value: "other", label: "Non-covered / 30" },
        ] as const}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Last drawn (basic + DA)" htmlFor="gratuity-salary" prefix="₹">
          <input
            id="gratuity-salary"
            value={salary}
            onChange={(event) => setSalary(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Service" htmlFor="gratuity-years" suffix="yrs">
          <input
            id="gratuity-years"
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
          <Stat label="Years counted" value={String(result.value.yearsCounted)} />
          <Stat
            label="Gratuity"
            value={formatInr(result.value.amount)}
            tone="accent"
            hint={result.value.capped ? "Capped at ₹20 lakh" : undefined}
          />
          <Stat
            label="Formula"
            value={covered ? "× 15 / 26" : "× 15 / 30"}
          />
        </div>
      )}
      <Button
        variant="ghost"
        className="mt-4"
        onClick={() => {
          setSalary("50000");
          setYears("7");
          setCovered(true);
        }}
      >
        Reset example
      </Button>
    </ToolShell>
  );
}
