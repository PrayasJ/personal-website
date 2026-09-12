"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckChip } from "@/components/ui/CheckChip";
import { Field } from "@/components/ui/Field";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeHighlight } from "@/components/tools/CodeHighlight";
import { ToolPane } from "@/components/tools/ToolPane";
import { formatUuid, randomUuid } from "@/lib/uuid";
import { tokenizeUuid } from "@/lib/highlight";

export function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [values, setValues] = useState<string[]>(() => [formatUuid(randomUuid(), false, true)]);

  function generate() {
    const next = Math.min(100, Math.max(1, count));
    setCount(next);
    setValues(
      Array.from({ length: next }, () => formatUuid(randomUuid(), uppercase, hyphens)),
    );
  }

  const joined = values.join("\n");

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Version 4 UUIDs from the Web Crypto API. Nothing is allocated on a server.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <Field label="Count" htmlFor="uuid-count" className="w-28">
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="field-input"
          />
        </Field>
        <div className="chip-row pb-0.5">
          <CheckChip checked={hyphens} onChange={setHyphens}>
            Hyphens
          </CheckChip>
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
      <ToolPane tone="out" label="UUIDs" className="mt-4">
        <ul className="mt-2 space-y-1 font-mono text-sm tabular-nums">
          {values.map((value, index) => (
            <li key={`${value}-${index}`} className="break-all">
              <CodeHighlight tokens={tokenizeUuid(value)} />
            </li>
          ))}
        </ul>
      </ToolPane>
    </ToolShell>
  );
}
