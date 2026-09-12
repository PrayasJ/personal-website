"use client";

import { useTape } from "@/components/desk/TapeProvider";

export function Sparkline({ className }: { className?: string }) {
  const { history, open } = useTape();
  if (history.length < 2) {
    return <div className={className} />;
  }

  const width = 320;
  const height = 72;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const span = Math.max(max - min, 0.08);
  const coords = history.map((px, index) => {
    const x = (index / (history.length - 1)) * width;
    const y = height - ((px - min) / span) * (height - 4) - 2;
    return { x, y };
  });
  const points = coords
    .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");
  const last = history[history.length - 1];
  const up = last >= open;
  const stroke = up ? "var(--color-success)" : "var(--color-danger)";
  const area = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={`Price path, last ${last.toFixed(2)}`}
    >
      <polygon fill={stroke} fillOpacity="0.12" points={area} />
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}
