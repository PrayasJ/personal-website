"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { calculateHraExemption, formatInr } from "@/lib/salary";

export function HraCalculator() {
  const [basic, setBasic] = useState("480000");
  const [hra, setHra] = useState("240000");
  const [rent, setRent] = useState("300000");
  const [city, setCity] = useState<"metro" | "other">("metro");

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: calculateHraExemption(
          Number(basic),
          Number(hra),
          Number(rent),
          city === "metro",
        ),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the inputs.",
      };
    }
  }, [basic, hra, rent, city]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Old-regime HRA exemption under section 10(13A): the least of actual HRA,
        50% / 40% of basic (metro / other), and rent paid minus 10% of basic.
        The new regime does not allow this exemption. Annual figures. Not tax
        advice.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Basic / year" htmlFor="hra-basic" prefix="₹">
          <input
            id="hra-basic"
            value={basic}
            onChange={(event) => setBasic(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="HRA received / year" htmlFor="hra-recv" prefix="₹">
          <input
            id="hra-recv"
            value={hra}
            onChange={(event) => setHra(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Field label="Rent paid / year" htmlFor="hra-rent" prefix="₹">
          <input
            id="hra-rent"
            value={rent}
            onChange={(event) => setRent(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
      </div>
      <Segmented
        className="mt-4"
        label="City"
        value={city}
        onChange={setCity}
        options={[
          { value: "metro", label: "Metro 50%" },
          { value: "other", label: "Other 40%" },
        ]}
      />
      {!result.ok ? (
        <p
          className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {result.error}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Actual HRA" value={formatInr(result.value.actualHra)} />
          <Stat
            label={result.value.metro ? "50% of basic" : "40% of basic"}
            value={formatInr(result.value.percentOfBasic)}
          />
          <Stat
            label="Rent − 10% basic"
            value={formatInr(result.value.rentMinusTenPercent)}
          />
          <Stat
            label="Exempt HRA"
            value={formatInr(result.value.exemption)}
            tone="accent"
          />
          <Stat label="Taxable HRA" value={formatInr(result.value.taxableHra)} />
        </div>
      )}
    </ToolShell>
  );
}
