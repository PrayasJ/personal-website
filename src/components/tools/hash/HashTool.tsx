"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useEffect, useId, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { Field } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { digestHex, hashAlgorithms, hmacHex, type HashAlgorithm } from "@/lib/hash";

export function HashTool() {
  const inputId = useId();
  const [input, setInput] = useState("");
  const [secret, setSecret] = useState("");
  const [mode, setMode] = useState<"digest" | "hmac">("digest");
  const [values, setValues] = useState<Record<HashAlgorithm, string>>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const next = {
          "SHA-1": "",
          "SHA-256": "",
          "SHA-384": "",
          "SHA-512": "",
        } satisfies Record<HashAlgorithm, string>;
        for (const algorithm of hashAlgorithms) {
          next[algorithm] =
            mode === "hmac"
              ? await hmacHex(algorithm, secret, input)
              : await digestHex(algorithm, input);
        }
        if (!cancelled) {
          setValues(next);
          setError(null);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Hashing failed.");
        }
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [input, secret, mode]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Web Crypto in this browser. SHA-1 is shown because logs still use it — prefer SHA-256.
        HMAC needs a secret; the digest does not.
      </p>
      <Segmented
        className="mt-4"
        label="Mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: "digest", label: "Digest" },
          { value: "hmac", label: "HMAC" },
        ] as const}
      />
      {mode === "hmac" ? (
        <Field label="Secret" htmlFor="hash-secret" className="mt-4">
          <input
            id="hash-secret"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            className="field-input"
            spellCheck={false}
          />
        </Field>
      ) : null}
      <ToolPane tone="in" label="Input" htmlFor={inputId} className="mt-4">
        <CodeEditor
          id={inputId}
          value={input}
          onChange={setInput}
          placeholder="Message to hash"
          minHeightClass="min-h-28"
        />
      </ToolPane>
      {error ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-4 space-y-3">
        {hashAlgorithms.map((algorithm) => (
          <ToolPane
            key={algorithm}
            tone="out"
            label={mode === "hmac" ? `HMAC ${algorithm}` : algorithm}
            actions={<CopyButton value={values[algorithm]} />}
          >
            <p className="mt-2 break-all font-mono text-sm text-ink">{values[algorithm] || "—"}</p>
          </ToolPane>
        ))}
      </div>
    </ToolShell>
  );
}
