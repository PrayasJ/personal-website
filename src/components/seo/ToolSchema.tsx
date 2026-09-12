import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, profile, SITE_URL } from "@/lib/site";
import {
  allToolFaqs,
  toolFeatures,
  toolHowToSteps,
  toolInLanguage,
  toolSoftwareCategory,
} from "@/lib/tool-seo";
import type { Tool } from "@/lib/tools";

export function ToolSchema({ tool }: { tool: Tool }) {
  const url = absoluteUrl(tool.path);
  const features = toolFeatures(tool);
  const steps = toolHowToSteps(tool);
  const faqs = allToolFaqs(tool);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": `${url}#webpage`,
            url,
            name: tool.title,
            description: tool.metaDescription,
            inLanguage: toolInLanguage(tool),
            isPartOf: { "@id": `${SITE_URL}/#website` },
            about: { "@id": `${url}#app` },
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: `${url}/opengraph-image`,
            },
          },
          {
            "@type": ["WebApplication", "SoftwareApplication"],
            "@id": `${url}#app`,
            name: tool.name,
            url,
            applicationCategory: toolSoftwareCategory(tool),
            operatingSystem: "Any",
            browserRequirements: "Requires a modern web browser with JavaScript.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "INR",
            },
            description: tool.metaDescription,
            featureList: features,
            keywords: tool.keywords.join(", "),
            publisher: {
              "@type": "Person",
              name: profile.name,
              url: SITE_URL,
            },
            isAccessibleForFree: true,
            countriesSupported:
              tool.category === "calculator" ||
              tool.category === "student" ||
              tool.category === "photo" ||
              tool.category === "qr"
                ? "IN"
                : undefined,
          },
          {
            "@type": "HowTo",
            "@id": `${url}#howto`,
            name: `How to use ${tool.name}`,
            description: tool.intro,
            inLanguage: toolInLanguage(tool),
            step: steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.name,
              text: step.text,
            })),
          },
          ...(faqs.length > 0
            ? [
                {
                  "@type": "FAQPage",
                  "@id": `${url}#faq`,
                  mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: faq.answer,
                    },
                  })),
                },
              ]
            : []),
        ],
      }}
    />
  );
}
