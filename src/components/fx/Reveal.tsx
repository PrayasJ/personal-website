"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  /** Above-the-fold: visible immediately so LCP isn't gated on hydration. */
  eager = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(eager);

  useEffect(() => {
    if (eager) {
      return;
    }
    const node = ref.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div
      ref={ref}
      className={cn("reveal", shown && "is-in", className)}
      style={{ transitionDelay: eager ? undefined : `${delay}ms` }}
    >
      {children}
    </div>
  );
}
