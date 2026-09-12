"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckChip } from "@/components/ui/CheckChip";
import { Field } from "@/components/ui/Field";
import { CopyButton } from "@/components/tools/CopyButton";
import { ToolPane } from "@/components/tools/ToolPane";
import { randomPassword, type PasswordSets } from "@/lib/password";

const INITIAL: PasswordSets = {
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
};

export function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [sets, setSets] = useState<PasswordSets>(INITIAL);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function generate() {
    try {
      setValue(randomPassword(length, sets));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not generate.");
    }
  }

  function toggle(key: keyof PasswordSets) {
    setSets((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        crypto.getRandomValues in this browser. This is not a password manager and
        nothing is stored.
      </p>
      <Field label="Length" htmlFor="pw-length" suffix="chars" className="mt-4 max-w-48">
        <input
          id="pw-length"
          type="number"
          min={4}
          max={128}
          value={length}
          onChange={(event) => setLength(Number(event.target.value))}
          className="field-input"
        />
      </Field>
      <div className="chip-row mt-3">
        {(
          [
            ["lower", "a–z"],
            ["upper", "A–Z"],
            ["digits", "0–9"],
            ["symbols", "symbols"],
          ] as const
        ).map(([key, label]) => (
          <CheckChip key={key} checked={sets[key]} onChange={() => toggle(key)}>
            {label}
          </CheckChip>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={generate}>
          Generate
        </Button>
        <CopyButton value={value} />
      </div>
      {error ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <ToolPane tone="out" label="Password" className="mt-4">
        <p className="mt-2 break-all font-mono text-lg text-ink">{value || "Press generate"}</p>
      </ToolPane>
    </ToolShell>
  );
}
