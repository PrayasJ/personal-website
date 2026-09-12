"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { buildQuery, parseQuery, type QueryPair } from "@/lib/querystring";

const EXAMPLE = "symbol=PJX&side=BUY&qty=1";

export function QueryString() {
  const rawId = useId();
  const [raw, setRaw] = useState(EXAMPLE);
  const [pairs, setPairs] = useState<QueryPair[]>(() => parseQuery(EXAMPLE));
  const [error, setError] = useState<string | null>(null);

  function parse() {
    try {
      setPairs(parseQuery(raw));
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not parse.");
    }
  }

  function build() {
    setRaw(buildQuery(pairs));
    setError(null);
  }

  function update(index: number, key: keyof QueryPair, value: string) {
    setPairs((current) =>
      current.map((pair, i) => (i === index ? { ...pair, [key]: value } : pair)),
    );
  }

  const encoded = buildQuery(pairs);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        application/x-www-form-urlencoded via URLSearchParams. Spaces become +.
        Repeated keys are kept. This is not a full URL parser — use the inspector
        for origin and path.
      </p>
      <ToolPane tone="in" label="Query string" htmlFor={rawId} className="mt-4">
        <CodeEditor
          id={rawId}
          value={raw}
          onChange={setRaw}
          lang="url"
          minHeightClass="min-h-24"
          rows={3}
          placeholder="symbol=PJX&side=BUY"
        />
      </ToolPane>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="primary" onClick={parse}>
          Parse
        </Button>
        <Button onClick={build}>Build</Button>
        <CopyButton value={encoded} label="Copy query" />
        <Button
          variant="ghost"
          onClick={() => {
            setRaw(EXAMPLE);
            setPairs(parseQuery(EXAMPLE));
            setError(null);
          }}
        >
          Load example
        </Button>
      </div>
      <div className="mt-4 space-y-3">
        {pairs.map((pair, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Field label="Key" htmlFor={`q-k-${index}`}>
              <input
                id={`q-k-${index}`}
                value={pair.key}
                onChange={(event) => update(index, "key", event.target.value)}
                className="field-input"
                spellCheck={false}
              />
            </Field>
            <Field label="Value" htmlFor={`q-v-${index}`}>
              <input
                id={`q-v-${index}`}
                value={pair.value}
                onChange={(event) => update(index, "value", event.target.value)}
                className="field-input"
                spellCheck={false}
              />
            </Field>
            <div className="flex items-end pb-0.5">
              <Button
                variant="ghost"
                onClick={() => setPairs((current) => current.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        className="mt-3"
        variant="ghost"
        onClick={() => setPairs((current) => [...current, { key: "", value: "" }])}
      >
        Add pair
      </Button>
      {error ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </ToolShell>
  );
}
