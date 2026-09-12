"use client";

import { Tick } from "@/components/fx/Tick";
import { TAPE_SYMBOL, formatPx, useTape } from "@/components/desk/TapeProvider";

export function LiveTape() {
  const { last, open, bid, ask, volume, clock } = useTape();
  const chg = last - open;
  const pct = (chg / open) * 100;
  const up = chg >= 0;
  const chgText = `${up ? "+" : ""}${formatPx(chg)} (${up ? "+" : ""}${pct.toFixed(2)}%)`;

  const items = [
    {
      key: "quote",
      className: up ? "text-success" : "text-danger",
      render: () => (
        <>
          {TAPE_SYMBOL} <Tick>{formatPx(last)}</Tick> {chgText}
        </>
      ),
    },
    {
      key: "book",
      className: "text-muted",
      render: () => `BID ${formatPx(bid)}  ASK ${formatPx(ask)}`,
    },
    {
      key: "vol",
      className: "text-muted",
      render: () => `VOL ${volume.toLocaleString("en-IN")}`,
    },
    {
      key: "clock",
      className: "text-muted",
      render: () => clock,
    },
    { key: "oms", className: "text-muted", render: () => "OMS LIVE" },
    { key: "go", className: "text-muted", render: () => "GO BACKEND" },
    { key: "rpc", className: "text-muted", render: () => "RPC LOW LATENCY" },
    { key: "venue", className: "text-muted", render: () => "VENUE NUBRA" },
    {
      key: "disclaimer",
      className: "text-muted",
      render: () => "TOY TAPE · NOT A MARKET",
    },
  ];

  return (
    <>
      <div className="overflow-hidden border-b border-border/80 px-4 py-1.5 sm:hidden">
        <p className="tape flex items-center justify-between gap-3">
          <span className={`min-w-0 truncate ${up ? "text-success" : "text-danger"}`}>
            {TAPE_SYMBOL} <Tick>{formatPx(last)}</Tick> {chgText}
          </span>
          <span className="shrink-0 text-muted">{clock}</span>
        </p>
      </div>
      <div className="hidden overflow-hidden border-b border-border/80 sm:block">
        <div className="tape-track">
          {[0, 1].map((copy) => (
            <p key={copy} className="tape flex shrink-0 items-center gap-8 px-6 py-1.5">
              {items.map((item) => (
                <span key={`${copy}-${item.key}`} className={item.className}>
                  {item.render()}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
