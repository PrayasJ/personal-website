import { guideOgImage, ogContentType, ogSize } from "@/components/seo/og-image";

export const alt = "Guide on prayas.dev";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return guideOgImage(slug);
}
