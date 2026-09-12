"use client";

import { useEffect, useSyncExternalStore, type MouseEvent } from "react";

export type ThemePreference = "light" | "dark";

const STORAGE_KEY = "theme";
const listeners = new Set<() => void>();

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let themeTimer = 0;

export function applyTheme(
  preference: ThemePreference,
  options: {
    animate?: boolean;
    onApply?: () => void;
  } = {},
) {
  const root = document.documentElement;
  const dark = preference === "dark";
  const alreadyDark = root.classList.contains("dark");

  if (alreadyDark === dark) {
    options.onApply?.();
    return;
  }

  const animate = options.animate === true && !prefersReducedMotion();
  if (animate) {
    root.classList.add("theme-changing");
    void root.offsetWidth;
    window.clearTimeout(themeTimer);
    themeTimer = window.setTimeout(() => {
      root.classList.remove("theme-changing");
    }, 480);
  } else {
    root.classList.remove("theme-changing");
  }

  root.classList.toggle("dark", dark);
  options.onApply?.();
}

export function readStoredTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light") {
      return "light";
    }
  } catch {
    // localStorage can be unavailable
  }
  return "dark";
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ThemePreference {
  return readStoredTheme();
}

function getServerSnapshot(): ThemePreference {
  return "dark";
}

function setPreference(next: ThemePreference) {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore
  }
  applyTheme(next, { animate: true, onApply: emit });
}

export function ThemeToggle() {
  const preference = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    applyTheme(readStoredTheme());
  }, []);

  function cycle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setPreference(preference === "light" ? "dark" : "light");
  }

  const next = preference === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={cycle}
      className="btn btn-secondary h-11 w-11 rounded-full px-0 md:h-9 md:w-9"
      aria-label={`${preference === "light" ? "Light" : "Dark"} theme. Switch to ${next}.`}
      title={`Theme: ${preference}`}
    >
      <span className="theme-glyph" aria-hidden="true">
        {preference === "light" ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 3v1.5M12 19.5V21M4.93 4.93l1.06 1.06M18.01 18.01l1.06 1.06M3 12h1.5M19.5 12H21M4.93 19.07l1.06-1.06M18.01 5.99l1.06-1.06"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 13.5A7.5 7.5 0 1 1 10.5 6 6 6 0 0 0 18 13.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
