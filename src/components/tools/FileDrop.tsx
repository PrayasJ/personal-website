"use client";

import { useId } from "react";
import { formatBytes } from "@/lib/files";
import { Button } from "@/components/ui/Button";

export function FileDrop({
  accept,
  multiple = false,
  files,
  onChange,
  label,
}: {
  accept: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
  label: string;
}) {
  const inputId = useId();

  function add(list: FileList | File[]) {
    const next = Array.from(list);
    onChange(multiple ? [...files, ...next] : next.slice(0, 1));
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className="file-drop"
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (event.dataTransfer.files.length) {
            add(event.dataTransfer.files);
          }
        }}
      >
        <span className="file-drop-title">{label}</span>
        <span className="file-drop-copy">
          Drop a file, or click to choose. Stays in this tab.
        </span>
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files?.length) {
              add(event.target.files);
            }
            event.target.value = "";
          }}
        />
      </label>
      {files.length > 0 ? (
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${index}`} className="file-row">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{file.name}</p>
                <p className="font-mono text-xs text-muted">{formatBytes(file.size)}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                {multiple && index > 0 ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const next = files.slice();
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      onChange(next);
                    }}
                  >
                    Up
                  </Button>
                ) : null}
                {multiple && index < files.length - 1 ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const next = files.slice();
                      [next[index + 1], next[index]] = [next[index], next[index + 1]];
                      onChange(next);
                    }}
                  >
                    Down
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  onClick={() => onChange(files.filter((_, item) => item !== index))}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
