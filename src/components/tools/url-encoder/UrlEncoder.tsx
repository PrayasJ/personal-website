"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Segmented";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";

export function UrlEncoder() {
  const inputId = useId();
  const outputId = useId();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [component, setComponent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function encode() {
    setOutput(component ? encodeURIComponent(input) : encodeURI(input));
    setError(null);
  }

  function decode() {
    try {
      setOutput(component ? decodeURIComponent(input) : decodeURI(input));
      setError(null);
    } catch {
      setError("The input is not a valid percent-encoded string.");
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        encodeURIComponent encodes query values. encodeURI leaves : / ? # intact
        for full URLs.
      </p>
      <Segmented
        className="mt-4"
        label="Mode"
        value={component ? "component" : "uri"}
        onChange={(next) => setComponent(next === "component")}
        options={[
          { value: "component", label: "Component" },
          { value: "uri", label: "Full URI" },
        ] as const}
      />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane tone="in" label="Input" htmlFor={inputId}>
          <CodeEditor
            id={inputId}
            value={input}
            onChange={setInput}
            lang="url"
            placeholder="https://prayas.dev/tools?q=json formatter"
          />
        </ToolPane>
        <ToolPane
          tone="out"
          label="Output"
          htmlFor={outputId}
          actions={<CopyButton value={output} />}
        >
          <CodeEditor
            id={outputId}
            value={output}
            lang="url"
            readOnly
            placeholder="Encoded or decoded text"
          />
        </ToolPane>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Button variant="primary" className="w-full sm:w-auto" onClick={encode}>
          Encode
        </Button>
        <Button className="w-full sm:w-auto" onClick={decode}>
          Decode
        </Button>
        <Button
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
        >
          Clear
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
