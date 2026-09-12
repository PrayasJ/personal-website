"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Field, Stat } from "@/components/ui/Field";
import { percentChange, percentOf, whatPercent } from "@/lib/finance";

export function PercentageCalculator() {
  const [percent, setPercent] = useState("18");
  const [of, setOf] = useState("1000");
  const [part, setPart] = useState("180");
  const [whole, setWhole] = useState("1000");
  const [from, setFrom] = useState("100");
  const [to, setTo] = useState("118");

  const portion = useMemo(() => percentOf(Number(percent), Number(of)), [percent, of]);
  const ratio = useMemo(() => {
    try {
      return { ok: true as const, value: whatPercent(Number(part), Number(whole)) };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid.",
      };
    }
  }, [part, whole]);
  const change = useMemo(() => {
    try {
      return { ok: true as const, value: percentChange(Number(from), Number(to)) };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid.",
      };
    }
  }, [from, to]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Three small percent problems. No rounding policy beyond IEEE floats.
      </p>
      <section className="tool-section mt-4">
        <h2 className="text-sm font-medium text-ink">What is x% of y?</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Percent" htmlFor="pct-x" suffix="%">
            <input
              id="pct-x"
              value={percent}
              onChange={(event) => setPercent(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
          <Field label="Of" htmlFor="pct-of">
            <input
              id="pct-of"
              value={of}
              onChange={(event) => setOf(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
          <Stat
            label="Result"
            value={Number.isFinite(portion) ? String(portion) : "—"}
            tone="accent"
          />
        </div>
      </section>
      <section className="tool-section mt-4">
        <h2 className="text-sm font-medium text-ink">x is what % of y?</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Part" htmlFor="pct-part">
            <input
              id="pct-part"
              value={part}
              onChange={(event) => setPart(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
          <Field label="Whole" htmlFor="pct-whole">
            <input
              id="pct-whole"
              value={whole}
              onChange={(event) => setWhole(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
          <Stat
            label="Result"
            value={ratio.ok ? `${ratio.value.toFixed(4)}%` : ratio.error}
            tone={ratio.ok ? "accent" : "default"}
          />
        </div>
      </section>
      <section className="tool-section mt-4">
        <h2 className="text-sm font-medium text-ink">% change from → to</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="From" htmlFor="pct-from">
            <input
              id="pct-from"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
          <Field label="To" htmlFor="pct-to">
            <input
              id="pct-to"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="field-input"
              inputMode="decimal"
            />
          </Field>
          <Stat
            label="Change"
            value={change.ok ? `${change.value.toFixed(4)}%` : change.error}
            tone={change.ok ? (change.value >= 0 ? "success" : "danger") : "default"}
          />
        </div>
      </section>
    </ToolShell>
  );
}
