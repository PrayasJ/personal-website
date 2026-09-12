"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckChip } from "@/components/ui/CheckChip";
import { Field } from "@/components/ui/Field";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { CodeHighlight } from "@/components/tools/CodeHighlight";
import { ToolPane } from "@/components/tools/ToolPane";
import { tokenizeMatches } from "@/lib/highlight";

const FLAG_OPTIONS = [
  { key: "g", label: "g global" },
  { key: "i", label: "i ignore case" },
  { key: "m", label: "m multiline" },
  { key: "s", label: "s dotAll" },
  { key: "u", label: "u unicode" },
] as const;

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b[A-Z]{3}\\b");
  const [flags, setFlags] = useState("g");
  const [haystack, setHaystack] = useState("OMS fills at the ASK, then the BID. PJX is a toy.");
  const [replacement, setReplacement] = useState("[$&]");

  function toggleFlag(flag: string) {
    setFlags((current) => (current.includes(flag) ? current.replace(flag, "") : `${current}${flag}`));
  }

  const compiled = useMemo(() => {
    try {
      return { ok: true as const, regex: new RegExp(pattern, flags) };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid regular expression.",
      };
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!compiled.ok) {
      return [];
    }
    const regex = new RegExp(compiled.regex.source, compiled.regex.flags);
    if (!regex.global) {
      const match = regex.exec(haystack);
      return match ? [match] : [];
    }
    return [...haystack.matchAll(regex)];
  }, [compiled, haystack]);

  const replaced = compiled.ok ? haystack.replace(compiled.regex, replacement) : "";
  const haystackTokens = compiled.ok
    ? tokenizeMatches(
        haystack,
        matches.flatMap((match) =>
          match.index == null ? [] : [{ index: match.index, value: match[0] ?? "" }],
        ),
      )
    : undefined;

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        JavaScript regular expressions, the same engine the rest of this site uses.
      </p>
      <Field label="Pattern" htmlFor="regex-pattern" className="mt-4">
        <input
          id="regex-pattern"
          value={pattern}
          onChange={(event) => setPattern(event.target.value)}
          className="field-input syn-keyword"
          spellCheck={false}
        />
      </Field>
      <div className="chip-row mt-3">
        {FLAG_OPTIONS.map((flag) => (
          <CheckChip
            key={flag.key}
            checked={flags.includes(flag.key)}
            onChange={() => toggleFlag(flag.key)}
          >
            {flag.label}
          </CheckChip>
        ))}
      </div>
      <ToolPane tone="in" label="Test string" className="mt-4">
        <CodeEditor
          value={haystack}
          onChange={setHaystack}
          tokens={haystackTokens}
          minHeightClass="min-h-28"
        />
      </ToolPane>
      {!compiled.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {compiled.error}
        </p>
      ) : (
        <p className="mt-3 font-mono text-sm text-accent">
          {matches.length} match{matches.length === 1 ? "" : "es"}
        </p>
      )}
      {compiled.ok && matches.length > 0 ? (
        <ol className="mt-3 space-y-1 font-mono text-sm">
          {matches.map((match, index) => (
            <li key={`${match.index}-${index}`} className="break-all">
              <span className="text-muted">{match.index}:</span>{" "}
              <span className={`syn-hit${index % 3}`}>{match[0]}</span>
            </li>
          ))}
        </ol>
      ) : null}
      <Field label="Replace with" htmlFor="regex-replace" className="mt-4">
        <input
          id="regex-replace"
          value={replacement}
          onChange={(event) => setReplacement(event.target.value)}
          className="field-input syn-string"
          spellCheck={false}
        />
      </Field>
      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton value={replaced} label="Copy replaced" disabled={!compiled.ok} />
        <Button
          variant="ghost"
          onClick={() => {
            setPattern("\\b[A-Z]{3}\\b");
            setFlags("g");
            setHaystack("OMS fills at the ASK, then the BID. PJX is a toy.");
            setReplacement("[$&]");
          }}
        >
          Load example
        </Button>
      </div>
      {compiled.ok ? (
        <ToolPane tone="out" label="Replaced" className="mt-3">
          <pre className="tool-code">
            <CodeHighlight code={replaced} lang="plain" />
          </pre>
        </ToolPane>
      ) : null}
    </ToolShell>
  );
}
