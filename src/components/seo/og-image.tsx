import { ImageResponse } from "next/og";
import { getGuideBySlug } from "@/lib/guides";
import { SITE_NAME, SITE_TAGLINE, categories } from "@/lib/site";
import { getToolBySlug } from "@/lib/tools";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const frame = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
  background: "#050816",
  padding: "64px 72px",
  color: "#f4f6fb",
};

function OgLayout({
  kicker,
  title,
  lead,
  foot = "no upload · no account",
}: {
  kicker: string;
  title: string;
  lead: string;
  foot?: string;
}) {
  return (
    <div style={frame}>
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#8b9cff",
        }}
      >
        {kicker}
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1040 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 42 ? 56 : 68,
            fontWeight: 700,
            lineHeight: 1.08,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 26,
            lineHeight: 1.35,
            color: "#9aa3b8",
          }}
        >
          {lead}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: "#34d399",
        }}
      >
        <span>prayas.dev</span>
        <span>{foot}</span>
      </div>
    </div>
  );
}

export function defaultOgImage() {
  return new ImageResponse(
    (
      <OgLayout
        kicker={`${SITE_NAME} · portfolio`}
        title="Prayas Jain"
        lead={SITE_TAGLINE}
        foot="OMS · Go · browser tools"
      />
    ),
    { ...ogSize },
  );
}

export function toolOgImage(slug: string) {
  const tool = getToolBySlug(slug);
  if (!tool) {
    return defaultOgImage();
  }
  const kicker = `${categories[tool.category].name} · browser only`;
  return new ImageResponse(
    (
      <OgLayout
        kicker={kicker}
        title={tool.name}
        lead={tool.description}
        foot={tool.localProcessing ? "runs locally · free" : "free"}
      />
    ),
    { ...ogSize },
  );
}

export function guideOgImage(slug: string) {
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return defaultOgImage();
  }
  return new ImageResponse(
    (
      <OgLayout
        kicker="Guide · prayas.dev"
        title={guide.h1}
        lead={guide.description}
        foot="free browser tools"
      />
    ),
    { ...ogSize },
  );
}

export function hubOgImage(hub: "tools" | "pdf" | "image" | "calculators" | "guides") {
  const copy = {
    tools: {
      title: "Developer tools",
      lead: "JSON, JWT, Base64, UUID, cron, regex — in the browser, no upload.",
    },
    pdf: {
      title: "PDF tools",
      lead: "Merge, split, compress, rotate, and render pages locally.",
    },
    image: {
      title: "Image tools",
      lead: "Compress, resize, convert, crop, and favicons in this tab.",
    },
    calculators: {
      title: "India calculators",
      lead: "EMI, SIP, CTC, in-hand, GST — textbook formulas, INR.",
    },
    guides: {
      title: "Guides",
      lead: "Short notes behind the tools: JSON, JWTs, cron, EMI, PDFs.",
    },
  }[hub];
  return new ImageResponse(
    <OgLayout kicker="prayas.dev" title={copy.title} lead={copy.lead} />,
    { ...ogSize },
  );
}
