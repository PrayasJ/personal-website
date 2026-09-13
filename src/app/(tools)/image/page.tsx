import Link from "next/link";
import { categories } from "@/lib/site";
import { getToolsByCategory, toToolListItem } from "@/lib/tools";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@/components/ads/AdSlot";
import { ItemListSchema } from "@/components/seo/ItemListSchema";

export const metadata = pageMetadata({
  title: "Free Image Tools Online — Compress, Resize, Convert, Crop",
  description:
    "Compress, resize, convert, and crop PNG, JPEG, and WebP in your browser. Favicon generator included. No upload.",
  path: "/image",
  absoluteTitle: true,
  keywords: [
    "compress image",
    "resize image",
    "png to jpg",
    "favicon generator",
    "webp converter",
  ],
});

export default function ImageToolsPage() {
  const items = getToolsByCategory("image").map(toToolListItem);

  return (
    <>
      <ItemListSchema
        name="Image tools"
        description={categories.image.description}
        path="/image"
        items={items.map((tool) => ({
          name: tool.name,
          path: tool.path,
          description: tool.description,
        }))}
      />
      <PageHeader
        title="Image Tools"
        description={categories.image.description}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Image", path: "/image" },
        ]}
      />
      <Container className="pb-20">
        <div className="tool-index-kicker">
          <h2>Canvas</h2>
          <span className="tool-index-rule" aria-hidden />
          <span className="chip">{items.length}</span>
        </div>
        <p className="tool-index-blurb">{categories.image.blurb}</p>
        <div className="mt-4">
          <ToolGrid tools={items} />
        </div>
        <AdSlot placement="index" />
        <p className="mt-10 text-sm leading-7 text-muted">
          Need pages from a document?{" "}
          <Link href="/pdf" className="text-ink underline">
            PDF tools
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
