"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { useMemo, useState } from "react";
import { cgpaToPercentage } from "@/lib/student";

type Mode = "9.5" | "custom";

export function CgpaToPercentage() {
  const [cgpa, setCgpa] = useState("8.2");
  const [mode, setMode] = useState<Mode>("9.5");
  const [custom, setCustom] = useState("9.5");

  const result = useMemo(() => {
    try {
      const multiplier = mode === "9.5" ? 9.5 : Number(custom);
      return {
        ok: true as const,
        value: cgpaToPercentage(Number(cgpa), multiplier),
        multiplier,
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid.",
      };
    }
  }, [cgpa, mode, custom]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Percentage = CGPA × multiplier. Default is ×9.5 (a common CBSE-style rule
        of thumb). Boards and universities often differ — use the factor from your
        handbook when you have it.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="CGPA" htmlFor="cgpa">
          <input
            id="cgpa"
            value={cgpa}
            onChange={(event) => setCgpa(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Stat
          label="Percentage"
          value={result.ok ? `${result.value.toFixed(2)}%` : result.error}
          tone={result.ok ? "accent" : "default"}
        />
      </div>
      <Segmented
        className="mt-4"
        label="Multiplier"
        value={mode}
        onChange={setMode}
        options={[
          { value: "9.5", label: "× 9.5" },
          { value: "custom", label: "Custom" },
        ]}
      />
      {mode === "custom" ? (
        <div className="mt-3">
          <Field label="Custom multiplier" htmlFor="cgpa-mult">
            <input
              id="cgpa-mult"
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
        </div>
      ) : null}
      {result.ok ? (
        <p className="mt-3 text-xs text-muted">
          Using multiplier {result.multiplier}. Not an official transcript
          conversion.
        </p>
      ) : null}
    </ToolShell>
  );
}
