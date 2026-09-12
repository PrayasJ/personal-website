import { NextResponse } from "next/server";
import { guides } from "@/lib/guides";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  absoluteUrl,
  categories,
  profile,
} from "@/lib/site";
import { tools } from "@/lib/tools";

export const dynamic = "force-static";

export function GET() {
  const toolLines = tools
    .map((tool) => `- [${tool.name}](${absoluteUrl(tool.path)}): ${tool.description}`)
    .join("\n");
  const guideLines = guides
    .map((guide) => `- [${guide.h1}](${absoluteUrl(guide.path)}): ${guide.description}`)
    .join("\n");
  const hubLines = (
    Object.values(categories) as { name: string; path: string; description: string }[]
  )
    .map((hub) => `- [${hub.name}](${absoluteUrl(hub.path)}): ${hub.description}`)
    .join("\n");

  const body = `# ${SITE_NAME}

> ${SITE_TAGLINE}

The site is ${profile.name}'s portfolio plus free browser-only tools. Processing stays in the tab: no accounts, no upload API, no paid third-party APIs.

Canonical site: ${SITE_URL}

## Hubs

${hubLines}

## Tools

${toolLines}

## Guides

${guideLines}

## Optional

- [Privacy](${absoluteUrl("/privacy")})
- [Contact](${absoluteUrl("/contact")})
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
