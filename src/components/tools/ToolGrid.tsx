"use client";

import { useMemo, useSyncExternalStore } from "react";
import { searchTools, type Tool } from "@/lib/tools";
import { ToolCard } from "@/components/tools/ToolCard";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getSearchQuery() {
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

export function ToolGrid({
  tools,
  hideEmpty = false,
}: {
  tools: Tool[];
  hideEmpty?: boolean;
}) {
  const query = useSyncExternalStore(subscribe, getSearchQuery, () => "");

  const visible = useMemo(() => {
    if (!query.trim()) {
      return tools;
    }
    const allowed = new Set(tools.map((tool) => tool.slug));
    return searchTools(query).filter((tool) => allowed.has(tool.slug));
  }, [query, tools]);

  if (visible.length === 0) {
    if (hideEmpty) {
      return null;
    }
    return (
      <p className="text-sm text-muted">
        No tools matched {query ? `\u201c${query}\u201d` : "your search"}.
      </p>
    );
  }

  return (
    <ul className="tool-grid">
      {visible.map((tool, index) => (
        <li key={tool.slug}>
          <ToolCard tool={tool} index={index} />
        </li>
      ))}
    </ul>
  );
}
