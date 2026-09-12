"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { Select } from "@/components/ui/Select";
import { CopyButton } from "@/components/tools/CopyButton";
import {
  formatSize,
  formatUnit,
  iecUnits,
  siUnits,
  toBytes,
  type SizeUnit,
} from "@/lib/bytesize";

export function ByteSize() {
  const [amount, setAmount] = useState("1536");
  const [unit, setUnit] = useState<SizeUnit>("B");
  const [binary, setBinary] = useState(true);
  const units = binary ? iecUnits : siUnits;

  const result = useMemo(() => {
    try {
      const bytes = toBytes(Number(amount), unit, binary);
      return { ok: true as const, bytes };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Check the size.",
      };
    }
  }, [amount, unit, binary]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        IEC uses 1024 (KiB, MiB). SI uses 1000 (kB, MB). Payload sizes in logs
        are usually IEC. This is not a disk-manufacturer conversion.
      </p>
      <Segmented
        className="mt-4"
        label="Base"
        value={binary ? "iec" : "si"}
        onChange={(next) => {
          setBinary(next === "iec");
          setUnit("B");
        }}
        options={[
          { value: "iec", label: "IEC 1024" },
          { value: "si", label: "SI 1000" },
        ] as const}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Value" htmlFor="byte-amount">
          <input
            id="byte-amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Select
          label="Unit"
          value={unit}
          onChange={(next) => setUnit(next as SizeUnit)}
          options={units.map((item) => ({
            value: item,
            label: item,
            hint: item === "B" ? "Bytes" : binary ? "1024-based" : "1000-based",
          }))}
        />
      </div>
      {!result.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {result.error}
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <Stat
              className="flex-1"
              label="Human"
              value={formatSize(result.bytes, binary)}
              tone="accent"
            />
            <CopyButton value={formatSize(result.bytes, binary)} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((item) => (
              <Stat
                key={item}
                label={item}
                value={formatUnit(result.bytes, item, binary)}
              />
            ))}
          </div>
        </>
      )}
    </ToolShell>
  );
}
