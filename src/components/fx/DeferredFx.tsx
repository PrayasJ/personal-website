"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CustomCursor = dynamic(
  () => import("@/components/fx/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false },
);

const Ambient = dynamic(
  () => import("@/components/fx/Ambient").then((m) => m.Ambient),
  { ssr: false },
);

/**
 * Loads cursor + ambient after idle so they stay off the critical path.
 */
export function DeferredFx() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    function enable() {
      if (!cancelled) {
        setReady(true);
      }
    }

    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (typeof win.requestIdleCallback === "function") {
      idleId = win.requestIdleCallback(enable, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(enable, 200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <>
      <CustomCursor />
      <Ambient />
    </>
  );
}
