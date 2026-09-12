"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { decodeHtml, encodeHtml } from "@/lib/htmlEntities";

export function HtmlEntities() {
  const plainId = useId();
  const encodedId = useId();
  const [plain, setPlain] = useState("<div class=\"tape\">PJX</div>");
  const [encoded, setEncoded] = useState("");

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Encode &lt; &gt; &amp; quotes for HTML text, or decode named and numeric
        entities. This is not a sanitizer.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane
          tone="in"
          label="Text"
          htmlFor={plainId}
          actions={<CopyButton value={plain} label="Copy text" />}
        >
          <CodeEditor id={plainId} value={plain} onChange={setPlain} />
        </ToolPane>
        <ToolPane
          tone="out"
          label="Entities"
          htmlFor={encodedId}
          actions={<CopyButton value={encoded} label="Copy encoded" />}
        >
          <CodeEditor id={encodedId} value={encoded} onChange={setEncoded} />
        </ToolPane>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => setEncoded(encodeHtml(plain))}>
          Encode
        </Button>
        <Button onClick={() => setPlain(decodeHtml(encoded))}>Decode</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setPlain("<div class=\"tape\">PJX</div>");
            setEncoded("");
          }}
        >
          Load example
        </Button>
      </div>
    </ToolShell>
  );
}
