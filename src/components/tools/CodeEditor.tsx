"use client";

import type { KeyboardEvent, Ref } from "react";
import { useRef } from "react";
import { CodeHighlight } from "@/components/tools/CodeHighlight";
import type { HighlightLang, HighlightToken } from "@/lib/highlight";
import { cn } from "@/lib/utils";

export function CodeEditor({
  id,
  value,
  onChange,
  onKeyDown,
  lang = "plain",
  tokens,
  placeholder,
  readOnly,
  rows,
  minHeightClass = "min-h-40",
  textareaRef,
  describedBy,
  invalid,
}: {
  id?: string;
  value: string;
  onChange?: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  lang?: HighlightLang;
  tokens?: HighlightToken[];
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  minHeightClass?: string;
  textareaRef?: Ref<HTMLTextAreaElement>;
  describedBy?: string;
  invalid?: boolean;
}) {
  const overlay = useRef<HTMLPreElement>(null);

  return (
    <div className="tool-editor">
      <pre
        ref={overlay}
        aria-hidden
        className={cn("tool-editor-layer", minHeightClass)}
      >
        {value ? (
          <CodeHighlight code={value} lang={lang} tokens={tokens} />
        ) : (
          "\n"
        )}
      </pre>
      <textarea
        id={id}
        ref={textareaRef}
        value={value}
        readOnly={readOnly}
        rows={rows}
        spellCheck={false}
        placeholder={placeholder}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onKeyDown={onKeyDown}
        onChange={(event) => onChange?.(event.target.value)}
        onScroll={(event) => {
          const layer = overlay.current;
          if (!layer) {
            return;
          }
          layer.scrollTop = event.currentTarget.scrollTop;
          layer.scrollLeft = event.currentTarget.scrollLeft;
        }}
        className={cn("tool-editor-input", minHeightClass, value && "has-value")}
      />
    </div>
  );
}
