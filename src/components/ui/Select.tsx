"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  hint?: string;
};

export function Select({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  className?: string;
}) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    Math.max(0, options.findIndex((option) => option.value === value)),
  );
  const [menuBox, setMenuBox] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);

  const selected = options.find((option) => option.value === value) ?? options[0];

  function placeMenu() {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width, 16 * 14), window.innerWidth - 16);
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const openUp = spaceBelow < 168 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, Math.min(280, openUp ? spaceAbove : spaceBelow));
    let left = rect.left;
    if (left + width > window.innerWidth - 8) {
      left = window.innerWidth - 8 - width;
    }
    setMenuBox({
      top: openUp ? rect.top - maxHeight - 6 : rect.bottom + 6,
      left: Math.max(8, left),
      width,
      maxHeight,
    });
  }

  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    placeMenu();
  }, [open, options.length]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onReposition() {
      placeMenu();
    }
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !menuRef.current) {
      return;
    }
    const node = menuRef.current.querySelector<HTMLElement>("[data-active='true']");
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function selectedIndex() {
    const index = options.findIndex((option) => option.value === value);
    return index < 0 ? 0 : index;
  }

  function openMenu() {
    setActive(selectedIndex());
    setOpen(true);
  }

  function choose(next: string) {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function moveActive(delta: number) {
    setActive((current) => {
      const next = current + delta;
      if (next < 0) {
        return options.length - 1;
      }
      if (next >= options.length) {
        return 0;
      }
      return next;
    });
  }

  const menu =
    open && menuBox && typeof document !== "undefined"
      ? createPortal(
          <ul
            ref={menuRef}
            id={listId}
            role="listbox"
            style={{
              top: menuBox.top,
              left: menuBox.left,
              width: menuBox.width,
              maxHeight: menuBox.maxHeight,
            }}
            className="ui-select-menu"
          >
            {options.map((option, index) => {
              const on = option.value === value;
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    tabIndex={-1}
                    aria-selected={on}
                    data-active={index === active}
                    data-cursor="hot"
                    className={cn(
                      "ui-select-option",
                      on && "is-on",
                      index === active && "is-active",
                    )}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(option.value)}
                  >
                    <span>
                      {option.label}
                      {option.hint ? (
                        <span className="ui-select-hint">{option.hint}</span>
                      ) : null}
                    </span>
                    {on ? <span className="ui-select-tick" aria-hidden /> : null}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div className={cn("ui-select", className)}>
      {label ? <p className="field-label">{label}</p> : null}
      <button
        ref={triggerRef}
        type="button"
        data-cursor="hot"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className="ui-select-trigger"
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            openMenu();
          }
        }}
        onKeyDown={(event) => {
          if (!open) {
            if (
              event.key === "ArrowDown" ||
              event.key === "ArrowUp" ||
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              openMenu();
            }
            return;
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            moveActive(1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            moveActive(-1);
          } else if (event.key === "Home") {
            event.preventDefault();
            setActive(0);
          } else if (event.key === "End") {
            event.preventDefault();
            setActive(options.length - 1);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const option = options[active];
            if (option) {
              choose(option.value);
            }
          }
        }}
      >
        <span className="min-w-0 truncate">
          {selected?.label ?? "Select"}
          {selected?.hint ? (
            <span className="ml-2 font-mono text-xs font-normal tracking-normal text-muted">
              {selected.hint}
            </span>
          ) : null}
        </span>
        <span className={cn("ui-select-caret", open && "is-open")} aria-hidden />
      </button>
      {menu}
    </div>
  );
}
