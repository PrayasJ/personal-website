const UNIT_MS: Record<string, number> = {
  ns: 1 / 1e6,
  us: 1 / 1e3,
  µs: 1 / 1e3,
  μs: 1 / 1e3,
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
};

const UNIT = /(?:\d+(?:\.\d+)?)(?:ns|us|µs|μs|ms|s|m|h)/;

export type DurationParts = {
  sign: 1 | -1;
  hours: number;
  minutes: number;
  seconds: number;
  millis: number;
  totalMs: number;
  go: string;
};

export function parseGoDuration(raw: string): DurationParts {
  const value = raw.trim().replace(/\s+/g, "");
  if (!value) {
    throw new Error("Enter a Go duration such as 1h30m or 250ms.");
  }
  const match = new RegExp(`^[+-]?(?:${UNIT.source})+$`).exec(value);
  if (!match) {
    throw new Error("Use Go duration syntax: 300ms, 1h30m, -1.5h. Units: ns us ms s m h.");
  }
  const sign: 1 | -1 = value.startsWith("-") ? -1 : 1;
  const body = value.replace(/^[+-]/, "");
  const pieces = [...body.matchAll(/(\d+(?:\.\d+)?)(ns|us|µs|μs|ms|s|m|h)/g)];
  if (pieces.length === 0) {
    throw new Error("No duration units found.");
  }
  let totalMs = 0;
  for (const piece of pieces) {
    const amount = Number(piece[1]);
    const unit = piece[2];
    const factor = UNIT_MS[unit];
    if (!Number.isFinite(amount) || factor == null) {
      throw new Error(`Unknown duration unit ${unit}.`);
    }
    totalMs += amount * factor;
  }
  return fromMillis(sign * totalMs);
}

export function fromMillis(totalMs: number): DurationParts {
  if (!Number.isFinite(totalMs)) {
    throw new Error("Duration must be a finite number of milliseconds.");
  }
  const sign: 1 | -1 = totalMs < 0 ? -1 : 1;
  let rest = Math.abs(totalMs);
  const hours = Math.floor(rest / 3_600_000);
  rest -= hours * 3_600_000;
  const minutes = Math.floor(rest / 60_000);
  rest -= minutes * 60_000;
  const seconds = Math.floor(rest / 1000);
  const millis = rest - seconds * 1000;
  return {
    sign,
    hours,
    minutes,
    seconds,
    millis,
    totalMs,
    go: formatGoDuration(totalMs),
  };
}

export function formatGoDuration(totalMs: number): string {
  if (totalMs === 0) {
    return "0s";
  }
  const sign = totalMs < 0 ? "-" : "";
  let rest = Math.abs(totalMs);
  const hours = Math.floor(rest / 3_600_000);
  rest -= hours * 3_600_000;
  const minutes = Math.floor(rest / 60_000);
  rest -= minutes * 60_000;
  const seconds = Math.floor(rest / 1000);
  const millis = rest - seconds * 1000;
  let out = sign;
  if (hours) {
    out += `${hours}h`;
  }
  if (minutes) {
    out += `${minutes}m`;
  }
  if (seconds) {
    out += `${seconds}s`;
  }
  if (millis) {
    const rounded = Number(millis.toFixed(6)).toString().replace(/\.?0+$/, "");
    out += `${rounded}ms`;
  }
  return out || "0s";
}
