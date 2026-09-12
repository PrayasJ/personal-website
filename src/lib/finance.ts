import { formatInr } from "@/lib/emi";

export { formatInr };

export type FdResult = {
  maturity: number;
  interest: number;
};

export function calculateFd(
  principal: number,
  annualPercent: number,
  years: number,
  compoundsPerYear: number,
): FdResult {
  if (!(principal > 0) || annualPercent < 0 || !(years > 0) || !(compoundsPerYear > 0)) {
    throw new Error("Principal, rate, tenure, and compounding must be valid.");
  }
  const n = compoundsPerYear;
  const maturity = principal * (1 + annualPercent / 100 / n) ** (n * years);
  return {
    maturity,
    interest: maturity - principal,
  };
}

export const gstRates = [0, 5, 12, 18, 28] as const;

export type GstResult = {
  base: number;
  gst: number;
  total: number;
  cgst: number;
  sgst: number;
};

export function calculateGst(
  amount: number,
  rate: number,
  inclusive: boolean,
): GstResult {
  if (!(amount >= 0) || rate < 0) {
    throw new Error("Amount and rate must be valid.");
  }
  const factor = rate / 100;
  const base = inclusive ? amount / (1 + factor) : amount;
  const total = inclusive ? amount : amount * (1 + factor);
  const gst = total - base;
  return {
    base,
    gst,
    total,
    cgst: gst / 2,
    sgst: gst / 2,
  };
}

export type PercentResult = {
  portion: number;
  percentOf: number;
  change: number;
};

export function percentOf(percent: number, of: number): number {
  return (percent / 100) * of;
}

export function whatPercent(part: number, whole: number): number {
  if (whole === 0) {
    throw new Error("Cannot divide by zero.");
  }
  return (part / whole) * 100;
}

export function percentChange(from: number, to: number): number {
  if (from === 0) {
    throw new Error("Cannot divide by zero.");
  }
  return ((to - from) / from) * 100;
}
