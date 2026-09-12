"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckChip } from "@/components/ui/CheckChip";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { csvToJson, jsonToCsv } from "@/lib/csv";

const EXAMPLE = `symbol,side,qty
PJX,BUY,1
PJX,SELL,2
`;

export function CsvJson() {
  const csvId = useId();
  const jsonId = useId();
  const [csv, setCsv] = useState(EXAMPLE);
  const [json, setJson] = useState("");
  const [header, setHeader] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function toJson() {
    try {
      setJson(`${JSON.stringify(csvToJson(csv, header), null, 2)}\n`);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "CSV could not be parsed.");
    }
  }

  function toCsv() {
    try {
      setCsv(`${jsonToCsv(json)}\n`);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "JSON could not be converted.");
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        First 2,000 rows. Quoted commas are kept. This is not Excel, and types stay
        strings unless you convert them yourself.
      </p>
      <div className="chip-row mt-4">
        <CheckChip checked={header} onChange={setHeader}>
          First CSV row is a header
        </CheckChip>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane
          tone="in"
          label="CSV"
          htmlFor={csvId}
          actions={<CopyButton value={csv} label="Copy CSV" />}
        >
          <CodeEditor id={csvId} value={csv} onChange={setCsv} />
        </ToolPane>
        <ToolPane
          tone="out"
          label="JSON"
          htmlFor={jsonId}
          actions={<CopyButton value={json} label="Copy JSON" />}
        >
          <CodeEditor id={jsonId} value={json} onChange={setJson} lang="json" />
        </ToolPane>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={toJson}>
          CSV → JSON
        </Button>
        <Button onClick={toCsv}>JSON → CSV</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setCsv(EXAMPLE);
            setJson("");
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
