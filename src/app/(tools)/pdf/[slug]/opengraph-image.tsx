import { ogContentType, ogSize, toolOgImage } from "@/components/seo/og-image";

export const alt = "Free PDF tool on prayas.dev — files stay in the browser";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return toolOgImage(slug);
}
