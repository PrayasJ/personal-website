import Link from "next/link";
import { getGuidesForTool } from "@/lib/guides";

export function RelatedGuides({ slug }: { slug: string }) {
  const related = getGuidesForTool(slug);
  if (related.length === 0) {
    return null;
  }

  return (
    <section className="tool-docs">
      <h2 className="tool-docs-title">Guides</h2>
      <ul className="tool-guide-links">
        {related.map((guide) => (
          <li key={guide.slug}>
            <Link href={guide.path}>{guide.h1}</Link>
            <span> — {guide.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
