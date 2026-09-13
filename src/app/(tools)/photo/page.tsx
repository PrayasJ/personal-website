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
  title: "Free Photo Tools Online — Compress to KB, Passport, Signature",
  description:
    "Compress photos to 50/100/200 KB, make common passport sizes, and resize signatures in your browser. No upload.",
  path: "/photo",
  absoluteTitle: true,
  keywords: [
    "compress image to 50kb",
    "passport photo maker",
    "signature resizer",
    "compress photo online",
  ],
});

export default function PhotoToolsPage() {
  const photo = getToolsByCategory("photo").map(toToolListItem);
  const image = getToolsByCategory("image").map(toToolListItem);

  return (
    <>
      <ItemListSchema
        name="Photo tools"
        description={categories.photo.description}
        path="/photo"
        items={[...photo, ...image].map((tool) => ({
          name: tool.name,
          path: tool.path,
          description: tool.description,
        }))}
      />
      <PageHeader
        title="Photo Tools"
        description={categories.photo.description}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Photo", path: "/photo" },
        ]}
      />
      <Container className="pb-20">
        <div className="tool-index-kicker">
          <h2>Target size & forms</h2>
          <span className="tool-index-rule" aria-hidden />
          <span className="chip">{photo.length}</span>
        </div>
        <p className="tool-index-blurb">{categories.photo.blurb}</p>
        <div className="mt-4">
          <ToolGrid tools={photo} />
        </div>
        <AdSlot placement="index" />
        {image.length > 0 ? (
          <>
            <div className="tool-index-kicker mt-14">
              <h2>Also: image tools</h2>
              <span className="tool-index-rule" aria-hidden />
              <span className="chip">{image.length}</span>
            </div>
            <p className="tool-index-blurb">{categories.image.blurb}</p>
            <div className="mt-4">
              <ToolGrid tools={image} hideEmpty />
            </div>
          </>
        ) : null}
        <p className="mt-10 text-sm leading-7 text-muted">
          Need pages from photos?{" "}
          <Link href="/pdf/images-to-pdf" className="text-ink underline">
            Images to PDF
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
