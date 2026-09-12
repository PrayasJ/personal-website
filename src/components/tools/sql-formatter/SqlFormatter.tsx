"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatSql, sqlDialects, type SqlDialect } from "@/lib/sql";

const EXAMPLE = `select o.id, o.side, o.qty from orders o join fills f on f.order_id = o.id where o.symbol = 'PJX' and o.ts >= '2026-01-01' order by o.ts desc limit 50;`;

export function SqlFormatter() {
  const inputId = useId();
  const outputId = useId();
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<SqlDialect>("postgresql");
  const [error, setError] = useState<string | null>(null);

  function run() {
    const result = formatSql(input, dialect);
    if (!result.ok) {
      setError(result.error);
      setOutput("");
      return;
    }
    setError(null);
    setOutput(result.value);
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Pretty-print SQL in this browser with sql-formatter. Pick a dialect for
        keyword handling. Nothing is sent to a server.
      </p>
      <div className="mt-4 max-w-xs">
        <Select
          label="Dialect"
          value={dialect}
          onChange={(next) => setDialect(next as SqlDialect)}
          options={sqlDialects.map((item) => ({
            value: item.value,
            label: item.label,
          }))}
        />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane tone="in" label="Paste SQL" htmlFor={inputId}>
          <CodeEditor
            id={inputId}
            value={input}
            onChange={setInput}
            minHeightClass="min-h-56 lg:min-h-80"
            placeholder="SELECT 1;"
          />
        </ToolPane>
        <ToolPane
          tone="out"
          label="Formatted"
          htmlFor={outputId}
          actions={<CopyButton value={output} />}
        >
          <CodeEditor
            id={outputId}
            value={output}
            readOnly
            minHeightClass="min-h-56 lg:min-h-80"
            placeholder="Formatted SQL will appear here"
          />
        </ToolPane>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={run}>
          Format SQL
        </Button>
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
