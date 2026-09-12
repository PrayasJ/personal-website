"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { ToolPane } from "@/components/tools/ToolPane";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { bases, formatBigInt, parseBigInt, type NumericBase } from "@/lib/numbase";

const LABELS: Record<NumericBase, string> = {
  2: "Binary",
  8: "Octal",
  10: "Decimal",
  16: "Hex",
};

const HINTS: Record<NumericBase, string> = {
  2: "Base 2 · 0b",
  8: "Base 8 · 0o",
  10: "Base 10",
  16: "Base 16 · 0x",
};

export function NumberBase() {
  const [from, setFrom] = useState<NumericBase>(10);
  const [input, setInput] = useState("255");
  const parsed = useMemo(() => {
    if (!input.trim()) {
      return { ok: true as const, value: null };
    }
    try {
      return { ok: true as const, value: parseBigInt(input, from) };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid number.",
      };
    }
  }, [input, from]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Integer conversion with BigInt, so it is not limited to 53 bits. Prefixes
        0x, 0b, and 0o are accepted in the matching base.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Select
          label="From"
          value={String(from)}
          onChange={(next) => setFrom(Number(next) as NumericBase)}
          options={bases.map((base) => ({
            value: String(base),
            label: LABELS[base],
            hint: HINTS[base],
          }))}
        />
        <Field label="Value" htmlFor="numbase-value">
          <input
            id="numbase-value"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="field-input"
            spellCheck={false}
          />
        </Field>
      </div>
      {!parsed.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {parsed.error}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {bases.map((base) => {
            const value = parsed.value == null ? "" : formatBigInt(parsed.value, base);
            return (
              <ToolPane
                key={base}
                tone={base === from ? "in" : "out"}
                label={LABELS[base]}
                actions={<CopyButton value={value} />}
              >
                <p className="mt-2 break-all font-mono text-sm text-ink">{value || "—"}</p>
              </ToolPane>
            );
          })}
        </div>
      )}
    </ToolShell>
  );
}
