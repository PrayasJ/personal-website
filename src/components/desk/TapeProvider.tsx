"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const TAPE_SYMBOL = "PJX";
export const TAPE_START = 100;

export type BookLevel = {
  bid: number;
  bidSize: number;
  ask: number;
  askSize: number;
};

type TapeValue = {
  last: number;
  prev: number;
  open: number;
  high: number;
  low: number;
  bid: number;
  ask: number;
  spread: number;
  lastSize: number;
  volume: number;
  history: number[];
  levels: BookLevel[];
  clock: string;
};

const TapeContext = createContext<TapeValue | null>(null);

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function stepPrice(px: number): number {
  const u1 = Math.max(1e-9, Math.random());
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const sigma = 0.0022;
  const jump = Math.random() < 0.025 ? (Math.random() - 0.5) * 0.014 : 0;
  const next = px * Math.exp(-0.5 * sigma * sigma + sigma * z) * (1 + jump);
  return round2(Math.min(360, Math.max(42, next)));
}

function makeLevels(mid: number, jitter = true): BookLevel[] {
  return [1, 2, 3, 4, 5].map((level) => {
    const extra = jitter ? Math.random() * 0.018 : 0.01;
    const sizeJitter = jitter ? Math.floor(Math.random() * 28) : 12;
    const offset = round2(0.02 * level + extra);
    return {
      bid: round2(mid - offset),
      bidSize: 10 + level * 8 + sizeJitter,
      ask: round2(mid + offset),
      askSize: 10 + level * 8 + sizeJitter,
    };
  });
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

const initialLevels = makeLevels(TAPE_START, false);

type TapeTick = {
  history: number[];
  levels: BookLevel[];
  lastSize: number;
  volume: number;
  clock: string;
};

export function TapeProvider({ children }: { children: React.ReactNode }) {
  const [open] = useState(TAPE_START);
  const [tick, setTick] = useState<TapeTick>({
    history: [TAPE_START],
    levels: initialLevels,
    lastSize: 12,
    volume: 0,
    clock: "--:--:--",
  });

  useEffect(() => {
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interval = reduced ? 1600 : 380;
    const id = window.setInterval(() => {
      const size = 4 + Math.floor(Math.random() * 36);
      setTick((current) => {
        const last = current.history[current.history.length - 1] ?? TAPE_START;
        const next = stepPrice(last);
        return {
          history: [...current.history.slice(-159), next],
          levels: makeLevels(next).slice(0, 5),
          lastSize: size,
          volume: current.volume + size,
          clock: formatClock(new Date()),
        };
      });
    }, interval);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo<TapeValue>(() => {
    const { history, levels, lastSize, volume, clock } = tick;
    const last = history[history.length - 1] ?? TAPE_START;
    const prev = history[history.length - 2] ?? last;
    const high = Math.max(...history);
    const low = Math.min(...history);
    const bid = levels[0]?.bid ?? round2(last - 0.04);
    const ask = levels[0]?.ask ?? round2(last + 0.04);
    return {
      last,
      prev,
      open,
      high,
      low,
      bid,
      ask,
      spread: round2(ask - bid),
      lastSize,
      volume,
      history,
      levels: levels.slice(0, 5),
      clock,
    };
  }, [open, tick]);

  return <TapeContext.Provider value={value}>{children}</TapeContext.Provider>;
}

export function useTape(): TapeValue {
  const value = useContext(TapeContext);
  if (!value) {
    throw new Error("useTape must be used inside TapeProvider");
  }
  return value;
}

export function formatPx(value: number): string {
  return value.toFixed(2);
}

export function formatCash(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}${Math.abs(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
