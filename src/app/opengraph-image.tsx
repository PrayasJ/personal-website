import { defaultOgImage, ogContentType, ogSize } from "@/components/seo/og-image";

export const alt = "Prayas Jain — backend engineer and free browser tools";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return defaultOgImage();
}
