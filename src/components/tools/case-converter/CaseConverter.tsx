"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useMemo, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { caseLabels, convertCase, type CaseName } from "@/lib/caseconvert";

const NAMES = Object.keys(caseLabels) as CaseName[];

export function CaseConverter() {
  const inputId = useId();
  const [input, setInput] = useState("Tape trader blotter");
  const results = useMemo(
    () => NAMES.map((name) => ({ name, value: convertCase(input, name) })),
    [input],
  );

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Split on spaces, dashes, underscores, and camel humps. Accents and
        punctuation are dropped. Slug is kebab-case.
      </p>
      <ToolPane tone="in" label="Input" htmlFor={inputId} className="mt-4">
        <CodeEditor
          id={inputId}
          value={input}
          onChange={setInput}
          minHeightClass="min-h-24"
          rows={3}
        />
      </ToolPane>
      <ul className="mt-4 space-y-3">
        {results.map((row) => (
          <li key={row.name}>
            <ToolPane
              tone="out"
              label={caseLabels[row.name]}
              actions={<CopyButton value={row.value} />}
            >
              <p className="mt-2 break-all font-mono text-sm text-ink">{row.value || "—"}</p>
            </ToolPane>
          </li>
        ))}
      </ul>
    </ToolShell>
  );
}
