"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useMemo, useState } from "react";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { diffLines } from "@/lib/diff";

export function TextDiff() {
  const leftId = useId();
  const rightId = useId();
  const [left, setLeft] = useState("buy 1 PJX @ 100.10\nflat\n");
  const [right, setRight] = useState("buy 1 PJX @ 100.40\nshort 2\n");
  const lines = useMemo(() => diffLines(left, right), [left, right]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Line-level diff in this browser. First 4,000 lines on each side. It is not
        git, and it does not ignore whitespace unless you already did.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane tone="in" label="Original" htmlFor={leftId}>
          <CodeEditor id={leftId} value={left} onChange={setLeft} />
        </ToolPane>
        <ToolPane tone="out" label="Changed" htmlFor={rightId}>
          <CodeEditor id={rightId} value={right} onChange={setRight} />
        </ToolPane>
      </div>
      <ToolPane tone="out" label="Diff" className="mt-4">
        <pre className="tool-code max-h-80">
          {lines.map((line, index) => (
            <span
              key={`${line.kind}-${index}`}
              className={
                line.kind === "add"
                  ? "diff-add"
                  : line.kind === "del"
                    ? "diff-del"
                    : "block text-ink"
              }
            >
              {line.kind === "add" ? "+" : line.kind === "del" ? "-" : " "}
              {line.text}
              {"\n"}
            </span>
          ))}
        </pre>
      </ToolPane>
    </ToolShell>
  );
}
