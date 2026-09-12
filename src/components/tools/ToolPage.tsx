import { ToolSchema } from "@/components/seo/schemas";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { RelatedGuides } from "@/components/tools/RelatedGuides";
import { ToolInterface } from "@/components/tools/ToolInterface";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { ToolGlyph } from "@/components/tools/ToolGlyph";
import { CopyButton } from "@/components/tools/CopyButton";
import { CodeHighlight } from "@/components/tools/CodeHighlight";
import { Container } from "@/components/layout/Container";
import { categories } from "@/lib/site";
import { allToolFaqs, toolFeatures, toolHowToSteps } from "@/lib/tool-seo";
import type { Tool } from "@/lib/tools";
import type { HighlightLang } from "@/lib/highlight";
import { AdSlot } from "@/components/ads/AdSlot";

function exampleLang(code: string): HighlightLang {
  const trimmed = code.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return "json";
  }
  if (trimmed.startsWith("type ") || trimmed.includes(" struct {")) {
    return "go";
  }
  if (trimmed.includes("export interface") || trimmed.includes("export type ")) {
    return "ts";
  }
  if (trimmed.includes("eyJ")) {
    return "jwt";
  }
  return "plain";
}

export function ToolPage({ tool }: { tool: Tool }) {
  const category = categories[tool.category];
  const steps = toolHowToSteps(tool);
  const features = toolFeatures(tool);
  const faqs = allToolFaqs(tool);

  return (
    <>
      <ToolSchema tool={tool} />
      <Container size="wide" className="py-8 sm:py-12">
        <div className="tool-desk" data-category={tool.category}>
          <Breadcrumbs
            items={[
              { name: "Index", path: "/" },
              { name: category.name, path: category.path },
              { name: tool.name, path: tool.path },
            ]}
          />
          <header className="tool-hero">
            <div className="tool-hero-icon" aria-hidden>
              <ToolGlyph slug={tool.slug} />
            </div>
            <div className="tool-hero-copy">
              <div className="tool-hero-meta">
                <p className="tape">{category.name}</p>
                <span className="chip is-live">browser only</span>
                {tool.popular ? <span className="chip">popular</span> : null}
              </div>
              <h1 className="tool-hero-title text-gradient">{tool.h1}</h1>
              <p className="tool-hero-lead">{tool.intro}</p>
              <ul className="tool-feature-row">
                {features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </header>

          <div className="tool-stage">
            <ToolInterface slug={tool.slug} />
          </div>

          <AdSlot placement="top" />

          <AdSlot placement="mid" />

          <div className="tool-after">
            <div className="tool-after-main">
              <section className="tool-docs">
                <h2 className="tool-docs-title">How to use {tool.name}</h2>
                <ol className="tool-howto">
                  {steps.map((step, index) => (
                    <li key={step.name}>
                      <span className="tool-howto-n">{index + 1}</span>
                      <div>
                        <p className="tool-howto-name">{step.name}</p>
                        <p className="tool-howto-text">{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {tool.sections.map((section) => (
                <section key={section.title} className="tool-docs">
                  <h2 className="tool-docs-title">{section.title}</h2>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index} className="tool-docs-copy">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}

              {tool.examples.length > 0 ? (
                <section className="tool-docs">
                  <h2 className="tool-docs-title">Examples</h2>
                  <div className="tool-examples">
                    {tool.examples.map((example) => (
                      <figure key={example.title} className="tool-example">
                        <figcaption className="tool-example-head">
                          <span>{example.title}</span>
                          <CopyButton value={example.code} />
                        </figcaption>
                        <pre className="tool-example-code">
                          <CodeHighlight code={example.code} lang={exampleLang(example.code)} />
                        </pre>
                        {example.note ? (
                          <p className="tool-example-note">{example.note}</p>
                        ) : null}
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}

              <ToolFaq faqs={faqs} />
              <RelatedGuides slug={tool.slug} />
            </div>
            <AdSlot placement="rail" />
          </div>

          <AdSlot placement="foot" />
          <RelatedTools slug={tool.slug} />
        </div>
      </Container>
    </>
  );
}
