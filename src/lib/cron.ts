const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export type CronFieldName = "minute" | "hour" | "dom" | "month" | "dow";

export type CronFields = Record<CronFieldName, string>;

export const defaultCronFields: CronFields = {
  minute: "*",
  hour: "*",
  dom: "*",
  month: "*",
  dow: "*",
};

export function joinCron(fields: CronFields): string {
  return `${fields.minute} ${fields.hour} ${fields.dom} ${fields.month} ${fields.dow}`;
}

export function parseCron(expression: string): CronFields | null {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return null;
  }
  return {
    minute: parts[0],
    hour: parts[1],
    dom: parts[2],
    month: parts[3],
    dow: parts[4],
  };
}

function describeField(
  raw: string,
  label: string,
  min: number,
  max: number,
  names?: string[],
): string {
  const value = raw.toUpperCase();
  if (value === "*") {
    return `every ${label}`;
  }
  if (value.startsWith("*/")) {
    const step = Number(value.slice(2));
    if (Number.isFinite(step) && step > 0) {
      return `every ${step} ${label}${step === 1 ? "" : "s"}`;
    }
  }
  const bits = value.split(",");
  const pretty = bits.map((bit) => {
    if (bit.includes("-")) {
      const [from, to] = bit.split("-");
      return `${prettyToken(from, min, max, names)}–${prettyToken(to, min, max, names)}`;
    }
    return prettyToken(bit, min, max, names);
  });
  return `${label} ${pretty.join(", ")}`;
}

function prettyToken(token: string, min: number, max: number, names?: string[]): string {
  if (names) {
    const index = names.indexOf(token);
    if (index >= 0) {
      return names[index];
    }
  }
  const numeric = Number(token);
  if (Number.isFinite(numeric) && numeric >= min && numeric <= max) {
    return names?.[numeric] ?? String(numeric);
  }
  return token;
}

export function describeCron(expression: string): string {
  const fields = parseCron(expression);
  if (!fields) {
    throw new Error("Use a 5-field cron expression: minute hour day-of-month month day-of-week.");
  }
  const parts = [
    describeField(fields.minute, "minute", 0, 59),
    describeField(fields.hour, "hour", 0, 23),
    describeField(fields.dom, "day of the month", 1, 31),
    describeField(fields.month, "month", 1, 12, ["", ...MONTHS]),
    describeField(fields.dow, "weekday", 0, 7, WEEKDAYS),
  ];
  return parts.join(", ");
}

export const cronPresets: { label: string; expression: string }[] = [
  { label: "Every minute", expression: "* * * * *" },
  { label: "Hourly", expression: "0 * * * *" },
  { label: "Daily at 09:00", expression: "0 9 * * *" },
  { label: "Weekdays at 09:00", expression: "0 9 * * 1-5" },
  { label: "Weekly on Monday", expression: "0 9 * * 1" },
  { label: "Monthly on the 1st", expression: "0 9 1 * *" },
];
