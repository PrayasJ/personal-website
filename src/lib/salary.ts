import { formatInr } from "@/lib/emi";

export { formatInr };

const PF_WAGE_CEILING = 180_000;
const GRATUITY_RATE = 4.81 / 100;
const PF_RATE = 0.12;
const STANDARD_DEDUCTION = 75_000;
const REBATE_CEILING = 1_200_000;
const CESS = 0.04;

const NEW_REGIME_SLABS: { upTo: number; rate: number }[] = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
];

export type CtcSplit = {
  ctc: number;
  basic: number;
  hra: number;
  special: number;
  employerPf: number;
  gratuity: number;
  gross: number;
  pfWage: number;
};

export type InHandResult = {
  gross: number;
  employeePf: number;
  professionalTax: number;
  taxable: number;
  incomeTax: number;
  cess: number;
  totalTax: number;
  annualInHand: number;
  monthlyInHand: number;
};

function rupees(value: number): number {
  return Math.round(value);
}

export function splitCtc(
  annualCtc: number,
  basicPercent: number,
  metro: boolean,
  pfCapped: boolean,
): CtcSplit {
  if (!(annualCtc > 0)) {
    throw new Error("CTC must be a positive amount.");
  }
  if (!(basicPercent > 0) || basicPercent > 80) {
    throw new Error("Basic should be between 1% and 80% of CTC.");
  }
  const basic = annualCtc * (basicPercent / 100);
  const hra = basic * (metro ? 0.5 : 0.4);
  const pfWage = pfCapped ? Math.min(basic, PF_WAGE_CEILING) : basic;
  const employerPf = pfWage * PF_RATE;
  const gratuity = basic * GRATUITY_RATE;
  const special = annualCtc - basic - hra - employerPf - gratuity;
  if (special < 0) {
    throw new Error(
      "Basic is too high for this CTC after HRA, employer PF, and gratuity.",
    );
  }
  return {
    ctc: rupees(annualCtc),
    basic: rupees(basic),
    hra: rupees(hra),
    special: rupees(special),
    employerPf: rupees(employerPf),
    gratuity: rupees(gratuity),
    gross: rupees(basic + hra + special),
    pfWage: rupees(pfWage),
  };
}

export function slabTax(taxable: number): number {
  if (!(taxable > 0)) {
    return 0;
  }
  let tax = 0;
  let previous = 0;
  for (const slab of NEW_REGIME_SLABS) {
    const slice = Math.min(taxable, slab.upTo) - previous;
    if (slice > 0) {
      tax += slice * slab.rate;
    }
    previous = slab.upTo;
    if (taxable <= slab.upTo) {
      break;
    }
  }
  return tax;
}

export function newRegimeTax(taxable: number): { tax: number; cess: number; total: number } {
  const raw = slabTax(taxable);
  let tax = raw;
  if (taxable <= REBATE_CEILING) {
    tax = 0;
  } else {
    const excess = taxable - REBATE_CEILING;
    tax = Math.min(raw, excess);
  }
  const cess = tax * CESS;
  return {
    tax: rupees(tax),
    cess: rupees(cess),
    total: rupees(tax + cess),
  };
}

export type IncomeTaxResult = {
  input: number;
  standardDeduction: number;
  taxable: number;
  slabTax: number;
  afterRebate: number;
  rebateApplied: boolean;
  cess: number;
  total: number;
  effectiveRate: number;
};

/** New-regime income tax. Mode "taxable" uses the figure as-is; "gross" subtracts ₹75,000 standard deduction. */
export function calculateIncomeTax(
  amount: number,
  mode: "taxable" | "gross",
): IncomeTaxResult {
  if (!(amount >= 0) || !Number.isFinite(amount)) {
    throw new Error("Enter a non-negative income amount.");
  }
  const input = rupees(amount);
  const standardDeduction = mode === "gross" ? STANDARD_DEDUCTION : 0;
  const taxable = Math.max(0, input - standardDeduction);
  const raw = slabTax(taxable);
  const rebateApplied = taxable <= REBATE_CEILING;
  let afterRebate = raw;
  if (rebateApplied) {
    afterRebate = 0;
  } else {
    afterRebate = Math.min(raw, taxable - REBATE_CEILING);
  }
  const cess = afterRebate * CESS;
  const total = afterRebate + cess;
  return {
    input,
    standardDeduction,
    taxable: rupees(taxable),
    slabTax: rupees(raw),
    afterRebate: rupees(afterRebate),
    rebateApplied,
    cess: rupees(cess),
    total: rupees(total),
    effectiveRate: input > 0 ? (rupees(total) / input) * 100 : 0,
  };
}

export type HraExemptionResult = {
  basic: number;
  hraReceived: number;
  rentPaid: number;
  metro: boolean;
  actualHra: number;
  percentOfBasic: number;
  rentMinusTenPercent: number;
  exemption: number;
  taxableHra: number;
};

/** Old-regime HRA exemption under section 10(13A). New regime does not allow this. */
export function calculateHraExemption(
  basic: number,
  hraReceived: number,
  rentPaid: number,
  metro: boolean,
): HraExemptionResult {
  if (!(basic > 0)) {
    throw new Error("Basic salary must be positive.");
  }
  if (hraReceived < 0 || rentPaid < 0) {
    throw new Error("HRA and rent cannot be negative.");
  }
  const actualHra = hraReceived;
  const percentOfBasic = basic * (metro ? 0.5 : 0.4);
  const rentMinusTenPercent = Math.max(0, rentPaid - basic * 0.1);
  const exemption = Math.max(
    0,
    Math.min(actualHra, percentOfBasic, rentMinusTenPercent),
  );
  return {
    basic: rupees(basic),
    hraReceived: rupees(hraReceived),
    rentPaid: rupees(rentPaid),
    metro,
    actualHra: rupees(actualHra),
    percentOfBasic: rupees(percentOfBasic),
    rentMinusTenPercent: rupees(rentMinusTenPercent),
    exemption: rupees(exemption),
    taxableHra: rupees(Math.max(0, hraReceived - exemption)),
  };
}

export function calculateInHand(
  annualGross: number,
  annualBasic: number,
  pfCapped: boolean,
  professionalTaxMonthly: number,
): InHandResult {
  if (!(annualGross > 0) || !(annualBasic > 0)) {
    throw new Error("Gross and basic must be positive.");
  }
  if (annualBasic > annualGross) {
    throw new Error("Basic cannot exceed gross.");
  }
  if (professionalTaxMonthly < 0) {
    throw new Error("Professional tax cannot be negative.");
  }
  const pfWage = pfCapped ? Math.min(annualBasic, PF_WAGE_CEILING) : annualBasic;
  const employeePf = rupees(pfWage * PF_RATE);
  const professionalTax = rupees(professionalTaxMonthly * 12);
  const taxable = Math.max(0, rupees(annualGross) - STANDARD_DEDUCTION);
  const tax = newRegimeTax(taxable);
  const annualInHand = rupees(annualGross) - employeePf - professionalTax - tax.total;
  return {
    gross: rupees(annualGross),
    employeePf,
    professionalTax,
    taxable,
    incomeTax: tax.tax,
    cess: tax.cess,
    totalTax: tax.total,
    annualInHand,
    monthlyInHand: rupees(annualInHand / 12),
  };
}
