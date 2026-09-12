"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { toolInputAccentClass } from "@/components/tools/tool-ui";
import { parseJson } from "@/lib/json";
import { jsonToGo } from "@/lib/gostruct";

const EXAMPLE = `{
  "name": "Prayas",
  "active": true,
  "fills": 12,
  "meta": {
    "venue": "toy",
    "symbols": ["PJX"]
  }
}`;

export function JsonToGo() {
  const jsonId = useId();
  const nameId = useId();
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
    const name = rootName.trim() || "Root";
    setOutput(jsonToGo(parsed.value, name));
    setError(null);
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Nested objects become named structs. Numbers that look like integers become
        int64. This is a starting point, not gofmt.
      </p>
      <label htmlFor={nameId} className="mt-4 block text-sm font-medium text-ink">
        Root type
        <input
          id={nameId}
          value={rootName}
          onChange={(event) => setRootName(event.target.value)}
          className={`${toolInputAccentClass} mt-1 max-w-xs`}
          spellCheck={false}
        />
      </label>
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
          label="Go"
          actions={<CopyButton value={output} label="Copy Go" />}
        >
          <CodeEditor
            value={output}
            lang="go"
            readOnly
            placeholder="Structs appear here"
            minHeightClass="min-h-40 lg:min-h-64"
          />
        </ToolPane>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={convert}>
          Generate struct
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
