import { hubOgImage, ogContentType, ogSize } from "@/components/seo/og-image";

export const alt = "Free PDF tools on prayas.dev — no upload";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return hubOgImage("pdf");
}
