"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useId, useMemo, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { Button } from "@/components/ui/Button";
import { markdownToHtml } from "@/lib/markdown";

const EXAMPLE = `# Markdown preview

Paste **markdown**, get HTML. Tables and \`code\` work.

| Tool | Local |
| --- | --- |
| Formatter | yes |

- Runs in this browser
- Nothing is uploaded
`;

export function MarkdownPreview() {
  const inputId = useId();
  const [input, setInput] = useState(EXAMPLE);
  const html = useMemo(() => markdownToHtml(input), [input]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Convert markdown to HTML with Showdown in this tab. The preview is not a
        full XSS sanitizer — do not paste untrusted markdown from strangers.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ToolPane tone="in" label="Markdown" htmlFor={inputId}>
          <CodeEditor
            id={inputId}
            value={input}
            onChange={setInput}
            minHeightClass="min-h-56 lg:min-h-80"
            placeholder="# Heading"
          />
        </ToolPane>
        <ToolPane
          tone="out"
          label="Preview"
          actions={<CopyButton value={html} />}
        >
          <div
            className="markdown-preview min-h-56 overflow-auto px-1 py-1 text-sm leading-7 text-ink lg:min-h-80"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </ToolPane>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => setInput(EXAMPLE)}>
          Load example
        </Button>
        <Button variant="ghost" onClick={() => setInput("")}>
          Clear
        </Button>
      </div>
    </ToolShell>
  );
}
