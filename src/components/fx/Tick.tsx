"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function magnitude(value: string | number): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  const raw = value.trim();
  const time = raw.match(/(\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))?/);
  if (time) {
    const fraction = time[4] ? Number(`0.${time[4]}`) : 0;
    return Number(time[1]) * 3600 + Number(time[2]) * 60 + Number(time[3]) + fraction;
  }
  const match = raw.replace(/,/g, "").match(/[+-]?\d+(?:\.\d+)?/);
  if (!match) {
    return null;
  }
  const numeric = Number(match[0]);
  return Number.isFinite(numeric) ? numeric : null;
}

function direction(previous: string | number, next: string | number): "up" | "down" | null {
  const from = magnitude(previous);
  const to = magnitude(next);
  if (from == null || to == null || from === to) {
    return null;
  }
  if (from > 86_000 && to < 100) {
    return "up";
  }
  return to > from ? "up" : "down";
}

export function Tick({
  children,
  className,
}: {
  children: string | number;
  className?: string;
}) {
  const node = useRef<HTMLSpanElement>(null);
  const previous = useRef<string | number | null>(null);

  useEffect(() => {
    const el = node.current;
    if (!el) {
      return;
    }
    if (previous.current === null) {
      previous.current = children;
      return;
    }
    if (previous.current === children) {
      return;
    }
    const trend = direction(previous.current, children);
    previous.current = children;
    el.classList.remove("is-up", "is-down");
    if (!trend) {
      return;
    }
    void el.offsetWidth;
    el.classList.add(trend === "up" ? "is-up" : "is-down");
  }, [children]);

  return (
    <span ref={node} className={cn("tick", className)}>
      {children}
    </span>
  );
}
