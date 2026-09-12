import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { getGuideBySlug, guides } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import { getToolBySlug } from "@/lib/tools";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return {};
  }
  return pageMetadata({
    title: guide.title,
    description: guide.metaDescription,
    path: guide.path,
    absoluteTitle: true,
    keywords: [guide.h1, ...guide.relatedTools],
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    notFound();
  }

  const related = guide.relatedTools
    .map((toolSlug) => getToolBySlug(toolSlug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));
  const url = absoluteUrl(guide.path);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: guide.h1,
          description: guide.metaDescription,
          url,
          mainEntityOfPage: url,
          inLanguage: "en",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          author: { "@id": `${SITE_URL}/#person` },
        }}
      />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { name: "Index", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.h1, path: guide.path },
          ]}
        />
        <article className="tool-docs" style={{ marginTop: 0, borderTop: "none", paddingTop: 0 }}>
          <p className="tape mb-4">guide</p>
          <h1 className="tool-hero-title text-gradient">{guide.h1}</h1>
          <p className="tool-hero-lead">{guide.description}</p>
          {guide.sections.map((section) => (
            <section key={section.title} className="tool-docs">
              <h2 className="tool-docs-title">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="tool-docs-copy">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
          {related.length > 0 ? (
            <section className="tool-docs">
              <h2 className="tool-docs-title">Related tools</h2>
              <ul className="tool-guide-links">
                {related.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={tool.path}>{tool.name}</Link>
                    <span> — {tool.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </Container>
    </>
  );
}
