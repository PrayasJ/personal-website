"use client";

import { ToolShell } from "@/components/tools/ToolShell";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { ToolPane } from "@/components/tools/ToolPane";
import { formatInZone, parseInstant, timeZones } from "@/lib/timezone";

const ZONE_LABELS: Record<(typeof timeZones)[number], string> = {
  UTC: "UTC",
  "Asia/Kolkata": "Kolkata",
  "Asia/Dubai": "Dubai",
  "Asia/Singapore": "Singapore",
  "Asia/Tokyo": "Tokyo",
  "Europe/London": "London",
  "Europe/Berlin": "Berlin",
  "America/New_York": "New York",
  "America/Chicago": "Chicago",
  "America/Los_Angeles": "Los Angeles",
  "Australia/Sydney": "Sydney",
};

const ZONE_HINTS: Record<(typeof timeZones)[number], string> = {
  UTC: "Coordinated Universal Time",
  "Asia/Kolkata": "IST",
  "Asia/Dubai": "GST",
  "Asia/Singapore": "SGT",
  "Asia/Tokyo": "JST",
  "Europe/London": "GMT / BST",
  "Europe/Berlin": "CET / CEST",
  "America/New_York": "ET",
  "America/Chicago": "CT",
  "America/Los_Angeles": "PT",
  "Australia/Sydney": "AEST / AEDT",
};

export function TimezoneConverter() {
  const [input, setInput] = useState("2026-09-12T16:00:00Z");
  const [home, setHome] = useState<(typeof timeZones)[number]>("Asia/Kolkata");
  const parsed = useMemo(() => {
    if (!input.trim()) {
      return { ok: true as const, value: null };
    }
    try {
      return { ok: true as const, value: parseInstant(input) };
    } catch (caught) {
      return {
        ok: false as const,
        error: caught instanceof Error ? caught.message : "Invalid datetime.",
      };
    }
  }, [input]);

  const ordered = [home, ...timeZones.filter((zone) => zone !== home)];
  const instant = parsed.ok ? parsed.value : null;

  return (
    <ToolShell>
      <p className="text-sm text-muted">
        Paste ISO-8601 or a unix timestamp. Zones are IANA names via
        Intl.DateTimeFormat. Asia/Kolkata is IST.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Instant" htmlFor="tz-instant">
          <input
            id="tz-instant"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="field-input"
            spellCheck={false}
          />
        </Field>
        <Select
          label="Home zone"
          value={home}
          onChange={(next) => setHome(next as (typeof timeZones)[number])}
          options={timeZones.map((zone) => ({
            value: zone,
            label: ZONE_LABELS[zone],
            hint: ZONE_HINTS[zone],
          }))}
        />
      </div>
      <Button
        variant="ghost"
        className="mt-3"
        onClick={() => setInput(new Date().toISOString())}
      >
        Load now
      </Button>
      {!parsed.ok ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
          {parsed.error}
        </p>
      ) : instant ? (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ordered.map((zone) => (
            <li key={zone}>
              <ToolPane
                tone={zone === home ? "in" : "out"}
                label={zone === home ? `Home · ${ZONE_LABELS[zone]}` : ZONE_LABELS[zone]}
              >
                <p className="mt-2 font-mono text-sm text-ink">
                  {formatInZone(instant, zone)}
                </p>
                <p className="mt-1 font-mono text-xs text-muted">{zone}</p>
              </ToolPane>
            </li>
          ))}
        </ul>
      ) : null}
    </ToolShell>
  );
}
