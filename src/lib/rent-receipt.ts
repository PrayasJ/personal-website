import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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

/** Indian numbering: crore / lakh / thousand. Integers only for the rupee part. */
export function amountInWordsInr(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Amount must be a non-negative number.");
  }
  const rounded = Math.round(amount * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  if (rupees === 0 && paise === 0) {
    return "Rupees Zero Only";
  }

  const parts: string[] = [];
  let n = rupees;
  const crore = Math.floor(n / 1_00_00_000);
  n %= 1_00_00_000;
  const lakh = Math.floor(n / 1_00_000);
  n %= 1_00_000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;

  if (crore) {
    parts.push(`${threeDigits(crore)} Crore`);
  }
  if (lakh) {
    parts.push(`${threeDigits(lakh)} Lakh`);
  }
  if (thousand) {
    parts.push(`${threeDigits(thousand)} Thousand`);
  }
  if (n) {
    parts.push(threeDigits(n));
  }

  let out = parts.length ? `Rupees ${parts.join(" ")}` : "Rupees Zero";
  if (paise) {
    out += ` and ${twoDigits(paise)} Paise`;
  }
  return `${out} Only`;
}

export type RentReceiptInput = {
  landlordName: string;
  tenantName: string;
  amount: number;
  periodLabel: string;
  propertyAddress: string;
  receiptDate: string;
  city?: string;
  landlordPan?: string;
  receiptNo?: string;
};

export function buildRentReceiptText(input: RentReceiptInput): string {
  const amount = input.amount;
  if (!(amount > 0)) {
    throw new Error("Enter a rent amount greater than zero.");
  }
  const landlord = input.landlordName.trim();
  const tenant = input.tenantName.trim();
  const address = input.propertyAddress.trim();
  const period = input.periodLabel.trim();
  if (!landlord || !tenant || !address || !period) {
    throw new Error("Fill landlord, tenant, address, and period.");
  }
  const words = amountInWordsInr(amount);
  const city = input.city?.trim();
  const pan = input.landlordPan?.trim().toUpperCase();
  const no = input.receiptNo?.trim();
  const lines = [
    "RENT RECEIPT",
    no ? `Receipt No: ${no}` : null,
    `Date: ${input.receiptDate}`,
    city ? `Place: ${city}` : null,
    "",
    `Received with thanks from ${tenant} a sum of ₹${amount.toLocaleString("en-IN", { minimumFractionDigits: amount % 1 ? 2 : 0, maximumFractionDigits: 2 })} (${words}) towards rent for ${period} for the premises at:`,
    address,
    "",
    pan ? `Landlord PAN: ${pan}` : null,
    "",
    `Landlord / Owner: ${landlord}`,
    "",
    "(Signature of landlord)",
  ].filter((line): line is string => line !== null);
  return lines.join("\n");
}

export async function buildRentReceiptPdf(
  input: RentReceiptInput,
): Promise<Uint8Array> {
  const text = buildRentReceiptText(input);
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const margin = 56;
  let y = page.getHeight() - margin;
  const maxWidth = page.getWidth() - margin * 2;

  function wrap(line: string, size: number, useBold = false): void {
    const face = useBold ? bold : font;
    const words = line.split(/\s+/);
    let row = "";
    for (const word of words) {
      const next = row ? `${row} ${word}` : word;
      if (face.widthOfTextAtSize(next, size) > maxWidth && row) {
        page.drawText(row, { x: margin, y, size, font: face, color: rgb(0.1, 0.1, 0.1) });
        y -= size + 6;
        row = word;
      } else {
        row = next;
      }
    }
    if (row) {
      page.drawText(row, { x: margin, y, size, font: face, color: rgb(0.1, 0.1, 0.1) });
      y -= size + 6;
    }
  }

  for (const line of text.split("\n")) {
    if (!line) {
      y -= 10;
      continue;
    }
    if (line === "RENT RECEIPT") {
      wrap(line, 18, true);
      y -= 8;
      continue;
    }
    wrap(line, 11, false);
  }

  return doc.save({ useObjectStreams: true });
}
