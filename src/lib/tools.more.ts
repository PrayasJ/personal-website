import type { Tool } from "@/lib/tools";

export const moreDeveloperTools: Tool[] = [
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "SHA-1, SHA-256, SHA-384, SHA-512 and HMAC in the browser.",
    category: "developer",
    keywords: ["sha256", "sha1", "hmac", "checksum", "hash"],
    path: "/tools/hash-generator",
    title: "SHA-256 Hash & HMAC Generator Online | Prayas.dev",
    metaDescription:
      "Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes and HMAC in your browser with Web Crypto. No upload.",
    h1: "Hash Generator",
    intro:
      "Digest or HMAC a UTF-8 string with the algorithms the browser already ships. SHA-1 is included because logs still use it. Prefer SHA-256.",
    related: ["base64", "jwt-decoder", "password-generator"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is hashing done on a server?",
        answer: "No. crypto.subtle.digest and HMAC run in this page.",
      },
      {
        question: "Is SHA-1 safe?",
        answer:
          "No. It is here to compare against old checksums. Use SHA-256 or stronger for anything new.",
      },
    ],
    examples: [
      {
        title: "Empty SHA-256",
        code: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      },
    ],
    sections: [
      {
        title: "Why this page",
        paragraphs: [
          "I hash payloads while debugging RPC and logs. A local digest is faster than another gist, and the bytes never leave the machine.",
        ],
      },
    ],
  },
  {
    slug: "url-inspector",
    name: "URL Inspector",
    description: "Split a URL into origin, path, query pairs, and hash.",
    category: "developer",
    keywords: ["url parser", "query string", "search params"],
    path: "/tools/url-inspector",
    title: "URL Parser & Query String Inspector | Prayas.dev",
    metaDescription:
      "Parse a URL into host, path, query parameters, and hash in your browser. No upload.",
    h1: "URL Inspector",
    intro:
      "Paste a URL or a leading query string. The browser parser splits origin, path, and each query pair.",
    related: ["query-string", "html-entities", "json-formatter"],
    localProcessing: true,
    faqs: [
      {
        question: "What if there is no scheme?",
        answer: "https:// is assumed. A string that starts with ? is treated as a query.",
      },
      {
        question: "Are passwords shown?",
        answer: "Userinfo passwords are masked. Do not paste live credentials.",
      },
    ],
    examples: [
      {
        title: "Query",
        code: "https://prayas.dev/tools?q=json+formatter",
      },
    ],
    sections: [
      {
        title: "Parsing URLs",
        paragraphs: [
          "This is the WHATWG URL parser, the same one fetch uses. It is the right place to look when a query looks fine in a log and wrong in a client.",
        ],
      },
    ],
  },
  {
    slug: "html-entities",
    name: "HTML Entity Encoder",
    description: "Encode and decode HTML entities for text you put in markup.",
    category: "developer",
    keywords: ["html entities", "escape html", "amp lt gt"],
    path: "/tools/html-entities",
    title: "HTML Entity Encoder & Decoder Online | Prayas.dev",
    metaDescription:
      "Encode and decode HTML entities in your browser. Named and numeric entities. Not a sanitizer.",
    h1: "HTML Entity Encoder",
    intro:
      "Turn < & quotes into entities, or decode them back. This page does not sanitise HTML and will not make untrusted markup safe.",
    related: ["url-encoder", "json-formatter", "text-diff"],
    localProcessing: true,
    faqs: [
      {
        question: "Does this stop XSS?",
        answer:
          "No. Encoding text you insert into HTML helps. Pasting a full document through this tool does not.",
      },
    ],
    examples: [
      {
        title: "Markup",
        code: "&lt;div class=&quot;tape&quot;&gt;PJX&lt;/div&gt;",
      },
    ],
    sections: [
      {
        title: "Entities",
        paragraphs: [
          "Browsers treat < and & as markup. If you need those characters as text, they have to be entities. That is all this page does.",
        ],
      },
    ],
  },
  {
    slug: "text-diff",
    name: "Text Diff",
    description: "Compare two texts line by line in the browser.",
    category: "developer",
    keywords: ["diff", "compare text", "line diff"],
    path: "/tools/text-diff",
    title: "Text Diff Checker Online | Prayas.dev",
    metaDescription:
      "Compare two blocks of text line by line in your browser. No upload, no git required.",
    h1: "Text Diff",
    intro:
      "Paste two versions of a file, a log, or a blotter. Added lines are green, removed lines are red. Comparison stays local.",
    related: ["regex-tester", "json-formatter", "html-entities"],
    localProcessing: true,
    faqs: [
      {
        question: "Is this git diff?",
        answer:
          "No. It is a line LCS over the first 4,000 lines. It will not honour .gitattributes.",
      },
    ],
    examples: [
      {
        title: "Two lines",
        code: "buy 1 PJX @ 100.10",
      },
    ],
    sections: [
      {
        title: "When I use this",
        paragraphs: [
          "Two JSON blobs, two cron lines, two copies of a message. I wanted a diff that does not open a PR.",
        ],
      },
    ],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "camelCase, snake_case, kebab-case, CONSTANT_CASE, and slugs.",
    category: "developer",
    keywords: ["camelcase", "snake case", "kebab", "slug"],
    path: "/tools/case-converter",
    title: "Case Converter — camelCase, snake_case, slug | Prayas.dev",
    metaDescription:
      "Convert text to camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, and slugs in your browser.",
    h1: "Case Converter",
    intro:
      "Split on spaces, dashes, underscores, and camel humps, then emit the usual identifier styles. Accents are stripped.",
    related: ["url-encoder", "regex-tester", "json-to-go"],
    localProcessing: true,
    faqs: [
      {
        question: "Does it keep punctuation?",
        answer: "No. Non-alphanumerics become separators, then disappear.",
      },
    ],
    examples: [
      {
        title: "Phrase",
        code: "Tape trader blotter",
        note: "camelCase becomes tapeTraderBlotter.",
      },
    ],
    sections: [
      {
        title: "Identifier soup",
        paragraphs: [
          "Go, JSON, and URLs disagree about case. This is the small table I keep instead of renaming by hand.",
        ],
      },
    ],
  },
  {
    slug: "number-base",
    name: "Number Base Converter",
    description: "Convert integers between binary, octal, decimal, and hex.",
    category: "developer",
    keywords: ["hex converter", "binary", "octal", "base conversion"],
    path: "/tools/number-base",
    title: "Binary Octal Decimal Hex Converter | Prayas.dev",
    metaDescription:
      "Convert integers between base 2, 8, 10, and 16 in your browser. BigInt, so values can be larger than 53 bits.",
    h1: "Number Base Converter",
    intro:
      "Paste a value in binary, octal, decimal, or hex. The other three bases update here. Prefixes 0b, 0o, and 0x are accepted.",
    related: ["byte-size", "hash-generator", "json-formatter"],
    localProcessing: true,
    faqs: [
      {
        question: "How large can the number be?",
        answer:
          "It uses BigInt. You are limited by memory and patience, not by JavaScript’s Number type.",
      },
    ],
    examples: [
      {
        title: "255",
        code: "ff",
        note: "Hex for 255. Binary is 11111111.",
      },
    ],
    sections: [
      {
        title: "Bases",
        paragraphs: [
          "Flags, masks, and trace ids show up in hex. This page is the conversion I otherwise do in a REPL.",
        ],
      },
    ],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate a random password with Web Crypto.",
    category: "developer",
    keywords: ["password generator", "random password", "web crypto"],
    path: "/tools/password-generator",
    title: "Password Generator Online — Browser Crypto | Prayas.dev",
    metaDescription:
      "Generate a random password in your browser with crypto.getRandomValues. Choose length and character sets. Nothing is stored.",
    h1: "Password Generator",
    intro:
      "Length, character sets, and crypto.getRandomValues. This is not a vault. Copy the value and put it somewhere you actually keep secrets.",
    related: ["uuid-generator", "hash-generator", "base64"],
    localProcessing: true,
    faqs: [
      {
        question: "Do you store the password?",
        answer: "No. Generating another one replaces the last one in memory on this page.",
      },
      {
        question: "Is this a password manager?",
        answer: "No. It only samples random characters.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Random is not a manager",
        paragraphs: [
          "Use a real password manager for anything that matters. This page exists for throwaway test accounts and local fixtures.",
        ],
      },
    ],
  },
  {
    slug: "csv-json",
    name: "CSV ↔ JSON",
    description: "Convert CSV to JSON and JSON arrays back to CSV.",
    category: "developer",
    keywords: ["csv", "json", "convert", "spreadsheet"],
    path: "/tools/csv-json",
    title: "CSV to JSON Converter Online | Prayas.dev",
    metaDescription:
      "Convert CSV to JSON and JSON arrays to CSV in your browser. Quoted fields, header row optional. No upload.",
    h1: "CSV ↔ JSON",
    intro:
      "Paste CSV or a JSON array. Header row becomes object keys. First 2,000 rows. Nothing is uploaded.",
    related: ["json-formatter", "json-yaml", "text-tools"],
    localProcessing: true,
    faqs: [
      {
        question: "Are numbers typed?",
        answer: "No. Everything stays a string. Parse them in your own code.",
      },
    ],
    examples: [
      {
        title: "CSV",
        code: "symbol,side\nPJX,BUY\n",
      },
    ],
    sections: [
      {
        title: "When to use this",
        paragraphs: [
          "Blotters and exports show up as CSV. APIs want JSON. This is the boring bridge, with a row cap so a huge paste does not freeze the tab.",
        ],
      },
    ],
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "Convert hex, rgb, and HSL for the same color.",
    category: "developer",
    keywords: ["hex", "rgb", "hsl", "color picker"],
    path: "/tools/color-converter",
    title: "Hex RGB HSL Color Converter | Prayas.dev",
    metaDescription:
      "Convert hex, rgb(), and HSL colors in your browser. 3- and 6-digit hex. No upload.",
    h1: "Color Converter",
    intro:
      "Paste #4f46e5 or rgb(79, 70, 229). Hex, rgb, and HSL update together. Alpha is ignored.",
    related: ["number-base", "hex-utf8", "html-entities"],
    localProcessing: true,
    faqs: [
      {
        question: "Does it support alpha?",
        answer: "Not yet. 8-digit hex and rgba() are stripped or rejected.",
      },
    ],
    examples: [
      {
        title: "Accent",
        code: "#4f46e5",
      },
    ],
    sections: [
      {
        title: "Why this exists",
        paragraphs: [
          "Design tokens bounce between hex in CSS and rgb in logs. One conversion is cheaper than opening a design tool.",
        ],
      },
    ],
  },
  {
    slug: "unicode-inspector",
    name: "Unicode Inspector",
    description: "List code points and UTF-8 bytes for a string.",
    category: "developer",
    keywords: ["unicode", "code point", "utf-8", "emoji"],
    path: "/tools/unicode-inspector",
    title: "Unicode Code Point Inspector | Prayas.dev",
    metaDescription:
      "Inspect Unicode code points and UTF-8 bytes in your browser. First 400 characters. No upload.",
    h1: "Unicode Inspector",
    intro:
      "Paste text, including emoji and rupee signs. Each code point shows U+hex, decimal, and UTF-8 bytes.",
    related: ["hex-utf8", "html-entities", "text-tools"],
    localProcessing: true,
    faqs: [
      {
        question: "Grapheme clusters?",
        answer:
          "No. Iteration is JavaScript’s code-point walk. Family emoji may occupy several rows.",
      },
    ],
    examples: [
      {
        title: "Rupee",
        code: "₹",
        note: "U+20B9.",
      },
    ],
    sections: [
      {
        title: "Bytes vs characters",
        paragraphs: [
          "UTF-8 length is not string length. This table is what I open when a log looks like mojibake.",
        ],
      },
    ],
  },
  {
    slug: "hex-utf8",
    name: "Hex ↔ UTF-8",
    description: "Encode UTF-8 text as hex bytes and decode it back.",
    category: "developer",
    keywords: ["hex", "utf-8", "bytes", "encode"],
    path: "/tools/hex-utf8",
    title: "Hex to UTF-8 Converter Online | Prayas.dev",
    metaDescription:
      "Convert UTF-8 text to hex bytes and back in your browser. Spaces and 0x prefixes accepted. No upload.",
    h1: "Hex ↔ UTF-8",
    intro:
      "Text to space-separated hex, or hex back to a UTF-8 string. Useful next to a hex dump in a log.",
    related: ["base64", "unicode-inspector", "number-base"],
    localProcessing: true,
    faqs: [
      {
        question: "Is this hex dump of a file?",
        answer: "No. It is UTF-8 text only. Binary files are out of scope here.",
      },
    ],
    examples: [
      {
        title: "PJX",
        code: "50 4a 58",
      },
    ],
    sections: [
      {
        title: "Hex in logs",
        paragraphs: [
          "Packet traces and some RPC dumps print payload hex. This page turns that back into something readable.",
        ],
      },
    ],
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    description: "Count words, sort lines, unique, and reverse text.",
    category: "developer",
    keywords: ["word count", "sort lines", "unique", "text"],
    path: "/tools/text-tools",
    title: "Word Count, Sort Lines, Unique Text | Prayas.dev",
    metaDescription:
      "Count characters, words, lines, and UTF-8 bytes. Sort, unique, or reverse lines in your browser.",
    h1: "Text Tools",
    intro:
      "Counts update as you type. Sort and unique operate on lines. Bytes are UTF-8, not UTF-16 code units.",
    related: ["text-diff", "case-converter", "regex-tester"],
    localProcessing: true,
    faqs: [
      {
        question: "What is a word?",
        answer: "A run of non-whitespace. Hyphenated tokens count as one.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "A notepad with a few buttons",
        paragraphs: [
          "I keep this next to the diff because sorting a paste is the other half of comparing two lists.",
        ],
      },
    ],
  },
  {
    slug: "timezone-converter",
    name: "Timezone Converter",
    description: "Show one instant in UTC, IST, and other IANA zones.",
    category: "developer",
    keywords: ["timezone", "ist", "utc", "convert time"],
    path: "/tools/timezone-converter",
    title: "Timezone Converter — UTC, IST, IANA | Prayas.dev",
    metaDescription:
      "Convert an ISO datetime or unix timestamp across UTC, Asia/Kolkata, and other IANA zones in your browser.",
    h1: "Timezone Converter",
    intro:
      "Paste ISO-8601 or unix time. The same instant is formatted in UTC, IST, and a short list of other zones.",
    related: ["unix-timestamp", "cron", "jwt-decoder"],
    localProcessing: true,
    faqs: [
      {
        question: "Is IST always Asia/Kolkata?",
        answer: "Yes on this page. It does not follow political renaming.",
      },
    ],
    examples: [
      {
        title: "ISO",
        code: "2026-09-12T16:00:00Z",
      },
    ],
    sections: [
      {
        title: "One instant, many clocks",
        paragraphs: [
          "OMS logs in UTC, people in IST. This is the conversion I otherwise do in a console with too many Date constructors.",
        ],
      },
    ],
  },
];
