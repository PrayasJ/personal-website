import { ToolPane } from "@/components/tools/ToolPane";
import type { ReactNode } from "react";

export type MediaItem = { src: string; caption?: string };

export function MediaWorkspace({
  source,
  result,
  sourceEmpty = "Drop a file to preview it here.",
  resultEmpty = "Generate a preview before downloading.",
  sourceLabel = "Source",
  resultLabel = "Result",
  resultActions,
}: {
  source: MediaItem[];
  result: MediaItem[];
  sourceEmpty?: string;
  resultEmpty?: string;
  sourceLabel?: string;
  resultLabel?: string;
  resultActions?: ReactNode;
}) {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <ToolPane tone="in" label={sourceLabel}>
        <MediaStrip items={source} empty={sourceEmpty} />
      </ToolPane>
      <ToolPane tone="out" label={resultLabel} actions={resultActions}>
        <MediaStrip items={result} empty={resultEmpty} large />
      </ToolPane>
    </div>
  );
}

export function MediaStrip({
  items,
  empty = "Nothing to show yet.",
  large = false,
}: {
  items: MediaItem[];
  empty?: string;
  large?: boolean;
}) {
  if (items.length === 0) {
    return <p className="media-empty">{empty}</p>;
  }

  return (
    <ul className={large ? "media-strip is-large" : "media-strip"}>
      {items.map((item, index) => (
        <li key={`${item.src.slice(0, 24)}-${index}`}>
          <figure className="media-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.caption ?? `Preview ${index + 1}`} />
            {item.caption ? <figcaption>{item.caption}</figcaption> : null}
          </figure>
        </li>
      ))}
    </ul>
  );
}
