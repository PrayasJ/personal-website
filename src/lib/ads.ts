export type AdPlacement = "top" | "mid" | "rail" | "foot" | "index";

export type AdFormat = "auto" | "horizontal" | "vertical" | "rectangle";

const DEFAULT_CLIENT = "ca-pub-8260428078613990";
const DEFAULT_SLOT = "1299303010";
const GOOGLE_CERTIFIED_ACCOUNT = "f08c47fec0942fa0";

const slotKeys: Record<AdPlacement, string> = {
  top: "NEXT_PUBLIC_ADSENSE_SLOT_TOP",
  mid: "NEXT_PUBLIC_ADSENSE_SLOT_MID",
  rail: "NEXT_PUBLIC_ADSENSE_SLOT_RAIL",
  foot: "NEXT_PUBLIC_ADSENSE_SLOT_FOOT",
  index: "NEXT_PUBLIC_ADSENSE_SLOT_INDEX",
};

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export function adsenseClient(): string {
  const fromEnv = readEnv("NEXT_PUBLIC_ADSENSE_CLIENT");
  return fromEnv.startsWith("ca-pub-") ? fromEnv : DEFAULT_CLIENT;
}

export function adsTxtBody(): string {
  return `google.com, ${adsenseClient().replace(/^ca-/, "")}, DIRECT, ${GOOGLE_CERTIFIED_ACCOUNT}\n`;
}

export function adsenseSlot(placement: AdPlacement): string {
  return (
    readEnv(slotKeys[placement]) ||
    readEnv("NEXT_PUBLIC_ADSENSE_SLOT") ||
    DEFAULT_SLOT
  );
}

export function adsEnabled(): boolean {
  return adsenseClient().startsWith("ca-pub-");
}

export function adFormat(placement: AdPlacement): AdFormat {
  if (placement === "top" || placement === "foot") {
    return "horizontal";
  }
  if (placement === "rail") {
    return "vertical";
  }
  return "auto";
}
