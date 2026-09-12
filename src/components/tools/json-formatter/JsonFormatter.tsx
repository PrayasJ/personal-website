"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { Button } from "@/components/ui/Button";
import {
  countLines,
  isBlankJson,
  parseJson,
  type JsonIssue,
} from "@/lib/json";

const EXAMPLE = `{
  "name": "Prayas",
  "active": true,
  "tools": ["json-formatter", "tape-trader", "unix-timestamp"],
  "meta": {
    "count": 3,
    "local": true
  }
}`;

type Status =
  | { kind: "idle" }
  | { kind: "valid"; message: string }
  | { kind: "error"; error: JsonIssue };

export function JsonFormatter() {
  const inputId = useId();
  const outputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const stats = useMemo(() => {
    const source = output || input;
    return {
      lines: countLines(source),
      characters: source.length,
    };
  }, [input, output]);

  function run(mode: "pretty" | "minify" | "validate") {
    if (isBlankJson(input)) {
      setOutput("");
      setStatus({
        kind: "error",
        error: {
          title: "JSON is empty",
          hint: "Paste JSON into the input area, then format, minify or validate.",
          technical: "No JSON text was provided.",
        },
      });
      return;
    }

    const result = parseJson(input);
    if (!result.ok) {
      setStatus({ kind: "error", error: result.error });
      return;
    }

    if (mode === "pretty") {
      setOutput(result.pretty);
      setStatus({ kind: "valid", message: "Formatted JSON." });
    } else if (mode === "minify") {
      setOutput(result.minified);
      setStatus({ kind: "valid", message: "Minified JSON." });
    } else {
      setStatus({ kind: "valid", message: "Valid JSON." });
    }
  }

  function clear() {
    setInput("");
    setOutput("");
    setStatus({ kind: "idle" });
  }

  function loadExample() {
    setInput(EXAMPLE);
    setOutput("");
    setStatus({ kind: "idle" });
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      run("pretty");
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const target = event.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const next = `${input.slice(0, start)}  ${input.slice(end)}`;
      setInput(next);
      requestAnimationFrame(() => {
        const node = inputRef.current;
        if (!node) {
          return;
        }
        node.selectionStart = start + 2;
        node.selectionEnd = start + 2;
      });
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Your data is processed locally in your browser and is not uploaded.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane tone="in" label="Paste your JSON" htmlFor={inputId}>
          <CodeEditor
            id={inputId}
            textareaRef={inputRef}
            value={input}
            onChange={(value) => {
              setInput(value);
              if (status.kind !== "idle") {
                setStatus({ kind: "idle" });
              }
            }}
            onKeyDown={onInputKeyDown}
            lang="json"
            placeholder='{"hello": "world"}'
            minHeightClass="min-h-40 lg:min-h-80"
            invalid={status.kind === "error"}
            describedBy={status.kind === "error" ? errorId : undefined}
          />
        </ToolPane>
        <ToolPane
          tone="out"
          label="Result"
          htmlFor={outputId}
          actions={<CopyButton value={output} disabled={!output} />}
        >
          <CodeEditor
            id={outputId}
            value={output}
            lang="json"
            readOnly
            placeholder="Formatted JSON will appear here"
            minHeightClass="min-h-40 lg:min-h-80"
          />
        </ToolPane>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button variant="primary" className="col-span-2 w-full sm:w-auto" onClick={() => run("pretty")}>
            Format JSON
          </Button>
          <Button className="w-full sm:w-auto" onClick={() => run("minify")}>Minify</Button>
          <Button className="w-full sm:w-auto" onClick={() => run("validate")}>Validate</Button>
          <Button variant="ghost" className="w-full sm:w-auto" onClick={clear}>
            Clear
          </Button>
          <Button variant="ghost" className="w-full sm:w-auto" onClick={loadExample}>
            Load example
          </Button>
        </div>
        <p className="text-xs text-muted sm:ml-auto">
          {stats.characters} characters
          {stats.lines > 0 ? ` · ${stats.lines} lines` : ""}
          <span className="hidden sm:inline"> · Ctrl/⌘ + Enter to format</span>
        </p>
      </div>

      <div className="mt-4 min-h-12" aria-live="polite">
        {status.kind === "error" ? (
          <div
            id={errorId}
            role="alert"
            className="rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm"
          >
            <p className="font-medium text-danger">{status.error.title}</p>
            <p className="mt-1 text-ink">{status.error.hint}</p>
            {status.error.line != null && status.error.column != null ? (
              <p className="mt-1 text-muted">
                Location: line {status.error.line}, column {status.error.column}
              </p>
            ) : null}
            <p className="mt-2 font-mono text-xs text-muted">
              {status.error.technical}
            </p>
          </div>
        ) : null}
        {status.kind === "valid" ? (
          <p className="rounded-lg border border-success/30 bg-success-bg px-3 py-2 text-sm text-success">
            {status.message}
          </p>
        ) : null}
      </div>
    </ToolShell>
  );
}
