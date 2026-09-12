"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, Stat } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { useMemo, useState } from "react";
import { amountInWordsInr, numberInWordsIndian } from "@/lib/inr-words";

type Mode = "rupees" | "plain";

export function NumberToWords() {
  const [amount, setAmount] = useState("125000.50");
  const [mode, setMode] = useState<Mode>("rupees");

  const result = useMemo(() => {
    try {
      const value = Number(amount);
      const words =
        mode === "rupees"
          ? amountInWordsInr(value)
          : numberInWordsIndian(value);
      return { ok: true as const, words, value };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid.",
      };
    }
  }, [amount, mode]);

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Convert a number to Indian-style words (crore / lakh / thousand). Useful
        for cheques, invoices, and rent receipts. Runs in this tab.
      </p>
      <Segmented
        className="mt-4"
        label="Format"
        value={mode}
        onChange={setMode}
        options={[
          { value: "rupees", label: "Rupees … Only" },
          { value: "plain", label: "Number only" },
        ]}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Amount" htmlFor="ntw-amount" hint="Indian numbering">
          <input
            id="ntw-amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="field-input"
            inputMode="decimal"
          />
        </Field>
        <Stat
          label="In words"
          value={result.ok ? result.words : result.error}
          tone={result.ok ? "accent" : "default"}
        />
      </div>
      {result.ok ? (
        <div className="mt-4">
          <p className="rounded-lg border border-border bg-panel px-3 py-3 text-sm leading-6 text-ink">
            {result.words}
          </p>
          <div className="mt-3">
            <CopyButton value={result.words} label="Copy words" />
          </div>
        </div>
      ) : null}
    </ToolShell>
  );
}
