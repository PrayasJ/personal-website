"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { matchToolListItem, type ToolListItem } from "@/lib/tool-list";

type ToolSearchProps = {
  items: ToolListItem[];
  variant?: "header" | "hero" | "menu";
  onNavigate?: () => void;
};

export function ToolSearch({
  items,
  variant = "header",
  onNavigate,
}: ToolSearchProps) {
  const router = useRouter();
  const listId = useId();
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    return items.filter((tool) => matchToolListItem(tool, query)).slice(0, 8);
  }, [items, query]);
  const showList = open && query.trim().length > 0;

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function go(path: string) {
    setOpen(false);
    onNavigate?.();
    router.push(path);
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (results[0]) {
      go(results[0].path);
      return;
    }
    const encoded = encodeURIComponent(query.trim());
    go(encoded ? `/tools?q=${encoded}` : "/tools");
  }

  const isHero = variant === "hero";
  const isMenu = variant === "menu";

  return (
    <div
      ref={rootRef}
      className={isHero || isMenu ? "relative w-full" : "relative w-full max-w-64"}
    >
      <form onSubmit={onSubmit} role="search">
        <label htmlFor={inputId} className="sr-only">
          Search tools
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          autoComplete="off"
          placeholder="Search tools..."
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={showList}
          role="combobox"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (!showList) {
              return;
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) =>
                Math.min(index + 1, Math.max(results.length - 1, 0)),
              );
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            } else if (event.key === "Escape") {
              setOpen(false);
            } else if (event.key === "Enter" && results[activeIndex]) {
              event.preventDefault();
              go(results[activeIndex].path);
            }
          }}
          className={
            isHero || isMenu
              ? "w-full rounded-full border border-border bg-surface px-4 py-3 text-base text-ink placeholder:text-muted"
              : "w-full rounded-full border border-border bg-surface px-3 py-1.5 text-base text-ink placeholder:text-muted md:text-sm"
          }
        />
      </form>
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className={
            isMenu
              ? "relative z-30 mt-2 max-h-64 w-full overflow-auto rounded-lg border border-border bg-surface py-1"
              : "absolute z-30 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
          }
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted">No matching tools</li>
          ) : (
            results.map((tool, index) => (
              <li key={tool.slug} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  className={
                    index === activeIndex
                      ? "flex w-full min-h-11 flex-col items-start px-3 py-2.5 text-left bg-surface-muted"
                      : "flex w-full min-h-11 flex-col items-start px-3 py-2.5 text-left hover:bg-surface-muted"
                  }
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => go(tool.path)}
                >
                  <span className="text-sm font-medium text-ink">{tool.name}</span>
                  <span className="text-xs text-muted">{tool.description}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
