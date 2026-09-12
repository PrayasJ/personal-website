"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useMemo, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { Button } from "@/components/ui/Button";
import { inspectUrl, type InspectedUrl } from "@/lib/urlparse";

const FIELDS: { key: Exclude<keyof InspectedUrl, "params">; label: string }[] = [
  { key: "href", label: "Href" },
  { key: "origin", label: "Origin" },
  { key: "protocol", label: "Protocol" },
  { key: "hostname", label: "Hostname" },
  { key: "port", label: "Port" },
  { key: "pathname", label: "Path" },
  { key: "search", label: "Search" },
  { key: "hash", label: "Hash" },
];

export function UrlInspector() {
  const inputId = useId();
  const [input, setInput] = useState("https://prayas.dev/tools?q=json+formatter#desk");
  const parsed = useMemo(() => {
    if (!input.trim()) {
      return { ok: true as const, value: null };
    }
    try {
      return { ok: true as const, value: inspectUrl(input) };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Could not parse that URL.",
      };
    }
  }, [input]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Uses the browser URL parser. A leading ? is treated as a query string. Missing
        schemes get https://. Passwords are masked.
      </p>
      <ToolPane tone="in" label="URL" htmlFor={inputId} className="mt-4">
        <CodeEditor
          id={inputId}
          value={input}
          onChange={setInput}
          lang="url"
          minHeightClass="min-h-24"
          rows={3}
        />
      </ToolPane>
      <div className="mt-3">
        <Button
          variant="ghost"
          onClick={() => setInput("https://prayas.dev/tools?q=json+formatter#desk")}
        >
          Load example
        </Button>
      </div>
      {!parsed.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {parsed.error}
        </p>
      ) : null}
      {parsed.ok && parsed.value ? (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {FIELDS.map((field) => {
            const value = String(parsed.value[field.key] ?? "");
            return (
              <div key={field.key}>
                <dt className="tape">{field.label}</dt>
                <dd className="break-all font-mono text-sm text-ink">{value || "—"}</dd>
              </div>
            );
          })}
        </dl>
      ) : null}
      {parsed.ok && parsed.value && parsed.value.params.length > 0 ? (
        <ToolPane
          tone="out"
          label="Query"
          className="mt-4"
          actions={
            <CopyButton
              value={parsed.value.params.map((pair) => `${pair.key}=${pair.value}`).join("\n")}
              label="Copy pairs"
            />
          }
        >
          <ul className="mt-2 space-y-1 font-mono text-sm">
            {parsed.value.params.map((pair, index) => (
              <li key={`${pair.key}-${index}`} className="break-all">
                <span className="syn-key">{pair.key}</span>
                <span className="syn-punct">=</span>
                <span className="syn-string">{pair.value}</span>
              </li>
            ))}
          </ul>
        </ToolPane>
      ) : null}
    </ToolShell>
  );
}
