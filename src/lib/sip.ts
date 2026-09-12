import { formatInr } from "@/lib/emi";

export { formatInr };

export type SipResult = {
  futureValue: number;
  invested: number;
  gain: number;
};

export function calculateSip(
  monthly: number,
  annualPercent: number,
  months: number,
): SipResult {
  if (!(monthly > 0) || !(months > 0) || annualPercent < 0) {
    throw new Error("Contribution, tenure, and rate must be valid positive values.");
  }
  const invested = monthly * months;
  const rate = annualPercent / 12 / 100;
  const futureValue =
    rate === 0
      ? invested
      : monthly * ((((1 + rate) ** months - 1) / rate) * (1 + rate));
  return {
    futureValue,
    invested,
    gain: futureValue - invested,
  };
}
