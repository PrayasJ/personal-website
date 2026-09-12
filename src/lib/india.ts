import { formatInr } from "@/lib/emi";

export { formatInr };

export type PpfResult = {
  maturity: number;
  invested: number;
  interest: number;
};

export function calculatePpf(
  yearly: number,
  annualPercent: number,
  years: number,
): PpfResult {
  if (!(yearly > 0) || !(years > 0) || annualPercent < 0) {
    throw new Error("Deposit, tenure, and rate must be valid.");
  }
  if (yearly > 150_000) {
    throw new Error("PPF deposits are capped at ₹1.5 lakh a year.");
  }
  const rate = annualPercent / 100;
  let balance = 0;
  for (let year = 0; year < Math.round(years); year += 1) {
    balance = (balance + yearly) * (1 + rate);
  }
  const invested = yearly * Math.round(years);
  return {
    maturity: balance,
    invested,
    interest: balance - invested,
  };
}

export type RdResult = {
  maturity: number;
  invested: number;
  interest: number;
};

export function calculateRd(
  monthly: number,
  annualPercent: number,
  months: number,
): RdResult {
  if (!(monthly > 0) || !(months > 0) || annualPercent < 0) {
    throw new Error("Installment, tenure, and rate must be valid.");
  }
  const quarterly = annualPercent / 400;
  let maturity = 0;
  for (let month = 0; month < Math.round(months); month += 1) {
    const remainingMonths = Math.round(months) - month;
    maturity += monthly * (1 + quarterly) ** (remainingMonths / 3);
  }
  const invested = monthly * Math.round(months);
  return {
    maturity,
    invested,
    interest: maturity - invested,
  };
}

export type GratuityResult = {
  yearsCounted: number;
  amount: number;
  capped: boolean;
};

const GRATUITY_CAP = 2_000_000;

export function calculateGratuity(
  lastDrawn: number,
  years: number,
  covered: boolean,
): GratuityResult {
  if (!(lastDrawn > 0) || !(years > 0)) {
    throw new Error("Last drawn salary and service years must be positive.");
  }
  const whole = Math.floor(years);
  const yearsCounted = years - whole >= 0.5 ? whole + 1 : whole;
  if (yearsCounted < 5 && covered) {
    throw new Error("The Act usually needs five completed years of service.");
  }
  const divisor = covered ? 26 : 30;
  const raw = (lastDrawn * 15 * yearsCounted) / divisor;
  const capped = covered && raw > GRATUITY_CAP;
  return {
    yearsCounted,
    amount: capped ? GRATUITY_CAP : raw,
    capped,
  };
}
