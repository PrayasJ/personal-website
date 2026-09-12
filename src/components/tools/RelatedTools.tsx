import { getRelatedTools } from "@/lib/tools";
import { ToolCard } from "@/components/tools/ToolCard";

export function RelatedTools({ slug }: { slug: string }) {
  const related = getRelatedTools(slug);
  if (related.length === 0) {
    return null;
  }

  return (
    <section className="tool-related">
      <h2 className="tool-docs-title">Related tools</h2>
      <ul className="tool-grid mt-5">
        {related.map((tool, index) => (
          <li key={tool.slug}>
            <ToolCard tool={tool} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
}
