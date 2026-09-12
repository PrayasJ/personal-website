export type AmortizationRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

export type EmiResult = {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
};

export function calculateEmi(
  principal: number,
  annualPercent: number,
  months: number,
): EmiResult {
  if (!(principal > 0) || !(months > 0) || annualPercent < 0) {
    throw new Error("Principal, tenure, and rate must be valid positive values.");
  }
  const rate = annualPercent / 12 / 100;
  const emi =
    rate === 0
      ? principal / months
      : (principal * rate * (1 + rate) ** months) / ((1 + rate) ** months - 1);
  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  for (let month = 1; month <= months; month += 1) {
    const interest = rate === 0 ? 0 : balance * rate;
    const principalPart = Math.min(emi - interest, balance);
    balance = Math.max(0, balance - principalPart);
    totalInterest += interest;
    schedule.push({
      month,
      payment: principalPart + interest,
      interest,
      principal: principalPart,
      balance,
    });
  }
  return {
    emi,
    totalPayment: principal + totalInterest,
    totalInterest,
    schedule,
  };
}

export function formatInr(value: number): string {
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}
