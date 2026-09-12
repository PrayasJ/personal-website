"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  adFormat,
  adsEnabled,
  adsenseClient,
  adsenseSlot,
  type AdPlacement,
} from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Fill = "pending" | "filled" | "unfilled";

export function AdSlot({
  placement,
  className,
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const pushed = useRef(false);
  const insRef = useRef<HTMLModElement>(null);
  const [fill, setFill] = useState<Fill>("pending");
  const client = adsenseClient();
  const slot = adsenseSlot(placement);
  const live = adsEnabled() && Boolean(slot);

  useEffect(() => {
    if (!live) {
      return;
    }
    const node = insRef.current;
    if (!node) {
      return;
    }

    function readStatus() {
      const ins = insRef.current;
      if (!ins) {
        return;
      }
      const status = ins.getAttribute("data-ad-status");
      if (status === "filled" || status === "unfilled") {
        setFill(status);
      }
    }

    const observer = new MutationObserver(readStatus);
    observer.observe(node, { attributes: true, attributeFilter: ["data-ad-status"] });
    const frame = window.requestAnimationFrame(readStatus);

    if (!pushed.current) {
      pushed.current = true;
      try {
        window.adsbygoogle = window.adsbygoogle ?? [];
        window.adsbygoogle.push({});
      } catch {
        pushed.current = false;
      }
    }

    const timer = window.setTimeout(() => {
      const ins = insRef.current;
      if (!ins?.getAttribute("data-ad-status")) {
        setFill("unfilled");
      }
    }, 3500);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [live]);

  if (!live || fill === "unfilled") {
    return null;
  }

  const format = adFormat(placement);

  return (
    <aside
      className={cn("tool-ad", `is-${placement}`, className)}
      data-ad-fill={fill}
      aria-label="Advertisement"
    >
      <p className="tool-ad-kicker">Ad</p>
      <ins
        ref={insRef}
        className="adsbygoogle tool-ad-unit"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
