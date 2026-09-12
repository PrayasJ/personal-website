"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { parseJson } from "@/lib/json";
import { jsonToTs } from "@/lib/tsstruct";

const EXAMPLE = `{
  "name": "Prayas",
  "active": true,
  "fills": 12,
  "meta": {
    "venue": "toy",
    "symbols": ["PJX"]
  }
}`;

export function JsonToTs() {
  const jsonId = useId();
  const [json, setJson] = useState(EXAMPLE);
  const [rootName, setRootName] = useState("Root");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function convert() {
    const parsed = parseJson(json);
    if (!parsed.ok) {
      setError(parsed.error.hint);
      setOutput("");
      return;
    }
    setOutput(jsonToTs(parsed.value, rootName.trim() || "Root"));
    setError(null);
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Nested objects become named interfaces. Arrays use the first element.
        This is a starting point, not a full JSON Schema compiler.
      </p>
      <Field label="Root type" htmlFor="ts-root" className="mt-4 max-w-xs">
        <input
          id="ts-root"
          value={rootName}
          onChange={(event) => setRootName(event.target.value)}
          className="field-input"
          spellCheck={false}
        />
      </Field>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane tone="in" label="JSON" htmlFor={jsonId}>
          <CodeEditor
            id={jsonId}
            value={json}
            onChange={setJson}
            lang="json"
            minHeightClass="min-h-40 lg:min-h-64"
          />
        </ToolPane>
        <ToolPane
          tone="out"
          label="TypeScript"
          actions={<CopyButton value={output} label="Copy TS" />}
        >
          <CodeEditor
            value={output}
            lang="ts"
            readOnly
            placeholder="Interfaces appear here"
            minHeightClass="min-h-40 lg:min-h-64"
          />
        </ToolPane>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={convert}>
          Generate types
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setJson(EXAMPLE);
            setOutput("");
            setError(null);
          }}
        >
          Load example
        </Button>
      </div>
      {error ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </ToolShell>
  );
}
