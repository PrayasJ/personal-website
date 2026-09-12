export const timeZones = [
  "UTC",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Australia/Sydney",
] as const;

export function formatInZone(date: Date, timeZone: string): string {
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

export function parseInstant(raw: string): Date {
  const value = raw.trim();
  if (!value) {
    throw new Error("Enter a datetime.");
  }
  if (/^-?\d+$/.test(value)) {
    const numeric = Number(value);
    const millis = Math.abs(numeric) >= 1e12 ? numeric : numeric * 1000;
    const date = new Date(millis);
    if (Number.isNaN(date.getTime())) {
      throw new Error("That epoch is not a valid date.");
    }
    return date;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Use ISO-8601 or a unix timestamp.");
  }
  return parsed;
}
