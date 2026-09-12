import Link from "next/link";
import { categories } from "@/lib/site";
import { getToolsByCategory } from "@/lib/tools";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@/components/ads/AdSlot";
import { ItemListSchema } from "@/components/seo/ItemListSchema";

export const metadata = pageMetadata({
  title: "Free PDF Tools Online — Merge, Split, Compress to KB, No Upload",
  description:
    "Merge, split, compress PDF to 200KB/500KB/1MB, rotate, and convert pages to images in your browser. Files stay on your device.",
  path: "/pdf",
  absoluteTitle: true,
  keywords: [
    "merge pdf",
    "compress pdf to 200kb",
    "compress pdf",
    "pdf to png",
    "pdf tools",
  ],
});

export default function PdfToolsPage() {
  const items = getToolsByCategory("pdf");

  return (
    <>
      <ItemListSchema
        name="PDF tools"
        description={categories.pdf.description}
        path="/pdf"
        items={items.map((tool) => ({
          name: tool.name,
          path: tool.path,
          description: tool.description,
        }))}
      />
      <PageHeader
        title="PDF Tools"
        description={categories.pdf.description}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "PDF", path: "/pdf" },
        ]}
      />
      <Container className="pb-20">
        <div className="tool-index-kicker">
          <h2>Local files</h2>
          <span className="tool-index-rule" aria-hidden />
          <span className="chip">{items.length}</span>
        </div>
        <p className="tool-index-blurb">{categories.pdf.blurb}</p>
        <div className="mt-4">
          <ToolGrid tools={items} />
        </div>
        <AdSlot placement="index" />
        <p className="mt-10 text-sm leading-7 text-muted">
          Compress rasterizes pages. See also{" "}
          <Link href="/image" className="text-ink underline">
            image tools
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
