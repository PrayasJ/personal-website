import { hubOgImage, ogContentType, ogSize } from "@/components/seo/og-image";

export const alt = "Guides behind the tools on prayas.dev";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return hubOgImage("guides");
}
