"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckChip } from "@/components/ui/CheckChip";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { decodeUtf8Base64, encodeUtf8Base64 } from "@/lib/base64";

export function Base64Tool() {
  const plainId = useId();
  const encodedId = useId();
  const [plain, setPlain] = useState("");
  const [encoded, setEncoded] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function encode() {
    setEncoded(encodeUtf8Base64(plain, urlSafe));
    setError(null);
  }

  function decode() {
    try {
      setPlain(decodeUtf8Base64(encoded));
      setError(null);
    } catch {
      setError("That is not valid Base64. Check padding and alphabet.");
    }
  }

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        UTF-8 text in, Base64 out. URL-safe mode uses - and _ and drops padding.
      </p>
      <div className="chip-row mt-4">
        <CheckChip checked={urlSafe} onChange={setUrlSafe}>
          URL-safe alphabet
        </CheckChip>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane
          tone="in"
          label="Plain text"
          htmlFor={plainId}
          actions={<CopyButton value={plain} label="Copy text" />}
        >
          <CodeEditor
            id={plainId}
            value={plain}
            onChange={setPlain}
            lang="plain"
            placeholder="hello"
          />
        </ToolPane>
        <ToolPane
          tone="out"
          label="Base64"
          htmlFor={encodedId}
          actions={<CopyButton value={encoded} label="Copy Base64" />}
        >
          <CodeEditor
            id={encodedId}
            value={encoded}
            onChange={setEncoded}
            lang="plain"
            placeholder="aGVsbG8="
          />
        </ToolPane>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Button variant="primary" className="w-full sm:w-auto" onClick={encode}>
          Encode
        </Button>
        <Button className="w-full sm:w-auto" onClick={decode}>
          Decode
        </Button>
        <Button
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => {
            setPlain("");
            setEncoded("");
            setError(null);
          }}
        >
          Clear
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
