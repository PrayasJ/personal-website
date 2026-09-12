import { notFound } from "next/navigation";
import { ToolPage } from "@/components/tools/ToolPage";
import { toolMetadata } from "@/lib/seo";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getToolsByCategory("qr").map((tool) => ({ slug: tool.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    return {};
  }
  return toolMetadata(tool);
}

export default async function QrToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }
  return <ToolPage tool={tool} />;
}
