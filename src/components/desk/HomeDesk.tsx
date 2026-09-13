"use client";

import dynamic from "next/dynamic";

const DeskGame = dynamic(
  () => import("@/components/desk/DeskGame").then((m) => m.DeskGame),
  {
    ssr: false,
    loading: () => (
      <div
        className="panel min-h-[280px] animate-pulse bg-surface-muted/40"
        aria-hidden
      />
    ),
  },
);

export function HomeDesk() {
  return <DeskGame />;
}
