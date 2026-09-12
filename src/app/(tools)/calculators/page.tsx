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
  title: "Free Calculators India — EMI, SIP, CTC, In-hand, GST",
  description:
    "Free India-focused calculators for EMI, SIP, CTC, in-hand salary, GST, PPF, and FD. Clear assumptions, INR, no signup. Not financial advice.",
  path: "/calculators",
  absoluteTitle: true,
  locale: "en_IN",
  keywords: [
    "EMI calculator India",
    "SIP calculator",
    "in-hand salary calculator",
    "CTC calculator",
    "GST calculator",
  ],
});

export default function CalculatorsPage() {
  const items = getToolsByCategory("calculator");

  return (
    <>
      <ItemListSchema
        name="India calculators"
        description={categories.calculator.description}
        path="/calculators"
        items={items.map((tool) => ({
          name: tool.name,
          path: tool.path,
          description: tool.description,
        }))}
      />
      <PageHeader
        title="Calculators"
        description={categories.calculator.description}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
        ]}
      />
      <Container className="pb-20">
        <div className="tool-index-kicker">
          <h2>India · INR</h2>
          <span className="tool-index-rule" aria-hidden />
          <span className="chip">{items.length}</span>
        </div>
        <p className="tool-index-blurb">
          Textbook formulas, not a bank quote or Form 16. CTC and in-hand sit
          next to EMI, SIP, PPF, GST, and gratuity.
        </p>
        <div className="mt-4">
          <ToolGrid tools={items} />
        </div>
        <AdSlot placement="index" />
        <p className="mt-10 text-sm leading-7 text-muted">
          See also the{" "}
          <Link href="/tools" className="text-ink underline">
            developer tools
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
