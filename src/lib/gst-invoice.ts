import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { amountInWordsInr } from "@/lib/inr-words";
import { calculateGst } from "@/lib/finance";

export type InvoiceLineInput = {
  description: string;
  quantity: number;
  rate: number;
  gstRate: number;
};

export type InvoiceLine = InvoiceLineInput & {
  taxable: number;
  gst: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
};

export type GstInvoiceInput = {
  sellerName: string;
  sellerGstin?: string;
  sellerAddress?: string;
  buyerName: string;
  buyerGstin?: string;
  buyerAddress?: string;
  invoiceNo: string;
  invoiceDate: string;
  /** Same state → CGST+SGST; else IGST */
  intraState: boolean;
  lines: InvoiceLineInput[];
  notes?: string;
};

export type GstInvoiceTotals = {
  lines: InvoiceLine[];
  taxable: number;
  gst: number;
  cgst: number;
  sgst: number;
  igst: number;
  grand: number;
  words: string;
};

export function buildGstInvoiceTotals(input: GstInvoiceInput): GstInvoiceTotals {
  const seller = input.sellerName.trim();
  const buyer = input.buyerName.trim();
  if (!seller || !buyer) {
    throw new Error("Enter seller and buyer names.");
  }
  if (!input.invoiceNo.trim()) {
    throw new Error("Enter an invoice number.");
  }
  if (!input.lines.length) {
    throw new Error("Add at least one line item.");
  }

  const lines: InvoiceLine[] = input.lines.map((line, index) => {
    const description = line.description.trim();
    if (!description) {
      throw new Error(`Line ${index + 1}: add a description.`);
    }
    if (!(line.quantity > 0) || !(line.rate >= 0)) {
      throw new Error(`Line ${index + 1}: quantity and rate must be valid.`);
    }
    if (line.gstRate < 0) {
      throw new Error(`Line ${index + 1}: GST rate must be valid.`);
    }
    const taxable = line.quantity * line.rate;
    const split = calculateGst(taxable, line.gstRate, false);
    const gst = split.gst;
    return {
      ...line,
      description,
      taxable,
      gst,
      cgst: input.intraState ? gst / 2 : 0,
      sgst: input.intraState ? gst / 2 : 0,
      igst: input.intraState ? 0 : gst,
      total: split.total,
    };
  });

  const taxable = lines.reduce((sum, line) => sum + line.taxable, 0);
  const gst = lines.reduce((sum, line) => sum + line.gst, 0);
  const cgst = lines.reduce((sum, line) => sum + line.cgst, 0);
  const sgst = lines.reduce((sum, line) => sum + line.sgst, 0);
  const igst = lines.reduce((sum, line) => sum + line.igst, 0);
  const grand = lines.reduce((sum, line) => sum + line.total, 0);

  return {
    lines,
    taxable,
    gst,
    cgst,
    sgst,
    igst,
    grand,
    words: amountInWordsInr(grand),
  };
}

function inr(n: number): string {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function buildGstInvoicePdf(
  input: GstInvoiceInput,
): Promise<Uint8Array> {
  const totals = buildGstInvoiceTotals(input);
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const margin = 40;
  let y = page.getHeight() - margin;
  const width = page.getWidth() - margin * 2;
  const ink = rgb(0.1, 0.1, 0.1);
  const muted = rgb(0.35, 0.35, 0.35);

  function draw(text: string, size: number, useBold = false, color = ink) {
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: useBold ? bold : font,
      color,
    });
    y -= size + 4;
  }

  function drawRight(text: string, size: number, useBold = false) {
    const face = useBold ? bold : font;
    const tw = face.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: page.getWidth() - margin - tw,
      y,
      size,
      font: face,
      color: ink,
    });
  }

  draw("TAX INVOICE / ESTIMATE", 16, true);
  draw(`Invoice No: ${input.invoiceNo.trim()}`, 10);
  draw(`Date: ${input.invoiceDate}`, 10);
  y -= 6;

  draw("Seller", 11, true);
  draw(input.sellerName.trim(), 10);
  if (input.sellerGstin?.trim()) {
    draw(`GSTIN: ${input.sellerGstin.trim().toUpperCase()}`, 9, false, muted);
  }
  if (input.sellerAddress?.trim()) {
    draw(input.sellerAddress.trim(), 9, false, muted);
  }
  y -= 4;

  draw("Buyer", 11, true);
  draw(input.buyerName.trim(), 10);
  if (input.buyerGstin?.trim()) {
    draw(`GSTIN: ${input.buyerGstin.trim().toUpperCase()}`, 9, false, muted);
  }
  if (input.buyerAddress?.trim()) {
    draw(input.buyerAddress.trim(), 9, false, muted);
  }
  y -= 8;

  const colDesc = margin;
  const colQty = margin + width * 0.46;
  const colRate = margin + width * 0.56;
  const colTax = margin + width * 0.7;
  const colTotal = margin + width * 0.84;

  page.drawText("Item", { x: colDesc, y, size: 9, font: bold, color: ink });
  page.drawText("Qty", { x: colQty, y, size: 9, font: bold, color: ink });
  page.drawText("Rate", { x: colRate, y, size: 9, font: bold, color: ink });
  page.drawText("Taxable", { x: colTax, y, size: 9, font: bold, color: ink });
  page.drawText("Total", { x: colTotal, y, size: 9, font: bold, color: ink });
  y -= 14;

  for (const line of totals.lines) {
    if (y < 120) {
      break;
    }
    const desc =
      line.description.length > 36
        ? `${line.description.slice(0, 34)}…`
        : line.description;
    page.drawText(desc, { x: colDesc, y, size: 9, font, color: ink });
    page.drawText(String(line.quantity), {
      x: colQty,
      y,
      size: 9,
      font,
      color: ink,
    });
    page.drawText(inr(line.rate), { x: colRate, y, size: 9, font, color: ink });
    page.drawText(inr(line.taxable), { x: colTax, y, size: 9, font, color: ink });
    page.drawText(inr(line.total), { x: colTotal, y, size: 9, font, color: ink });
    y -= 12;
    page.drawText(
      input.intraState
        ? `GST ${line.gstRate}% (CGST/SGST ${inr(line.cgst)}/${inr(line.sgst)})`
        : `IGST ${line.gstRate}% (${inr(line.igst)})`,
      { x: colDesc, y, size: 8, font, color: muted },
    );
    y -= 14;
  }

  y -= 4;
  draw(`Taxable value: ₹${inr(totals.taxable)}`, 10);
  if (input.intraState) {
    draw(`CGST: ₹${inr(totals.cgst)}`, 10);
    draw(`SGST: ₹${inr(totals.sgst)}`, 10);
  } else {
    draw(`IGST: ₹${inr(totals.igst)}`, 10);
  }
  y -= 2;
  draw(`Grand total: ₹${inr(totals.grand)}`, 12, true);
  y -= 4;
  draw(totals.words, 9, false, muted);

  if (input.notes?.trim()) {
    y -= 8;
    draw("Notes", 10, true);
    draw(input.notes.trim(), 9, false, muted);
  }

  y = Math.min(y, 70);
  drawRight("Generated in browser · not a statutory e-invoice", 8);

  return doc.save({ useObjectStreams: true });
}
