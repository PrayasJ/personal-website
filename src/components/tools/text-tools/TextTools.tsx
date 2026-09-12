"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Stat } from "@/components/ui/Field";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { reverseLines, sortLines, textStats } from "@/lib/texttools";

export function TextTools() {
  const inputId = useId();
  const [input, setInput] = useState("PJX\nOMS\nPJX\nGo\n");
  const stats = useMemo(() => textStats(input), [input]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Counts, sort, unique, and reverse for plain text. Words are split on
        whitespace. Bytes are UTF-8.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat label="Chars" value={String(stats.characters)} />
        <Stat label="No space" value={String(stats.charactersNoSpace)} />
        <Stat label="Words" value={String(stats.words)} />
        <Stat label="Lines" value={String(stats.lines)} />
        <Stat label="Bytes" value={String(stats.bytes)} />
      </div>
      <ToolPane
        tone="in"
        label="Text"
        htmlFor={inputId}
        className="mt-4"
        actions={<CopyButton value={input} />}
      >
        <CodeEditor id={inputId} value={input} onChange={setInput} />
      </ToolPane>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => setInput(sortLines(input, false))}>
          Sort
        </Button>
        <Button onClick={() => setInput(sortLines(input, true))}>Unique</Button>
        <Button onClick={() => setInput(reverseLines(input))}>Reverse</Button>
        <Button variant="ghost" onClick={() => setInput("")}>
          Clear
        </Button>
      </div>
    </ToolShell>
  );
}
