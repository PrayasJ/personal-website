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
  title: "Free Student Tools — CGPA to Percentage, Attendance",
  description:
    "CGPA to percentage and attendance calculators for school and college. Browser-only, no signup.",
  path: "/student",
  absoluteTitle: true,
  keywords: [
    "cgpa to percentage",
    "attendance calculator",
    "student tools online",
  ],
});

export default function StudentToolsPage() {
  const items = getToolsByCategory("student");

  return (
    <>
      <ItemListSchema
        name="Student tools"
        description={categories.student.description}
        path="/student"
        items={items.map((tool) => ({
          name: tool.name,
          path: tool.path,
          description: tool.description,
        }))}
      />
      <PageHeader
        title="Student Tools"
        description={categories.student.description}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Student", path: "/student" },
        ]}
      />
      <Container className="pb-20">
        <div className="tool-index-kicker">
          <h2>School & college</h2>
          <span className="tool-index-rule" aria-hidden />
          <span className="chip">{items.length}</span>
        </div>
        <p className="tool-index-blurb">{categories.student.blurb}</p>
        <div className="mt-4">
          <ToolGrid tools={items} />
        </div>
        <AdSlot placement="index" />
        <p className="mt-10 text-sm leading-7 text-muted">
          Need age from DOB?{" "}
          <Link href="/calculators/age-calculator" className="text-ink underline">
            Age calculator
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
