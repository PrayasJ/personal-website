import type { ToolCategory } from "@/lib/site";
import { extraDeveloperTools } from "@/lib/tools.extra";
import { moreDeveloperTools } from "@/lib/tools.more";
import { nextDeveloperTools } from "@/lib/tools.next";
import { calculatorTools } from "@/lib/tools.calculators";
import { pdfTools } from "@/lib/tools.pdf";
import { imageTools } from "@/lib/tools.image";

export type { ToolCategory };

export type ToolFaq = {
  question: string;
  answer: string;
};

export type ToolExample = {
  title: string;
  code: string;
  note?: string;
};

export type ToolContentSection = {
  title: string;
  paragraphs: string[];
};

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  related: string[];
  popular?: boolean;
  localProcessing: boolean;
  faqs: ToolFaq[];
  examples: ToolExample[];
  sections: ToolContentSection[];
};

/**
 * Central registry of indexable tools.
 * Adding a tool: append an entry here, add the interactive component,
 * and map it in `ToolInterface`.
 */
export const tools: Tool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate and minify JSON in your browser.",
    category: "developer",
    keywords: [
      "json",
      "formatter",
      "pretty print",
      "minify",
      "validate",
      "beautify",
      "json validator",
    ],
    path: "/tools/json-formatter",
    title: "JSON Formatter & Validator Online - Free | Prayas.dev",
    metaDescription:
      "Format, validate and minify JSON online for free. Fast browser-based JSON formatter with syntax error detection.",
    h1: "JSON Formatter",
    intro:
      "Paste JSON, format or minify it, and copy the result. Validation runs in your browser and never sends the text to a server.",
    related: ["json-yaml", "json-to-go", "json-to-ts"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is my JSON uploaded anywhere?",
        answer:
          "No. Formatting, minifying and validation all use JavaScript in your browser. The JSON never leaves this page as part of using the tool.",
      },
      {
        question: "What is the difference between Format and Minify?",
        answer:
          "Format pretty-prints the value with two-space indentation so it is readable. Minify removes unnecessary whitespace so the payload is as small as a single valid JSON value can be.",
      },
      {
        question: "Why is my JSON invalid?",
        answer:
          "Common causes are trailing commas, single quotes instead of double quotes, comments, unquoted keys, and missing brackets. This tool accepts standard JSON, not JSON5 or JavaScript object literals.",
      },
      {
        question: "Can I use this offline?",
        answer:
          "After the page has loaded, formatting does not need a network request. A reload without a cache will still need the site to be reachable.",
      },
    ],
    examples: [
      {
        title: "Pretty-printed object",
        code: `{
  "name": "Prayas",
  "age": 25
}`,
        note: "Objects, arrays, strings, numbers, booleans and null are all valid JSON values.",
      },
      {
        title: "Minified",
        code: `{"name":"Prayas","age":25}`,
      },
    ],
    sections: [
      {
        title: "About JSON Formatter",
        paragraphs: [
          "This page is a small JSON editor: paste a payload, format it for reading, minify it for transport, or check that it parses. Errors are reported with a short explanation and, when the engine provides it, a character position.",
          "It exists because JSON is easy to produce and just as easy to break with a trailing comma. The formatter is the first tool on Prayas.dev and the template for the rest.",
        ],
      },
      {
        title: "What is JSON?",
        paragraphs: [
          "JSON (JavaScript Object Notation) is a text format for structured data. It is language-independent, but the types it can express are limited: objects, arrays, strings, numbers, booleans and null. Keys in objects must be double-quoted strings.",
          "APIs, config files and browser storage all use it. Pretty-printing does not change the value — only the whitespace — so a formatted document and its minified form should parse to the same structure.",
        ],
      },
      {
        title: "How to format JSON",
        paragraphs: [
          "Paste the text into the left-hand editor. Press Format JSON, or use Ctrl+Enter (⌘+Enter on a Mac). If the text is valid, the right-hand panel shows an indented copy. Use Copy to put that result on the clipboard, or Minify if you need a compact version.",
          "If parsing fails, read the highlighted message first. The technical line underneath is the engine’s own error, which is useful when you already know JSON well.",
        ],
      },
    ],
  },
  {
    slug: "tape-trader",
    name: "Tape Trader",
    description:
      "A toy tape, order book, and blotter. Buy the ask, sell the bid, keep a mark-to-market.",
    category: "developer",
    keywords: [
      "trading game",
      "order book",
      "tape",
      "pnl",
      "hft",
      "toy market",
    ],
    path: "/tools/tape-trader",
    title: "Tape Trader — Toy Desk | Prayas.dev",
    metaDescription:
      "Play a tiny tape-trading game in the browser. Live toy quotes, a five-level book, keyboard fills, and mark-to-market PnL. Not a market.",
    h1: "Tape Trader",
    intro:
      "A desk toy with one symbol, PJX. Quotes wander, the book breathes, and you can take a long or a short. Buys lift the ask, sells hit the bid. Nothing here is a market, a simulation of Nubra, or advice.",
    related: ["unix-timestamp", "json-formatter"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is this a real market?",
        answer:
          "No. The tape is a random walk in your browser. There is no matching engine, no other participants, and no money.",
      },
      {
        question: "How do fills work?",
        answer:
          "A buy fills at the displayed ask. A sell fills at the displayed bid. Keyboard shortcuts B, S, and F work when the desk panel is focused. Hold Shift to trade 10 lots.",
      },
      {
        question: "Does the score persist?",
        answer:
          "Best mark-to-market PnL is stored in localStorage on this browser. Resetting the session does not clear that high-water mark.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "What this is",
        paragraphs: [
          "I work on an order management system. This page is not that system. It is a small, honest toy: one symbol, a made-up book, and a blotter so the homepage desk has somewhere larger to go.",
          "Use it to click around a tape, or ignore it. Either way the quotes keep moving in the header.",
        ],
      },
    ],
  },
  {
    slug: "unix-timestamp",
    name: "Unix Timestamp Converter",
    description:
      "Convert unix seconds, milliseconds, and ISO datetimes. UTC and IST on the same blotter.",
    category: "developer",
    keywords: [
      "unix timestamp",
      "epoch",
      "iso 8601",
      "utc",
      "ist",
      "convert time",
    ],
    path: "/tools/unix-timestamp",
    title: "Unix Timestamp Converter Online | Prayas.dev",
    metaDescription:
      "Convert unix timestamps and ISO datetimes in your browser. Seconds, milliseconds, UTC, and IST. No upload.",
    h1: "Unix Timestamp Converter",
    intro:
      "Paste unix seconds, milliseconds, or an ISO-8601 string. The converter stays in your browser and prints UTC and Asia/Kolkata next to each other.",
    related: ["cron", "jwt-decoder", "go-duration"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Seconds or milliseconds?",
        answer:
          "A value with 13 or more digits is treated as milliseconds. Shorter integer values are treated as seconds. ISO-8601 strings are parsed by the browser’s Date parser.",
      },
      {
        question: "Which timezone is IST?",
        answer:
          "Asia/Kolkata. UTC is also shown. The ISO line is always in UTC with a trailing Z.",
      },
      {
        question: "Is the time sent anywhere?",
        answer:
          "No. Conversion is local JavaScript. Refreshing the page does not keep the last input.",
      },
    ],
    examples: [
      {
        title: "Unix seconds",
        code: "1710000000",
        note: "12 March 2024, 10:40:00 UTC.",
      },
      {
        title: "ISO-8601",
        code: "2026-09-12T16:00:00Z",
      },
    ],
    sections: [
      {
        title: "About unix time",
        paragraphs: [
          "Unix time counts seconds since 1970-01-01T00:00:00Z, ignoring leap seconds. Logs, databases, and APIs often store it as an integer. Milliseconds are the same origin with three extra digits.",
          "This page exists because I keep converting epoch values while reading OMS logs. Snap now, paste a value, copy the ISO string back out.",
        ],
      },
    ],
  },
  ...extraDeveloperTools,
  ...moreDeveloperTools,
  ...nextDeveloperTools,
  ...calculatorTools,
  ...pdfTools,
  ...imageTools,
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolByPath(path: string): Tool | undefined {
  return tools.find((tool) => tool.path === path);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getPopularTools(limit = 6): Tool[] {
  const popular = tools.filter((tool) => tool.popular);
  if (popular.length > 0) {
    return popular.slice(0, limit);
  }
  return tools.slice(0, limit);
}

export function getRelatedTools(slug: string): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) {
    return [];
  }
  return tool.related
    .map((relatedSlug) => getToolBySlug(relatedSlug))
    .filter((related): related is Tool => Boolean(related));
}

export function searchTools(query: string): Tool[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }
  const terms = normalized.split(/\s+/);
  return tools.filter((tool) => {
    const haystack = [
      tool.name,
      tool.description,
      tool.category,
      tool.h1,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function getIndexableToolPaths(): string[] {
  return tools.map((tool) => tool.path);
}

/** Homepage project cards for every registered tool. Adding a tool is enough. */
export function getToolProjects() {
  return tools.map((tool) => ({
    title: tool.name,
    description: tool.description,
    url: tool.path,
    year: 2026,
    skills: ["TypeScript", "Next.js", ...tool.keywords.slice(0, 3)],
    links: [{ url: tool.path, text: "Open tool" }],
    live: true as const,
    internal: true as const,
  }));
}
