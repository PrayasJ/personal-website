import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME, SITE_URL, staticPages } from "@/lib/site";
import { getIndexableToolPaths, type Tool } from "@/lib/tools";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const resolvedTitle = absoluteTitle
    ? { absolute: title }
    : title;

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function toolMetadata(tool: Tool): Metadata {
  return pageMetadata({
    title: tool.title,
    description: tool.metaDescription,
    path: tool.path,
    absoluteTitle: true,
  });
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

  const toolPages = getIndexableToolPaths().map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const extra = [
    {
      url: absoluteUrl("/resume.pdf"),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  const urls = new Set<string>();
  return [...pages, ...toolPages, ...extra].filter((entry) => {
    if (urls.has(entry.url)) {
      return false;
    }
    urls.add(entry.url);
    return true;
  });
}

export { SITE_URL };
