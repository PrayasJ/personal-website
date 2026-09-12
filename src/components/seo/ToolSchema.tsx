import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import type { Tool } from "@/lib/tools";

export function ToolSchema({ tool }: { tool: Tool }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: tool.name,
        url: absoluteUrl(tool.path),
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: tool.metaDescription,
        publisher: {
          "@type": "Person",
          name: SITE_NAME,
          url: absoluteUrl("/"),
        },
        isAccessibleForFree: true,
        browserRequirements: "Requires a modern web browser with JavaScript.",
      }}
    />
  );
}
