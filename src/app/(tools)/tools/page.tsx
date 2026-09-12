import { categories } from "@/lib/site";
import { getToolsByCategory } from "@/lib/tools";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@/components/ads/AdSlot";
import { ItemListSchema } from "@/components/seo/ItemListSchema";

export const metadata = pageMetadata({
  title: "Free Developer Tools Online — JSON, JWT, UUID, Cron",
  description:
    "Free browser tools: JSON formatter, JWT decoder, Base64, UUID, cron, regex, hashes, and more. No signup, no upload — processing stays in this tab.",
  path: "/tools",
  absoluteTitle: true,
  keywords: [
    "developer tools",
    "JSON formatter",
    "JWT decoder",
    "Base64",
    "UUID generator",
    "cron generator",
  ],
});

export default function ToolsIndexPage() {
  const developer = getToolsByCategory("developer");
  const calculators = getToolsByCategory("calculator");
  const pdf = getToolsByCategory("pdf");
  const image = getToolsByCategory("image");

  return (
    <>
      <ItemListSchema
        name="Developer tools"
        description={categories.developer.description}
        path="/tools"
        items={[...developer, ...calculators, ...pdf, ...image].map((tool) => ({
          name: tool.name,
          path: tool.path,
          description: tool.description,
        }))}
      />
      <PageHeader
        title="Tools"
        description={`${categories.developer.description} ${categories.calculator.blurb}`}
        crumbs={[
          { name: "Index", path: "/" },
          { name: "Tools", path: "/tools" },
        ]}
      />
      <Container className="pb-20">
        <div className="tool-index-kicker">
          <h2>Developer</h2>
          <span className="tool-index-rule" aria-hidden />
          <span className="chip">{developer.length}</span>
        </div>
        <p className="tool-index-blurb">{categories.developer.blurb}</p>
        <div className="mt-4">
          <ToolGrid tools={developer} hideEmpty />
        </div>
        <AdSlot placement="index" />
        {calculators.length > 0 ? (
          <>
            <div className="tool-index-kicker mt-14">
              <h2>Calculators</h2>
              <span className="tool-index-rule" aria-hidden />
              <span className="chip">{calculators.length}</span>
            </div>
            <p className="tool-index-blurb">{categories.calculator.blurb}</p>
            <div className="mt-4">
              <ToolGrid tools={calculators} hideEmpty />
            </div>
          </>
        ) : null}
        {pdf.length > 0 ? (
          <>
            <div className="tool-index-kicker mt-14">
              <h2>PDF</h2>
              <span className="tool-index-rule" aria-hidden />
              <span className="chip">{pdf.length}</span>
            </div>
            <p className="tool-index-blurb">{categories.pdf.blurb}</p>
            <div className="mt-4">
              <ToolGrid tools={pdf} hideEmpty />
            </div>
          </>
        ) : null}
        {image.length > 0 ? (
          <>
            <div className="tool-index-kicker mt-14">
              <h2>Image</h2>
              <span className="tool-index-rule" aria-hidden />
              <span className="chip">{image.length}</span>
            </div>
            <p className="tool-index-blurb">{categories.image.blurb}</p>
            <div className="mt-4">
              <ToolGrid tools={image} hideEmpty />
            </div>
          </>
        ) : null}
        <AdSlot placement="foot" />
      </Container>
    </>
  );
}
