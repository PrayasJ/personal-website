"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeHighlight } from "@/components/tools/CodeHighlight";
import { ToolPane } from "@/components/tools/ToolPane";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import {
  cronPresets,
  defaultCronFields,
  describeCron,
  joinCron,
  parseCron,
  type CronFieldName,
  type CronFields,
} from "@/lib/cron";
import { tokenizeCron } from "@/lib/highlight";

const fields: { key: CronFieldName; label: string }[] = [
  { key: "minute", label: "Minute" },
  { key: "hour", label: "Hour" },
  { key: "dom", label: "Day of month" },
  { key: "month", label: "Month" },
  { key: "dow", label: "Day of week" },
];

export function CronBuilder() {
  const [values, setValues] = useState<CronFields>(defaultCronFields);
  const [error, setError] = useState<string | null>(null);
  const expression = joinCron(values);
  const matched = cronPresets.find((preset) => preset.expression === expression);

  const description = useMemo(() => {
    try {
      return describeCron(expression);
    } catch (caught) {
      return caught instanceof Error ? caught.message : "Invalid expression.";
    }
  }, [expression]);

  function setField(key: CronFieldName, value: string) {
    setValues((current) => ({ ...current, [key]: value || "*" }));
    setError(null);
  }

  function loadExpression(next: string) {
    if (next === "custom") {
      return;
    }
    const parsed = parseCron(next);
    if (!parsed) {
      setError("Use five fields: minute hour day-of-month month day-of-week.");
      return;
    }
    setValues(parsed);
    setError(null);
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Standard 5-field cron (minute hour day-of-month month day-of-week). This is
        not Quartz and not a 6-field seconds expression.
      </p>
      <Select
        className="mt-4 max-w-md"
        label="Preset"
        value={matched?.expression ?? "custom"}
        onChange={loadExpression}
        options={[
          { value: "custom", label: "Custom", hint: expression },
          ...cronPresets.map((preset) => ({
            value: preset.expression,
            label: preset.label,
            hint: preset.expression,
          })),
        ]}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {fields.map((field) => (
          <div key={field.key} className="cron-field">
            <Field label={field.label} htmlFor={`cron-${field.key}`}>
              <input
                id={`cron-${field.key}`}
                value={values[field.key]}
                onChange={(event) => setField(field.key, event.target.value)}
                className="field-input"
                spellCheck={false}
              />
            </Field>
          </div>
        ))}
      </div>
      <ToolPane
        tone="out"
        label="Expression"
        className="mt-4"
        actions={<CopyButton value={expression} label="Copy expression" />}
      >
        <p className="mt-2 font-mono text-lg">
          <CodeHighlight tokens={tokenizeCron(expression)} />
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </ToolPane>
      {error ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </ToolShell>
  );
}
