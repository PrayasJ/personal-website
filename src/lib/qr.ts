export type QrMode = "url" | "text" | "upi";

export type UpiFields = {
  vpa: string;
  name?: string;
  amount?: string;
  note?: string;
};

export function buildUpiPayload(fields: UpiFields): string {
  const pa = fields.vpa.trim();
  if (!pa) {
    throw new Error("Enter a UPI ID (VPA).");
  }
  const params = new URLSearchParams();
  params.set("pa", pa);
  const pn = fields.name?.trim();
  if (pn) {
    params.set("pn", pn);
  }
  const am = fields.amount?.trim();
  if (am) {
    const amount = Number(am);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Amount must be a non-negative number.");
    }
    params.set("am", amount.toFixed(2));
    params.set("cu", "INR");
  }
  const tn = fields.note?.trim();
  if (tn) {
    params.set("tn", tn);
  }
  return `upi://pay?${params.toString()}`;
}

export function buildQrPayload(
  mode: QrMode,
  text: string,
  upi: UpiFields,
): string {
  if (mode === "upi") {
    return buildUpiPayload(upi);
  }
  const value = text.trim();
  if (!value) {
    throw new Error(mode === "url" ? "Enter a URL." : "Enter text.");
  }
  return value;
}
