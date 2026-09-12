"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const node = cursorRef.current;
    if (!node) {
      return;
    }
    const cursor = node;

    let enabled = false;
    let visible = false;
    let hot = false;
    let x = 0;
    let y = 0;

    function paint() {
      const scale = hot ? 1.55 : 1;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    }

    function setEnabled(next: boolean) {
      enabled = next && !reduce.matches && fine.matches;
      if (!enabled) {
        visible = false;
        document.documentElement.classList.remove("cursor-on", "cursor-field");
      }
    }

    function syncMedia() {
      setEnabled(true);
    }

    function onMove(event: PointerEvent) {
      if (!enabled || event.pointerType !== "mouse") {
        return;
      }
      x = event.clientX;
      y = event.clientY;
      paint();
      if (!visible) {
        visible = true;
        document.documentElement.classList.add("cursor-on");
      }
    }

    function onOver(event: PointerEvent) {
      if (!enabled) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const field = Boolean(
        target.closest("input, textarea, select, [contenteditable='true']"),
      );
      hot =
        !field &&
        Boolean(
          target.closest(
            "a, button, summary, [role='button'], [role='option'], [role='tab'], [data-cursor='hot']",
          ),
        );
      document.documentElement.classList.toggle("cursor-field", field);
      cursor.classList.toggle("is-hot", hot);
      cursor.classList.toggle("is-field", field);
      paint();
    }

    function onBlur() {
      visible = false;
      document.documentElement.classList.remove("cursor-on", "cursor-field");
    }

    syncMedia();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver);
    fine.addEventListener("change", syncMedia);
    reduce.addEventListener("change", syncMedia);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", syncMedia);

    return () => {
      document.documentElement.classList.remove("cursor-on", "cursor-field");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", syncMedia);
      fine.removeEventListener("change", syncMedia);
      reduce.removeEventListener("change", syncMedia);
    };
  }, []);

  return <div ref={cursorRef} className="site-cursor" aria-hidden="true" />;
}
