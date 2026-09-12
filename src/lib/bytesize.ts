export const iecUnits = ["B", "KiB", "MiB", "GiB", "TiB"] as const;
export const siUnits = ["B", "kB", "MB", "GB", "TB"] as const;

export type SizeUnit = (typeof iecUnits)[number] | (typeof siUnits)[number];

const IEC = 1024;
const SI = 1000;

function factor(unit: SizeUnit, binary: boolean): number {
  if (unit === "B") {
    return 1;
  }
  if (binary) {
    const index = iecUnits.indexOf(unit as (typeof iecUnits)[number]);
    return index <= 0 ? 1 : IEC ** index;
  }
  const index = siUnits.indexOf(unit as (typeof siUnits)[number]);
  return index <= 0 ? 1 : SI ** index;
}

export function toBytes(amount: number, unit: SizeUnit, binary: boolean): number {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Size must be a non-negative number.");
  }
  return amount * factor(unit, binary);
}

export function fromBytes(bytes: number, unit: SizeUnit, binary: boolean): number {
  return bytes / factor(unit, binary);
}

export function formatUnit(bytes: number, unit: SizeUnit, binary: boolean): string {
  const n = fromBytes(bytes, unit, binary);
  if (!Number.isFinite(n)) {
    return "—";
  }
  if (Number.isInteger(n)) {
    return String(n);
  }
  return String(Number(n.toPrecision(8)));
}

export function formatSize(bytes: number, binary: boolean): string {
  const units = binary ? iecUnits : siUnits;
  const base = binary ? IEC : SI;
  if (bytes < base) {
    return `${trimNumber(bytes)} B`;
  }
  let value = bytes;
  let index = 0;
  while (value >= base && index < units.length - 1) {
    value /= base;
    index += 1;
  }
  return `${trimNumber(value)} ${units[index]}`;
}

function trimNumber(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toPrecision(6).replace(/\.?0+$/, "");
}
