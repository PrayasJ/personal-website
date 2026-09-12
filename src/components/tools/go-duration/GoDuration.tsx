"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { CopyButton } from "@/components/tools/CopyButton";
import { ToolPane } from "@/components/tools/ToolPane";
import { fromMillis, parseGoDuration } from "@/lib/duration";

export function GoDuration() {
  const [mode, setMode] = useState<"parse" | "format">("parse");
  const [input, setInput] = useState("1h30m");

  const result = useMemo(() => {
    try {
      if (mode === "parse") {
        return { ok: true as const, value: parseGoDuration(input) };
      }
      return { ok: true as const, value: fromMillis(Number(input)) };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Could not parse.",
      };
    }
  }, [input, mode]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Go <span className="font-mono">time.ParseDuration</span> units: ns, us, ms,
        s, m, h. Combined values like 1h30m45s are allowed. Not a calendar duration.
      </p>
      <Segmented
        className="mt-4"
        label="Mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: "parse", label: "Parse Go" },
          { value: "format", label: "From ms" },
        ] as const}
      />
      <Field
        label={mode === "parse" ? "Duration" : "Milliseconds"}
        htmlFor="go-dur"
        className="mt-4"
      >
        <input
          id="go-dur"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="field-input"
          spellCheck={false}
          inputMode={mode === "format" ? "decimal" : undefined}
        />
      </Field>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            setMode("parse");
            setInput("1h30m");
          }}
        >
          Load 1h30m
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setMode("format");
            setInput("250");
          }}
        >
          Load 250ms
        </Button>
      </div>
      {!result.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {result.error}
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Hours" value={String(result.value.hours)} />
            <Stat label="Minutes" value={String(result.value.minutes)} />
            <Stat label="Seconds" value={String(result.value.seconds)} />
            <Stat label="Millis" value={String(result.value.millis)} />
          </div>
          <ToolPane
            tone="out"
            label="Canonical"
            className="mt-4"
            actions={<CopyButton value={result.value.go} />}
          >
            <p className="mt-2 font-mono text-lg text-ink">{result.value.go}</p>
            <p className="mt-1 font-mono text-xs text-muted">
              {result.value.totalMs} ms total
            </p>
          </ToolPane>
        </>
      )}
    </ToolShell>
  );
}
