"use client";

import type { CSSProperties, MouseEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ToolListItem } from "@/lib/tool-list";
import { ToolGlyph } from "@/components/tools/ToolGlyph";

function onMove(event: MouseEvent<HTMLAnchorElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export function ToolCard({
  tool,
  index = 0,
}: {
  tool: ToolListItem;
  index?: number;
}) {
  return (
    <Link
      href={tool.path}
      data-cursor="hot"
      onMouseMove={onMove}
      className={cn(
        "tool-card",
        (tool.category === "calculator" || tool.category === "student") && "is-calc",
      )}
      style={{ "--i": index } as CSSProperties}
    >
      <span className="tool-card-glow" aria-hidden />
      <span className="tool-card-rail" aria-hidden />
      <span className="tool-card-icon" aria-hidden>
        <ToolGlyph slug={tool.slug} />
      </span>
      <div className="tool-card-body">
        <div className="tool-card-top">
          <h2 className="tool-card-title">{tool.name}</h2>
          {tool.popular ? <span className="chip">popular</span> : null}
        </div>
        <p className="tool-card-copy">{tool.description}</p>
        <span className="tool-card-go">
          Open
          <span className="tool-card-arrow" aria-hidden>
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
