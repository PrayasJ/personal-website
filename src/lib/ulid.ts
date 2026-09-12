const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeCrockford(value: number, length: number): string {
  let remaining = value;
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out = ENCODING[remaining % 32] + out;
    remaining = Math.floor(remaining / 32);
  }
  return out;
}

function randomBits(bytes: number): number[] {
  const buffer = new Uint8Array(bytes);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buffer);
  } else {
    for (let i = 0; i < bytes; i += 1) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
  }
  return [...buffer];
}

export function randomUlid(now = Date.now()): string {
  const time = encodeCrockford(now, 10);
  const entropy = randomBits(10);
  let leftover = 0;
  let leftoverBits = 0;
  let rand = "";
  for (const byte of entropy) {
    leftover = (leftover << 8) | byte;
    leftoverBits += 8;
    while (leftoverBits >= 5) {
      leftoverBits -= 5;
      rand += ENCODING[(leftover >> leftoverBits) & 31];
    }
  }
  if (leftoverBits > 0) {
    rand += ENCODING[(leftover << (5 - leftoverBits)) & 31];
  }
  return time + rand.slice(0, 16);
}

export function decodeUlidTime(id: string): number {
  const raw = id.trim().replace(/-/g, "").toUpperCase();
  if (!/^[0-9A-HJKMNP-TV-Z]{26}$/.test(raw)) {
    throw new Error("A ULID is 26 Crockford Base32 characters.");
  }
  let time = 0;
  for (const char of raw.slice(0, 10)) {
    const digit = ENCODING.indexOf(char);
    if (digit < 0) {
      throw new Error("That ULID uses a character outside Crockford Base32.");
    }
    time = time * 32 + digit;
  }
  return time;
}

export function formatUlid(value: string, uppercase: boolean): string {
  return uppercase ? value.toUpperCase() : value.toLowerCase();
}
