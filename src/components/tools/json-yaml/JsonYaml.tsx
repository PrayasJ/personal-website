"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { parseJson } from "@/lib/json";
import { jsonToYaml, yamlToValue } from "@/lib/yaml";

const EXAMPLE = `{
  "name": "Prayas",
  "tools": ["json-formatter", "tape-trader"],
  "meta": { "local": true, "count": 2 }
}`;

export function JsonYaml() {
  const jsonId = useId();
  const yamlId = useId();
  const [json, setJson] = useState("");
  const [yaml, setYaml] = useState("");
  const [error, setError] = useState<string | null>(null);

  function toYaml() {
    const parsed = parseJson(json);
    if (!parsed.ok) {
      setError(parsed.error.hint);
      return;
    }
    setYaml(jsonToYaml(parsed.value));
    setError(null);
  }

  function toJson() {
    try {
      const value = yamlToValue(yaml);
      setJson(JSON.stringify(value, null, 2) + "\n");
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "YAML could not be parsed.");
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        JSON-compatible YAML only: maps, lists, and scalars. No anchors or tags.
        Conversion stays in this browser.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane
          tone="in"
          label="JSON"
          htmlFor={jsonId}
          actions={<CopyButton value={json} label="Copy JSON" />}
        >
          <CodeEditor
            id={jsonId}
            value={json}
            onChange={setJson}
            lang="json"
            placeholder='{"hello": "world"}'
            minHeightClass="min-h-40 lg:min-h-72"
          />
        </ToolPane>
        <ToolPane
          tone="out"
          label="YAML"
          htmlFor={yamlId}
          actions={<CopyButton value={yaml} label="Copy YAML" />}
        >
          <CodeEditor
            id={yamlId}
            value={yaml}
            onChange={setYaml}
            lang="yaml"
            placeholder={"hello: world\n"}
            minHeightClass="min-h-40 lg:min-h-72"
          />
        </ToolPane>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Button variant="primary" className="w-full sm:w-auto" onClick={toYaml}>
          JSON → YAML
        </Button>
        <Button className="w-full sm:w-auto" onClick={toJson}>
          YAML → JSON
        </Button>
        <Button
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => {
            setJson(EXAMPLE);
            setYaml("");
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
