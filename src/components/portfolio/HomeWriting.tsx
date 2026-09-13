"use client";

import dynamic from "next/dynamic";

const WritingSection = dynamic(
  () =>
    import("@/components/portfolio/WritingSection").then((m) => m.WritingSection),
  {
    loading: () => (
      <section id="writing" className="scroll-mt-28 py-10 sm:py-16" aria-busy>
        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-surface-muted/50" />
        <div className="h-24 animate-pulse rounded bg-surface-muted/40" />
      </section>
    ),
  },
);

/** Keeps writing list + modal off the homepage critical path. */
export function HomeWriting() {
  return <WritingSection />;
}
