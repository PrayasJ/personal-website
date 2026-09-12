"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useMemo, useState } from "react";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { inspectUnicode } from "@/lib/unicode";

export function UnicodeInspector() {
  const inputId = useId();
  const [input, setInput] = useState("PJX ₹");
  const points = useMemo(() => inspectUnicode(input), [input]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        First 400 code points. Graphemes follow JS string iteration, which is
        code points, not grapheme clusters.
      </p>
      <ToolPane tone="in" label="Text" htmlFor={inputId} className="mt-4">
        <CodeEditor
          id={inputId}
          value={input}
          onChange={setInput}
          minHeightClass="min-h-24"
          rows={3}
        />
      </ToolPane>
      <ToolPane tone="out" label="Code points" className="mt-4">
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-80 text-left font-mono text-xs">
            <thead className="text-muted">
              <tr>
                <th className="py-1 pr-3 font-medium">Char</th>
                <th className="py-1 pr-3 font-medium">Code</th>
                <th className="py-1 pr-3 font-medium">Dec</th>
                <th className="py-1 font-medium">UTF-8</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point, index) => (
                <tr key={`${point.hex}-${index}`} className="border-t border-border">
                  <td className="py-1 pr-3 text-ink">{point.char}</td>
                  <td className="py-1 pr-3 text-ink">{point.hex}</td>
                  <td className="py-1 pr-3 text-ink">{point.dec}</td>
                  <td className="py-1 text-ink">{point.utf8}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolPane>
    </ToolShell>
  );
}
