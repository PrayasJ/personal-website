/** Digits-only E.164 without +. Default India when local 10-digit mobile. */
export function normalizeWhatsAppPhone(
  phone: string,
  defaultCountry = "91",
): string {
  let digits = phone.replace(/\D/g, "");
  if (!digits) {
    throw new Error("Enter a phone number.");
  }
  if (digits.length === 10 && defaultCountry) {
    digits = `${defaultCountry}${digits}`;
  }
  if (digits.length < 8 || digits.length > 15) {
    throw new Error("Phone looks invalid. Use country code + number.");
  }
  return digits;
}

export function buildWhatsAppLink(
  phone: string,
  message = "",
  defaultCountry = "91",
): string {
  const digits = normalizeWhatsAppPhone(phone, defaultCountry);
  const text = message.trim();
  const base = `https://wa.me/${digits}`;
  if (!text) {
    return base;
  }
  return `${base}?text=${encodeURIComponent(text)}`;
}
