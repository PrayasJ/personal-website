const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigits(n: number): string {
  if (n < 20) {
    return ones[n] ?? "";
  }
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${tens[t]}${o ? ` ${ones[o]}` : ""}`.trim();
}

function threeDigits(n: number): string {
  if (n < 100) {
    return twoDigits(n);
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return `${ones[h]} Hundred${rest ? ` ${twoDigits(rest)}` : ""}`.trim();
}

function integerInWords(n: number): string {
  if (n === 0) {
    return "Zero";
  }
  const parts: string[] = [];
  let rem = n;
  const crore = Math.floor(rem / 1_00_00_000);
  rem %= 1_00_00_000;
  const lakh = Math.floor(rem / 1_00_000);
  rem %= 1_00_000;
  const thousand = Math.floor(rem / 1000);
  rem %= 1000;

  if (crore) {
    parts.push(`${threeDigits(crore)} Crore`);
  }
  if (lakh) {
    parts.push(`${threeDigits(lakh)} Lakh`);
  }
  if (thousand) {
    parts.push(`${threeDigits(thousand)} Thousand`);
  }
  if (rem) {
    parts.push(threeDigits(rem));
  }
  return parts.join(" ");
}

/** Indian numbering: crore / lakh / thousand for the rupee part. */
export function amountInWordsInr(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Amount must be a non-negative number.");
  }
  if (amount > 999_99_99_999.99) {
    throw new Error("Amount is too large for this converter.");
  }
  const rounded = Math.round(amount * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  if (rupees === 0 && paise === 0) {
    return "Rupees Zero Only";
  }

  let out = `Rupees ${integerInWords(rupees)}`;
  if (paise) {
    out += ` and ${twoDigits(paise)} Paise`;
  }
  return `${out} Only`;
}

/** Plain Indian number words without the Rupees prefix (integer part only). */
export function numberInWordsIndian(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Enter a non-negative number.");
  }
  if (value > 999_99_99_999) {
    throw new Error("Number is too large for this converter.");
  }
  const whole = Math.floor(value);
  return integerInWords(whole) || "Zero";
}
