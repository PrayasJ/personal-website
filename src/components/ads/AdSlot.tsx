"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  adFormat,
  adsEnabled,
  adsenseClient,
  adsenseSlot,
  showAdPlaceholders,
  type AdPlacement,
} from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({
  placement,
  className,
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const pushed = useRef(false);
  const client = adsenseClient();
  const slot = adsenseSlot(placement);
  const live = adsEnabled() && Boolean(slot);

  useEffect(() => {
    if (!live || pushed.current) {
      return;
    }
    pushed.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
    } catch {
      pushed.current = false;
    }
  }, [live]);

  if (!live && !showAdPlaceholders()) {
    return null;
  }

  const format = adFormat(placement);

  return (
    <aside
      className={cn("tool-ad", `is-${placement}`, className)}
      aria-label="Advertisement"
    >
      <p className="tool-ad-kicker">Ad</p>
      {live ? (
        <ins
          className="adsbygoogle tool-ad-unit"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="tool-ad-ph">
          <span>{placement} slot</span>
          <span>Set NEXT_PUBLIC_ADSENSE_CLIENT and slot IDs to go live.</span>
        </div>
      )}
    </aside>
  );
}
