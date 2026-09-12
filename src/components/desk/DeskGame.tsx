"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { OrderBook } from "@/components/desk/OrderBook";
import { Sparkline } from "@/components/desk/Sparkline";
import { Tick } from "@/components/fx/Tick";
import {
  TAPE_SYMBOL,
  formatCash,
  formatPx,
  useTape,
} from "@/components/desk/TapeProvider";

const STARTING_CASH = 100_000;
const BEST_KEY = "desk-best-pnl";
const bestListeners = new Set<() => void>();
let bestPnl = 0;
let bestLoaded = false;

function hydrateBest() {
  if (bestLoaded || typeof window === "undefined") {
    return;
  }
  bestLoaded = true;
  try {
    const stored = Number(localStorage.getItem(BEST_KEY));
    if (Number.isFinite(stored)) {
      bestPnl = stored;
    }
  } catch {
    // ignore
  }
}

function subscribeBest(onChange: () => void) {
  hydrateBest();
  bestListeners.add(onChange);
  return () => {
    bestListeners.delete(onChange);
  };
}

function readBest(): number {
  return bestPnl;
}

function noteBest(pnl: number) {
  hydrateBest();
  if (pnl <= bestPnl) {
    return;
  }
  bestPnl = pnl;
  try {
    localStorage.setItem(BEST_KEY, String(pnl));
  } catch {
    // ignore
  }
  bestListeners.forEach((listener) => listener());
}

type Fill = {
  side: "BUY" | "SELL";
  qty: number;
  px: number;
  at: string;
};

type DeskGameProps = {
  variant?: "compact" | "full";
};

export function DeskGame({ variant = "compact" }: DeskGameProps) {
  const { last, open, bid, ask, spread, high, low, lastSize, volume, clock } =
    useTape();
  const [cash, setCash] = useState(STARTING_CASH);
  const [shares, setShares] = useState(0);
  const [fills, setFills] = useState<Fill[]>([]);
  const [message, setMessage] = useState(
    "Buy and sell from the buttons. Keyboard: B buy · S sell · F flatten.",
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);

  const equity = cash + shares * last;
  const pnl = equity - STARTING_CASH;
  const dayChg = last - open;
  const dayPct = (dayChg / open) * 100;
  const up = dayChg >= 0;
  const fillLimit = variant === "full" ? 8 : 4;

  useEffect(() => {
    const id = window.setInterval(() => {
      noteBest(cash + shares * last - STARTING_CASH);
    }, 400);
    return () => window.clearInterval(id);
  }, [cash, last, shares]);

  const trade = useCallback(
    (side: "BUY" | "SELL", qty: number) => {
      const px = side === "BUY" ? ask : bid;
      const cost = qty * px;
      if (side === "BUY" && cash < cost) {
        setMessage("Rejected · insufficient cash");
        return;
      }
      if (side === "BUY") {
        setCash((value) => value - cost);
        setShares((value) => value + qty);
      } else {
        setCash((value) => value + cost);
        setShares((value) => value - qty);
      }
      const at = new Date().toLocaleTimeString("en-GB", { hour12: false });
      setFills((current) => [{ side, qty, px, at }, ...current].slice(0, fillLimit));
      setMessage(`${side} ${qty} ${TAPE_SYMBOL} @ ${formatPx(px)} (${side === "BUY" ? "ask" : "bid"})`);
    },
    [ask, bid, cash, fillLimit],
  );

  const flatten = useCallback(() => {
    if (shares === 0) {
      setMessage("Already flat");
      return;
    }
    if (shares > 0) {
      trade("SELL", shares);
    } else {
      trade("BUY", -shares);
    }
  }, [shares, trade]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const panel = panelRef.current;
      if (!panel || !panel.contains(document.activeElement)) {
        return;
      }
      if (event.key === "b" || event.key === "B") {
        event.preventDefault();
        trade("BUY", event.shiftKey ? 10 : 1);
      } else if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        trade("SELL", event.shiftKey ? 10 : 1);
      } else if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        flatten();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flatten, trade]);

  const pnlClass = pnl >= 0 ? "text-success" : "text-danger";
  const chgClass = up ? "text-success" : "text-danger";
  const posClass =
    shares > 0 ? "text-success" : shares < 0 ? "text-danger" : "text-ink";

  return (
    <div
      ref={panelRef}
      tabIndex={0}
      className="terminal-panel outline-none focus-visible:border-accent"
      aria-label="Toy trading desk for symbol PJX"
    >
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border px-3 py-2">
        <p className="tape min-w-0 truncate text-accent">
          {TAPE_SYMBOL} · toy tape
        </p>
        <p className="shrink-0 font-mono text-[11px] tabular-nums text-muted">
          {clock}
        </p>
      </div>
      <div className="grid gap-4 p-3 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
            <p className="font-mono text-3xl tabular-nums leading-none text-ink">
              <Tick>{formatPx(last)}</Tick>
            </p>
            <p className={`font-mono text-sm tabular-nums ${chgClass}`}>
              {up ? "+" : ""}
              {formatPx(dayChg)}{" "}
              <span className="text-xs">
                ({up ? "+" : ""}
                {dayPct.toFixed(2)}%)
              </span>
            </p>
          </div>
          <p className="mt-2 font-mono text-[11px] tabular-nums text-muted">
            Bid {formatPx(bid)} · Ask {formatPx(ask)} · Spr {formatPx(spread)} · Sz {lastSize}
          </p>
          <Sparkline className={variant === "full" ? "mt-3 h-24 w-full" : "mt-3 h-16 w-full"} />
          {variant === "full" ? (
            <p className="mt-2 font-mono text-[11px] tabular-nums text-muted">
              H {formatPx(high)} · L {formatPx(low)} · Vol {volume.toLocaleString("en-IN")}
            </p>
          ) : null}
        </div>
        <div className="grid min-h-0 content-start gap-3">
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[11px]">
            <div>
              <dt className="tape">Cash</dt>
              <dd className="tabular-nums text-ink">{formatCash(cash)}</dd>
            </div>
            <div>
              <dt className="tape">Pos</dt>
              <dd className={`tabular-nums ${posClass}`}>
                {shares > 0 ? "+" : ""}
                {shares}
              </dd>
            </div>
            <div>
              <dt className="tape">Equity</dt>
              <dd className="tabular-nums text-ink">{formatCash(equity)}</dd>
            </div>
            <div>
              <dt className="tape">PnL</dt>
              <dd className={`tabular-nums ${pnlClass}`}>
                <Tick>
                  {`${pnl >= 0 ? "+" : ""}${formatCash(pnl)}`}
                </Tick>
              </dd>
            </div>
          </dl>
          <OrderBook depth={5} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-border p-3 sm:flex sm:flex-wrap">
        <Button variant="buy" className="w-full sm:w-auto" onClick={() => trade("BUY", 1)}>
          Buy 1
        </Button>
        <Button variant="buy" className="w-full sm:w-auto" onClick={() => trade("BUY", 10)}>
          Buy 10
        </Button>
        <Button variant="sell" className="w-full sm:w-auto" onClick={() => trade("SELL", 1)}>
          Sell 1
        </Button>
        <Button variant="sell" className="w-full sm:w-auto" onClick={() => trade("SELL", 10)}>
          Sell 10
        </Button>
        <Button variant="ghost" className="w-full sm:w-auto" onClick={flatten} disabled={shares === 0}>
          Flatten
        </Button>
        <Button
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => {
            setCash(STARTING_CASH);
            setShares(0);
            setFills([]);
            setMessage("Session reset");
          }}
        >
          Reset
        </Button>
      </div>
      <div className="border-t border-border px-3 py-2">
        <p className="font-mono text-[11px] text-muted" aria-live="polite">
          {message}
        </p>
        {fills.length > 0 ? (
          <ul className="mt-2 space-y-1 font-mono text-[11px] tabular-nums text-muted">
            {fills.map((fill, index) => (
              <li
                key={`${fill.at}-${index}`}
                className={fill.side === "BUY" ? "text-success" : "text-danger"}
              >
                {fill.at} {fill.side} {fill.qty} @ {formatPx(fill.px)}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] tracking-wide text-muted uppercase">
            Best mark {best >= 0 ? "+" : ""}
            {formatCash(best)} · buys lift the ask · shorts allowed
          </p>
          {variant === "compact" ? (
            <Link
              href="/tools/tape-trader"
              className="font-mono text-[10px] tracking-wide text-accent uppercase hover:underline"
            >
              Full desk →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
