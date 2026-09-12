const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";

export type PasswordSets = {
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
};

function pool(sets: PasswordSets): string {
  return [
    sets.lower ? LOWER : "",
    sets.upper ? UPPER : "",
    sets.digits ? DIGITS : "",
    sets.symbols ? SYMBOLS : "",
  ].join("");
}

function pick(alphabet: string): string {
  if (alphabet.length === 0) {
    throw new Error("Select at least one character set.");
  }
  const max = Math.floor(256 / alphabet.length) * alphabet.length;
  const bytes = new Uint8Array(1);
  let value = 256;
  while (value >= max) {
    crypto.getRandomValues(bytes);
    value = bytes[0];
  }
  return alphabet[value % alphabet.length];
}

export function randomPassword(length: number, sets: PasswordSets): string {
  const size = Math.min(128, Math.max(4, Math.floor(length)));
  const alphabet = pool(sets);
  const required: string[] = [];
  if (sets.lower) {
    required.push(pick(LOWER));
  }
  if (sets.upper) {
    required.push(pick(UPPER));
  }
  if (sets.digits) {
    required.push(pick(DIGITS));
  }
  if (sets.symbols) {
    required.push(pick(SYMBOLS));
  }
  const chars = [...required];
  while (chars.length < size) {
    chars.push(pick(alphabet));
  }
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const bytes = new Uint8Array(1);
    crypto.getRandomValues(bytes);
    const j = bytes[0] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}
