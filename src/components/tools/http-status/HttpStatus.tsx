"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Field } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { CopyButton } from "@/components/tools/CopyButton";
import { filterHttpStatuses, type HttpClass } from "@/lib/httpstatus";

const CLASSES: Array<{ value: HttpClass | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "1xx", label: "1xx" },
  { value: "2xx", label: "2xx" },
  { value: "3xx", label: "3xx" },
  { value: "4xx", label: "4xx" },
  { value: "5xx", label: "5xx" },
];

export function HttpStatus() {
  const [query, setQuery] = useState("");
  const [klass, setKlass] = useState<HttpClass | "all">("all");
  const matches = useMemo(() => filterHttpStatuses(query, klass), [query, klass]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Common HTTP status codes. Phrases follow RFC 9110 where they exist. 422
        and 429 are the usual extra codes from APIs. This is a blotter, not the
        whole IANA registry.
      </p>
      <Field label="Search" htmlFor="http-q" className="mt-4">
        <input
          id="http-q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="field-input"
          placeholder="404, rate limit, timeout"
          spellCheck={false}
        />
      </Field>
      <Segmented
        className="mt-4"
        label="Class"
        value={klass}
        onChange={setKlass}
        options={CLASSES}
      />
      <ul className="mt-4 space-y-2">
        {matches.map((status) => (
          <li key={status.code} className="http-status">
            <div>
              <p className="font-mono text-lg tabular-nums text-accent">{status.code}</p>
              <p className="text-sm font-medium text-ink">{status.phrase}</p>
              <p className="mt-1 text-sm text-muted">{status.blurb}</p>
            </div>
            <CopyButton value={String(status.code)} />
          </li>
        ))}
      </ul>
      {matches.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No codes matched that filter.</p>
      ) : null}
    </ToolShell>
  );
}
