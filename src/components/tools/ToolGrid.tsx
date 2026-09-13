"use client";

import { useMemo, useSyncExternalStore } from "react";
import { matchToolListItem, type ToolListItem } from "@/lib/tool-list";
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
  tools: ToolListItem[];
  hideEmpty?: boolean;
}) {
  const query = useSyncExternalStore(subscribe, getSearchQuery, () => "");

  const visible = useMemo(() => {
    if (!query.trim()) {
      return tools;
    }
    return tools.filter((tool) => matchToolListItem(tool, query));
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
