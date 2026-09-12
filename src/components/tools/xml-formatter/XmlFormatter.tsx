"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { Button } from "@/components/ui/Button";
import { formatXml } from "@/lib/xml";

const EXAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item id="1"><name>Prayas</name><active>true</active></item>
  <item id="2"><name>PJX</name><active>false</active></item>
</root>`;

export function XmlFormatter() {
  const inputId = useId();
  const outputId = useId();
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run(pretty: boolean) {
    const result = formatXml(input, pretty);
    if (!result.ok) {
      setError(result.error.message);
      setOutput("");
      return;
    }
    setError(null);
    setOutput(result.value);
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Pretty-print or minify XML with the browser&apos;s DOMParser. Nothing is
        uploaded. Invalid XML shows the parser error.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane tone="in" label="Paste XML" htmlFor={inputId}>
          <CodeEditor
            id={inputId}
            value={input}
            onChange={setInput}
            minHeightClass="min-h-56 lg:min-h-80"
            placeholder="<root/>"
          />
        </ToolPane>
        <ToolPane
          tone="out"
          label="Result"
          htmlFor={outputId}
          actions={<CopyButton value={output} />}
        >
          <CodeEditor
            id={outputId}
            value={output}
            readOnly
            minHeightClass="min-h-56 lg:min-h-80"
            placeholder="Formatted XML will appear here"
          />
        </ToolPane>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => run(true)}>
          Format XML
        </Button>
        <Button onClick={() => run(false)}>Minify</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setInput(EXAMPLE);
            setOutput("");
            setError(null);
          }}
        >
          Load example
        </Button>
        <Button
          variant="ghost"
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
        <p
          className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </ToolShell>
  );
}
