export type AdPlacement = "top" | "mid" | "rail" | "foot" | "index";

export type AdFormat = "auto" | "horizontal" | "vertical" | "rectangle";

const slotEnv: Record<AdPlacement, string | undefined> = {
  top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP,
  mid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID,
  rail: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL,
  foot: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOT,
  index: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INDEX,
};

const ADSENSE_PUBLISHER = "pub-8260428078613990";
const GOOGLE_CERTIFIED_ACCOUNT = "f08c47fec0942fa0";

export function adsenseClient(): string {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
}

export function adsTxtBody(): string {
  const fromEnv = adsenseClient().replace(/^ca-/, "");
  const publisher = fromEnv.startsWith("pub-") ? fromEnv : ADSENSE_PUBLISHER;
  return `google.com, ${publisher}, DIRECT, ${GOOGLE_CERTIFIED_ACCOUNT}\n`;
}

export function adsenseSlot(placement: AdPlacement): string {
  return slotEnv[placement]?.trim() ?? "";
}

export function adsEnabled(): boolean {
  return adsenseClient().startsWith("ca-pub-");
}

export function showAdPlaceholders(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function adFormat(placement: AdPlacement): AdFormat {
  if (placement === "top" || placement === "foot") {
    return "horizontal";
  }
  if (placement === "rail") {
    return "vertical";
  }
  if (placement === "mid") {
    return "rectangle";
  }
  return "auto";
}
