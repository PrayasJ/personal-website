"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AboutData } from "../../../data.config";
import { navItems, profile } from "@/lib/site";
import { ToolSearch } from "@/components/navigation/ToolSearch";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  const sheet =
    mounted && open
      ? createPortal(
          <div
            className="mobile-sheet"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="mobile-sheet-bar">
              <p id={titleId} className="text-sm font-semibold tracking-wide text-ink uppercase">
                Menu
              </p>
              <button
                ref={closeRef}
                type="button"
                className="btn btn-ghost h-11 w-11 rounded-full px-0"
                onClick={close}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="mobile-sheet-body">
              <ToolSearch variant="menu" onNavigate={close} />
              <nav aria-label="Mobile" className="mt-5">
                <ul className="flex flex-col">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-lg px-3 py-3 text-base text-ink"
                        onClick={close}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/tools"
                      className="block rounded-lg px-3 py-3 text-base text-ink"
                      onClick={close}
                    >
                      All tools
                    </Link>
                  </li>
                  <li>
                    <a
                      href={profile.github}
                      className="block rounded-lg px-3 py-3 text-base text-ink"
                      rel="noopener noreferrer"
                      onClick={close}
                    >
                      GitHub
                    </a>
                  </li>
                  {AboutData.resume ? (
                    <li>
                      <a
                        href={AboutData.resume}
                        className="block rounded-lg px-3 py-3 text-base text-accent"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={close}
                      >
                        Résumé
                      </a>
                    </li>
                  ) : null}
                </ul>
              </nav>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="btn btn-secondary h-11 w-11 rounded-full px-0"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">Open menu</span>
        <MenuIcon />
      </button>
      {sheet}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
