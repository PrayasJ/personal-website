"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckChip } from "@/components/ui/CheckChip";
import { Field } from "@/components/ui/Field";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeHighlight } from "@/components/tools/CodeHighlight";
import { ToolPane } from "@/components/tools/ToolPane";
import { decodeUlidTime, formatUlid, randomUlid } from "@/lib/ulid";
import { tokenizeUlid } from "@/lib/highlight";

export function UlidGenerator() {
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(true);
  const [values, setValues] = useState<string[]>([]);
  const [inspect, setInspect] = useState("");

  function generate() {
    const next = Math.min(100, Math.max(1, count));
    setCount(next);
    setValues(Array.from({ length: next }, () => formatUlid(randomUlid(), uppercase)));
  }

  const decoded = useMemo(() => {
    const raw = inspect.trim() || values[0] || "";
    if (!raw) {
      return { ok: true as const, value: null };
    }
    try {
      const ms = decodeUlidTime(raw);
      return { ok: true as const, value: { ms, iso: new Date(ms).toISOString() } };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid ULID.",
      };
    }
  }, [inspect, values]);

  const joined = values.join("\n");

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        128-bit ULIDs: 48-bit millisecond time plus 80 bits of CSPRNG. Lexicographic
        order follows time. Crockford Base32, no I, L, O, or U.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <Field label="Count" htmlFor="ulid-count" className="w-28">
          <input
            id="ulid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="field-input"
          />
        </Field>
        <div className="chip-row pb-0.5">
          <CheckChip checked={uppercase} onChange={setUppercase}>
            Uppercase
          </CheckChip>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={generate}>
          Generate
        </Button>
        <CopyButton value={joined} label="Copy all" />
      </div>
      <ToolPane tone="out" label="ULIDs" className="mt-4">
        {values.length === 0 ? (
          <p className="mt-2 font-mono text-sm text-muted">Press generate</p>
        ) : (
          <ul className="mt-2 space-y-1 font-mono text-sm tabular-nums">
            {values.map((value, index) => (
              <li key={`${value}-${index}`} className="break-all">
                <CodeHighlight tokens={tokenizeUlid(value)} />
              </li>
            ))}
          </ul>
        )}
      </ToolPane>
      <Field label="Inspect timestamp" htmlFor="ulid-inspect" className="mt-4" hint="Paste any ULID, or read the first generated value.">
        <input
          id="ulid-inspect"
          value={inspect}
          onChange={(event) => setInspect(event.target.value)}
          className="field-input"
          spellCheck={false}
          placeholder={values[0]}
        />
      </Field>
      {decoded.ok && decoded.value ? (
        <p className="mt-3 font-mono text-sm text-ink">
          {decoded.value.iso}{" "}
          <span className="text-muted">({decoded.value.ms} ms)</span>
        </p>
      ) : null}
      {!decoded.ok ? (
        <p className="mt-3 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {decoded.error}
        </p>
      ) : null}
    </ToolShell>
  );
}
