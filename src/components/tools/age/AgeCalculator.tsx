"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { Field, Stat } from "@/components/ui/Field";
import { useMemo, useState } from "react";
import { calculateAge, parseLocalDate } from "@/lib/student";

function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function AgeCalculator() {
  const [dob, setDob] = useState("2000-01-15");
  const [asOf, setAsOf] = useState(todayIso);

  const result = useMemo(() => {
    try {
      const birth = parseLocalDate(dob);
      const until = parseLocalDate(asOf);
      return { ok: true as const, value: calculateAge(birth, until) };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid.",
      };
    }
  }, [dob, asOf]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Exact calendar age in years, months, and days from date of birth. Dates
        use your local calendar (YYYY-MM-DD). Not a legal age verification
        service.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Date of birth" htmlFor="age-dob">
          <input
            id="age-dob"
            type="date"
            value={dob}
            onChange={(event) => setDob(event.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="As of" htmlFor="age-asof">
          <input
            id="age-asof"
            type="date"
            value={asOf}
            onChange={(event) => setAsOf(event.target.value)}
            className="field-input"
          />
        </Field>
      </div>
      {result.ok ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Years" value={String(result.value.years)} tone="accent" />
          <Stat label="Months" value={String(result.value.months)} />
          <Stat label="Days" value={String(result.value.days)} />
          <Stat label="Total days" value={String(result.value.totalDays)} />
        </div>
      ) : (
        <p
          className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {result.error}
        </p>
      )}
    </ToolShell>
  );
}
