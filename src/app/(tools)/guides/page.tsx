import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ItemListSchema } from "@/components/seo/ItemListSchema";
import { pageMetadata } from "@/lib/seo";
import { guides } from "@/lib/guides";

export const metadata = pageMetadata({
  title: "Guides — JSON, JWT, PDF, EMI, Cron",
  description:
    "Short guides behind the free browser tools: how to format JSON, read a JWT, merge PDFs without uploading, and calculate EMI in India.",
  path: "/guides",
  keywords: [
    "JSON formatter guide",
    "JWT decoder",
    "merge PDF no upload",
    "EMI calculator India",
  ],
});

export default function GuidesPage() {
  return (
    <>
      <ItemListSchema
        name="Guides"
        description="Short explanations behind the tools on Prayas.dev."
        path="/guides"
        items={guides.map((guide) => ({
          name: guide.h1,
          path: guide.path,
          description: guide.description,
        }))}
      />
      <PageHeader
        title="Guides"
        description="Short notes on the formats and formulas behind the tools. Written to be useful first — they also happen to be the long-tail pages search engines like."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ]}
      />
      <Container className="pb-16">
        <ul className="tool-guide-index">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link href={guide.path} className="tool-guide-index-link">
                <span className="tool-guide-index-title">{guide.h1}</span>
                <span className="tool-guide-index-copy">{guide.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
