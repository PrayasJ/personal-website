import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_TAGLINE,
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: absoluteUrl("/tools?q={search_term_string}"),
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
