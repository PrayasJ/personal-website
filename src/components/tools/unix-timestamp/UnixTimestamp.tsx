"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeEditor } from "@/components/tools/CodeEditor";
import { ToolPane } from "@/components/tools/ToolPane";
import { Tick } from "@/components/fx/Tick";

const IST = "Asia/Kolkata";

function formatInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}

function parseTimeInput(raw: string): Date | null {
  const value = raw.trim();
  if (!value) {
    return null;
  }
  if (/^-?\d+$/.test(value)) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    const millis = Math.abs(numeric) >= 1e12 ? numeric : numeric * 1000;
    const date = new Date(millis);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function UnixTimestamp() {
  const [input, setInput] = useState("");
  const [nowMs, setNowMs] = useState(0);
  const [converted, setConverted] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const now = nowMs > 0 ? new Date(nowMs) : null;

  useEffect(() => {
    const id = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  function refreshNow() {
    setNowMs(Date.now());
  }

  function convert() {
    const date = parseTimeInput(input);
    if (!date) {
      setConverted(null);
      setError("Use unix seconds, milliseconds, or an ISO-8601 datetime.");
      return;
    }
    setError(null);
    setConverted(date);
  }

  const result = converted;
  const display = result ?? now;
  const seconds = display ? Math.floor(display.getTime() / 1000) : null;
  const millis = display ? display.getTime() : null;
  const iso = display ? display.toISOString() : null;
  const ist = display ? formatInZone(display, IST) : null;

  const live = result == null;

  return (
    <ToolShell>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="tape text-accent">clock</p>
          <p className="mt-1 break-all font-mono text-xl tabular-nums text-ink sm:text-2xl">
            {seconds == null ? "—" : live ? <Tick>{seconds}</Tick> : seconds}
          </p>
        </div>
        <Button variant="ghost" onClick={refreshNow}>
          Snap now
        </Button>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="tape">Unix s</dt>
          <dd className="break-all font-mono text-sm tabular-nums text-ink">
            {now ? Math.floor(now.getTime() / 1000) : "—"}
          </dd>
        </div>
        <div>
          <dt className="tape">UTC</dt>
          <dd className="font-mono text-sm text-ink">
            {now ? formatInZone(now, "UTC") : "—"}
          </dd>
        </div>
        <div>
          <dt className="tape">IST</dt>
          <dd className="font-mono text-sm text-ink">
            {now ? formatInZone(now, IST) : "—"}
          </dd>
        </div>
      </dl>

      <ToolPane tone="in" label="Epoch or ISO datetime" htmlFor="time-input" className="mt-6">
        <CodeEditor
          id="time-input"
          value={input}
          onChange={(value) => {
            setInput(value);
            setError(null);
          }}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              convert();
            }
          }}
          lang="plain"
          rows={3}
          minHeightClass="min-h-24"
          placeholder="1710000000 or 2026-09-12T16:00:00Z"
        />
      </ToolPane>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="primary" onClick={convert}>
          Convert
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setInput(String(Math.floor(Date.now() / 1000)));
            setError(null);
            setConverted(new Date());
            refreshNow();
          }}
        >
          Load now
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setInput("");
            setConverted(null);
            setError(null);
          }}
        >
          Clear
        </Button>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <div className="grid sm:grid-cols-2 sm:divide-x divide-y divide-border">
          <div className="p-4">
            <p className="tape">Seconds</p>
            <p className="mt-1 font-mono text-sm tabular-nums text-ink">
              {seconds ?? "—"}
            </p>
            <div className="mt-2">
              <CopyButton value={seconds != null ? String(seconds) : ""} disabled={seconds == null} />
            </div>
          </div>
          <div className="p-4">
            <p className="tape">Milliseconds</p>
            <p className="mt-1 font-mono text-sm tabular-nums text-ink">
              {millis ?? "—"}
            </p>
            <div className="mt-2">
              <CopyButton value={millis != null ? String(millis) : ""} disabled={millis == null} />
            </div>
          </div>
          <div className="p-4">
            <p className="tape">ISO 8601</p>
            <p className="mt-1 break-all font-mono text-sm text-ink">
              {iso ?? "—"}
            </p>
            <div className="mt-2">
              <CopyButton value={iso ?? ""} disabled={!iso} />
            </div>
          </div>
          <div className="p-4">
            <p className="tape">IST</p>
            <p className="mt-1 font-mono text-sm text-ink">
              {ist ?? "—"}
            </p>
            <div className="mt-2">
              <CopyButton value={ist ?? ""} disabled={!ist} />
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
