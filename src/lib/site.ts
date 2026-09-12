export const SITE_NAME = "Prayas.dev";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://prayas.dev";
export const SITE_TAGLINE =
  "Backend engineer at Nubra. OMS, Go, RPC — plus a small set of free browser tools.";

export const profile = {
  name: "Prayas Jain",
  email: "prayas.jn24@gmail.com",
  emailHref: "mailto:prayas.jn24@gmail.com",
  github: "https://github.com/PrayasJ",
  linkedin: "https://www.linkedin.com/in/prayasj",
  shortBio:
    "Backend engineer at Nubra (Zanskar Research). I work on the order management system, and I keep a few browser tools on this site.",
};

export const navItems = [
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/#desk", label: "Desk" },
  { href: "/#projects", label: "Projects" },
  { href: "/#tools", label: "Tools" },
  { href: "/#writing", label: "Writing" },
] as const;

export const footerNavItems = [
  { href: "/", label: "Index" },
  { href: "/tools", label: "Tools" },
  { href: "/#writing", label: "Writing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;

export type ToolCategory = "developer" | "calculator" | "pdf" | "image";

export const categories: Record<
  ToolCategory,
  { name: string; path: string; description: string; blurb: string }
> = {
  developer: {
    name: "Developer Tools",
    path: "/tools",
    description:
      "Format JSON, decode JWTs, generate UUIDs, and other browser-based developer utilities.",
    blurb: "JSON, JWT, Base64, regex, cron, and more.",
  },
  calculator: {
    name: "Calculators",
    path: "/calculators",
    description:
      "India-focused salary, investment, and loan calculators with clear assumptions.",
    blurb: "CTC, in-hand, EMI, SIP, PF, and more.",
  },
  pdf: {
    name: "PDF Tools",
    path: "/pdf",
    description:
      "Merge, split, compress, and rotate PDFs in your browser when technically possible.",
    blurb: "Merge, split, compress, rotate — files stay local.",
  },
  image: {
    name: "Image Tools",
    path: "/image",
    description:
      "Compress, resize, convert, and crop images with PNG, JPEG, and WebP support.",
    blurb: "Compress, resize, convert, crop, and favicons.",
  },
};

export const staticPages = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/tools", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/calculators", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/pdf", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/image", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/guides", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "/about", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/contact", changeFrequency: "yearly" as const, priority: 0.4 },
] as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
