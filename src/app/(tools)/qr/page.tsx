import { categories } from "@/lib/site";
import { getToolsByCategory } from "@/lib/tools";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@/components/ads/AdSlot";
import { ItemListSchema } from "@/components/seo/ItemListSchema";

export const metadata = pageMetadata({
  title: "Free QR Code Generator — URL, Text, UPI PNG",
  description:
    "Generate QR codes for URLs, text, and UPI payment strings in your browser. Download PNG. No upload.",
  path: "/qr",
  absoluteTitle: true,
  keywords: ["qr code generator", "upi qr code", "create qr online"],
});

export default function QrToolsPage() {
  const items = getToolsByCategory("qr");

  return (
    <>
      <ItemListSchema
        name="QR tools"
        description={categories.qr.description}
        path="/qr"
        items={items.map((tool) => ({
          name: tool.name,
          path: tool.path,
          description: tool.description,
        }))}
      />
      <PageHeader
        title="QR Tools"
        description={categories.qr.description}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "QR", path: "/qr" },
        ]}
      />
      <Container className="pb-20">
        <div className="tool-index-kicker">
          <h2>Encode</h2>
          <span className="tool-index-rule" aria-hidden />
          <span className="chip">{items.length}</span>
        </div>
        <p className="tool-index-blurb">{categories.qr.blurb}</p>
        <div className="mt-4">
          <ToolGrid tools={items} />
        </div>
        <AdSlot placement="index" />
      </Container>
    </>
  );
}
