import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, profile, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export function PersonSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: profile.name,
        url: SITE_URL,
        email: profile.email,
        jobTitle: "Backend Engineer",
        description: profile.shortBio,
        worksFor: {
          "@type": "Organization",
          name: "Nubra",
        },
        sameAs: [profile.github, profile.linkedin],
      }}
    />
  );
}

export function SiteGraphSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_TAGLINE,
            inLanguage: ["en", "en-IN"],
            publisher: { "@id": `${SITE_URL}/#person` },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: absoluteUrl("/tools?q={search_term_string}"),
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: profile.name,
            url: SITE_URL,
            jobTitle: "Backend Engineer",
            description: profile.shortBio,
            worksFor: { "@type": "Organization", name: "Nubra" },
            sameAs: [profile.github, profile.linkedin],
          },
        ],
      }}
    />
  );
}
