"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/tools/CopyButton";
import { ToolPane } from "@/components/tools/ToolPane";
import { Field } from "@/components/ui/Field";
import { parseHex, parseRgb, rgbToHex, rgbToHsl } from "@/lib/color";

export function ColorConverter() {
  const [hex, setHex] = useState("#4f46e5");
  const parsed = useMemo(() => {
    try {
      const rgb = hex.trim().startsWith("rgb") ? parseRgb(hex) : parseHex(hex);
      const hsl = rgbToHsl(rgb);
      return {
        ok: true as const,
        hex: rgbToHex(rgb),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        swatch: rgbToHex(rgb),
      };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid color.",
      };
    }
  }, [hex]);

  const pickerValue = parsed.ok ? parsed.hex : "#4f46e5";

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Hex, rgb(), and HSL for the same color. Alpha is ignored. The swatch is CSS
        in this page, not a design-system token.
      </p>
      <Field label="Color" htmlFor="color-hex" className="mt-4">
        <div className="color-well">
          <input
            type="color"
            value={pickerValue}
            aria-label="Pick a color"
            onChange={(event) => setHex(event.target.value)}
          />
          <input
            id="color-hex"
            value={hex}
            onChange={(event) => setHex(event.target.value)}
            className="field-input"
            spellCheck={false}
            placeholder="#4f46e5 or rgb(79, 70, 229)"
          />
        </div>
      </Field>
      {!parsed.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {parsed.error}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div
            className="min-h-24 rounded-xl border border-border"
            style={{ background: parsed.swatch }}
            aria-label={`Swatch ${parsed.hex}`}
          />
          <div className="space-y-3">
            {(["hex", "rgb", "hsl"] as const).map((key) => (
              <ToolPane key={key} tone="out" label={key} actions={<CopyButton value={parsed[key]} />}>
                <p className="mt-2 font-mono text-sm text-ink">{parsed[key]}</p>
              </ToolPane>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        className="mt-3 text-sm text-accent hover:underline"
        onClick={() => setHex("#4f46e5")}
      >
        Load accent
      </button>
    </ToolShell>
  );
}
