import type { Metadata } from "next";
import { getIndexableGuidePaths } from "@/lib/guides";
import { absoluteUrl, SITE_NAME, SITE_URL, staticPages } from "@/lib/site";
import { toolInLanguage, toolMetaKeywords } from "@/lib/tool-seo";
import { getIndexableToolPaths, getToolByPath, type Tool } from "@/lib/tools";

const indexRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  keywords?: string[];
  locale?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  keywords,
  locale = "en_US",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const resolvedTitle = absoluteTitle ? { absolute: title } : title;

  return {
    title: resolvedTitle,
    description,
    keywords,
    robots: indexRobots,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function toolMetadata(tool: Tool): Metadata {
  return {
    ...pageMetadata({
      title: tool.title,
      description: tool.metaDescription,
      path: tool.path,
      absoluteTitle: true,
      keywords: toolMetaKeywords(tool),
      locale: toolInLanguage(tool) === "en-IN" ? "en_IN" : "en_US",
    }),
    category: tool.category,
    applicationName: tool.name,
  };
}

export function getSitemapEntries(): {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}[] {
  const now = new Date();
  const pages = staticPages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const toolPages = getIndexableToolPaths().map((path) => {
    const tool = getToolByPath(path);
    return {
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: tool?.popular ? 0.9 : 0.8,
    };
  });

  const guidePages = getIndexableGuidePaths().map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const extra = [
    {
      url: absoluteUrl("/resume.pdf"),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
  ];

  const urls = new Set<string>();
  return [...pages, ...toolPages, ...guidePages, ...extra].filter((entry) => {
    if (urls.has(entry.url)) {
      return false;
    }
    urls.add(entry.url);
    return true;
  });
}

export { SITE_URL };
