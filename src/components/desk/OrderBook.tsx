"use client";

import { formatPx, useTape } from "@/components/desk/TapeProvider";

const MAX_LEVELS = 5;

export function OrderBook({ depth = MAX_LEVELS }: { depth?: number }) {
  const { levels } = useTape();
  const rows = levels.slice(0, Math.min(depth, MAX_LEVELS));
  const maxSize = Math.max(
    1,
    ...rows.flatMap((level) => [level.bidSize, level.askSize]),
  );

  return (
    <div className="min-h-0 font-mono text-[11px] tabular-nums">
      <div className="mb-1 grid grid-cols-[1fr_auto_auto_1fr] gap-2 text-muted">
        <span>Bid</span>
        <span>Sz</span>
        <span>Sz</span>
        <span className="text-right">Ask</span>
      </div>
      <ul className="h-[6.5rem] overflow-hidden">
        {rows.map((level, index) => (
          <li
            key={index}
            className="mb-0.5 grid h-5 grid-cols-[1fr_auto_auto_1fr] items-center gap-2 last:mb-0"
          >
            <span className="relative overflow-hidden text-success">
              <span
                className="absolute inset-y-0 right-0 bg-success/15"
                style={{ width: `${(level.bidSize / maxSize) * 100}%` }}
              />
              <span className="relative px-1">{formatPx(level.bid)}</span>
            </span>
            <span className="text-muted">{level.bidSize}</span>
            <span className="text-muted">{level.askSize}</span>
            <span className="relative overflow-hidden text-right text-danger">
              <span
                className="absolute inset-y-0 left-0 bg-danger/15"
                style={{ width: `${(level.askSize / maxSize) * 100}%` }}
              />
              <span className="relative px-1">{formatPx(level.ask)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
