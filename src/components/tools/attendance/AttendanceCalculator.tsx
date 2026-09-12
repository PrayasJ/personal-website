"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { Field, Stat } from "@/components/ui/Field";
import { useMemo, useState } from "react";
import { calculateAttendance } from "@/lib/student";

export function AttendanceCalculator() {
  const [attended, setAttended] = useState("42");
  const [total, setTotal] = useState("50");
  const [target, setTarget] = useState("75");

  const result = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: calculateAttendance({
          attended: Number(attended),
          total: Number(total),
          targetPercent: Number(target),
        }),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid.",
      };
    }
  }, [attended, total, target]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Current attendance %, how many classes you can still miss (if already at
        target), or how many more you need to attend to reach the target. Portal
        rounding may differ.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Attended" htmlFor="att-att">
          <input
            id="att-att"
            value={attended}
            onChange={(event) => setAttended(event.target.value)}
            className="field-input"
            inputMode="numeric"
          />
        </Field>
        <Field label="Total held" htmlFor="att-total">
          <input
            id="att-total"
            value={total}
            onChange={(event) => setTotal(event.target.value)}
            className="field-input"
            inputMode="numeric"
          />
        </Field>
        <Field label="Target" htmlFor="att-target" suffix="%">
          <input
            id="att-target"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
      </div>
      {result.ok ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat
            label="Current"
            value={`${result.value.currentPercent.toFixed(2)}%`}
            tone="accent"
          />
          <Stat
            label="Can miss"
            value={
              result.value.canMiss === null
                ? "—"
                : String(result.value.canMiss)
            }
          />
          <Stat
            label="Need to attend"
            value={
              result.value.needToAttend === null
                ? "Unreachable at 100%"
                : String(result.value.needToAttend)
            }
          />
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
