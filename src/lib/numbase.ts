const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";
const ZERO = BigInt(0);

export const bases = [2, 8, 10, 16] as const;

export type NumericBase = (typeof bases)[number];

export function parseBigInt(input: string, radix: NumericBase): bigint {
  let trimmed = input.trim().replace(/[\s_]/g, "");
  if (radix === 16) {
    trimmed = trimmed.replace(/^0x/i, "");
  } else if (radix === 2) {
    trimmed = trimmed.replace(/^0b/i, "");
  } else if (radix === 8) {
    trimmed = trimmed.replace(/^0o/i, "");
  }
  if (!trimmed || trimmed === "+" || trimmed === "-") {
    throw new Error("Enter a number.");
  }
  const negative = trimmed.startsWith("-");
  const body = trimmed.replace(/^[+-]/, "").toLowerCase();
  if (body.length === 0) {
    throw new Error("Enter a number.");
  }
  const limit = BigInt(radix);
  let value = ZERO;
  for (const char of body) {
    const digit = BigInt(DIGITS.indexOf(char));
    if (digit < ZERO || digit >= limit) {
      throw new Error(`“${char}” is not valid in base ${radix}.`);
    }
    value = value * limit + digit;
  }
  return negative ? -value : value;
}

export function formatBigInt(value: bigint, radix: NumericBase): string {
  if (value === ZERO) {
    return "0";
  }
  const sign = value < ZERO ? "-" : "";
  let remaining = value < ZERO ? -value : value;
  const limit = BigInt(radix);
  let out = "";
  while (remaining > ZERO) {
    out = DIGITS[Number(remaining % limit)] + out;
    remaining /= limit;
  }
  return `${sign}${out}`;
}
