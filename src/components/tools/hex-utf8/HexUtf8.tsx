"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { hexToText, textToHex } from "@/lib/unicode";

export function HexUtf8() {
  const textId = useId();
  const hexId = useId();
  const [text, setText] = useState("PJX");
  const [hex, setHex] = useState("50 4a 58");
  const [error, setError] = useState<string | null>(null);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        UTF-8 bytes as hex. Spaces, colons, and 0x prefixes are accepted on decode.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane
          tone="in"
          label="Text"
          htmlFor={textId}
          actions={<CopyButton value={text} label="Copy text" />}
        >
          <CodeEditor id={textId} value={text} onChange={setText} minHeightClass="min-h-28" />
        </ToolPane>
        <ToolPane
          tone="out"
          label="Hex"
          htmlFor={hexId}
          actions={<CopyButton value={hex} label="Copy hex" />}
        >
          <CodeEditor id={hexId} value={hex} onChange={setHex} minHeightClass="min-h-28" />
        </ToolPane>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={() => {
            setHex(textToHex(text));
            setError(null);
          }}
        >
          Text → hex
        </Button>
        <Button
          onClick={() => {
            try {
              setText(hexToText(hex));
              setError(null);
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Invalid hex.");
            }
          }}
        >
          Hex → text
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
