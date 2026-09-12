import type { Tool } from "@/lib/tools";

export const nextDeveloperTools: Tool[] = [
  {
    slug: "json-to-ts",
    name: "JSON → TypeScript",
    description: "Turn JSON into TypeScript interfaces in the browser.",
    category: "developer",
    keywords: ["typescript", "json", "interface", "codegen", "types"],
    path: "/tools/json-to-ts",
    title: "JSON to TypeScript Interface Online | Prayas.dev",
    metaDescription:
      "Generate TypeScript interfaces from JSON in your browser. Nested objects become named types. No upload.",
    h1: "JSON → TypeScript",
    intro:
      "Paste JSON, name the root type, get interfaces. Arrays use the first element. Nested objects become their own names. This is a starting point, not a schema compiler.",
    related: ["json-to-go", "json-formatter", "json-yaml"],
    localProcessing: true,
    faqs: [
      {
        question: "Does the JSON leave this browser?",
        answer: "No. Generation is local TypeScript running in the page.",
      },
      {
        question: "Optional fields?",
        answer:
          "The sample is treated as required. If a key is sometimes missing, add ? yourself.",
      },
    ],
    examples: [
      {
        title: "Interface from an object",
        code: `export interface Root {
  name: string;
  active: boolean;
}`,
      },
    ],
    sections: [
      {
        title: "When to use this",
        paragraphs: [
          "I paste RPC and OMS payloads into this when the protobuf is elsewhere. It is faster than typing the first draft of a type by hand, and it stays on this machine.",
        ],
      },
    ],
  },
  {
    slug: "go-duration",
    name: "Go Duration",
    description: "Parse and format Go time.Duration strings like 1h30m and 250ms.",
    category: "developer",
    keywords: ["go", "duration", "time.parseduration", "milliseconds", "timeout"],
    path: "/tools/go-duration",
    title: "Go Duration Parser — 1h30m, 250ms | Prayas.dev",
    metaDescription:
      "Parse Go time.Duration strings and convert milliseconds back to 1h30m form. Runs in your browser.",
    h1: "Go Duration Parser",
    intro:
      "Paste a Go duration (300ms, 1h30m, -1.5h) or milliseconds. Units are ns, us, ms, s, m, h — the same set as time.ParseDuration. Not a calendar interval.",
    related: ["unix-timestamp", "cron", "timezone-converter"],
    localProcessing: true,
    faqs: [
      {
        question: "Is this time.ParseDuration?",
        answer:
          "It follows the same unit set and composition. Day and week units are not in Go’s parser, so they are not here either.",
      },
    ],
    examples: [
      {
        title: "OMS timeout",
        code: "2s500ms",
        note: "Canonical form is 2s500ms, total 2500 ms.",
      },
    ],
    sections: [
      {
        title: "Why this page",
        paragraphs: [
          "Go configs and RPC deadlines are written as 50ms or 2s. Logs often print milliseconds. This blotter converts either way without opening a REPL.",
        ],
      },
    ],
  },
  {
    slug: "byte-size",
    name: "Byte Size Converter",
    description: "Convert bytes, KiB, MiB, and SI units for payload sizes.",
    category: "developer",
    keywords: ["kib", "mib", "mb", "bytes", "file size", "iec"],
    path: "/tools/byte-size",
    title: "Byte Size Converter — KiB MiB MB | Prayas.dev",
    metaDescription:
      "Convert between bytes, KiB, MiB, GiB and SI kB/MB/GB in your browser. IEC 1024 or SI 1000.",
    h1: "Byte Size Converter",
    intro:
      "Paste a size and pick a unit. IEC uses 1024 (KiB, MiB). SI uses 1000 (kB, MB). Logs and kernels usually mean IEC.",
    related: ["number-base", "hex-utf8", "unix-timestamp"],
    localProcessing: true,
    faqs: [
      {
        question: "KiB or KB?",
        answer:
          "KiB is 1024 bytes (IEC). kB here is 1000 bytes (SI). Hard-drive marketing often uses GB as 10^9.",
      },
    ],
    examples: [
      {
        title: "1500 bytes",
        code: "1500 B = 1.46484 KiB",
      },
    ],
    sections: [
      {
        title: "When it matters",
        paragraphs: [
          "Payload caps, log lines, and gRPC message sizes are easier to read as KiB than as raw bytes. This page does that conversion locally.",
        ],
      },
    ],
  },
  {
    slug: "query-string",
    name: "Query String",
    description: "Parse and build application/x-www-form-urlencoded query strings.",
    category: "developer",
    keywords: ["query string", "urlsearchparams", "urlencoded", "qs"],
    path: "/tools/query-string",
    title: "Query String Parser & Builder Online | Prayas.dev",
    metaDescription:
      "Parse and build URL query strings with URLSearchParams in your browser. Repeated keys kept. No upload.",
    h1: "Query String Builder",
    intro:
      "Paste a query string or edit key/value pairs. Encoding uses URLSearchParams, so spaces become +. For origin and path, use the URL inspector.",
    related: ["url-inspector", "url-encoder", "json-formatter"],
    localProcessing: true,
    faqs: [
      {
        question: "Are duplicate keys kept?",
        answer: "Yes. URLSearchParams preserves repeats in order.",
      },
    ],
    examples: [
      {
        title: "Toy fill",
        code: "symbol=PJX&side=BUY&qty=1",
      },
    ],
    sections: [
      {
        title: "What this is not",
        paragraphs: [
          "It is not a full URL parser and not qs nested-object syntax. Brackets in keys stay as literal names.",
        ],
      },
    ],
  },
  {
    slug: "ulid-generator",
    name: "ULID Generator",
    description: "Generate ULIDs with a millisecond timestamp and inspect the time.",
    category: "developer",
    keywords: ["ulid", "uuid", "sortable id", "crockford", "base32"],
    path: "/tools/ulid-generator",
    title: "ULID Generator Online — Timestamp IDs | Prayas.dev",
    metaDescription:
      "Generate ULIDs in your browser with Web Crypto entropy. Inspect the embedded millisecond timestamp. No upload.",
    h1: "ULID Generator",
    intro:
      "ULIDs are 26 Crockford Base32 characters: 48 bits of time, 80 bits of randomness. They sort by time as strings. Generate up to 100, then inspect the timestamp.",
    related: ["uuid-generator", "unix-timestamp", "hash-generator"],
    localProcessing: true,
    faqs: [
      {
        question: "Why not UUID v4?",
        answer:
          "v4 is random. ULIDs encode time, so indexes stay roughly sequential. Use whichever your store already standardised on.",
      },
      {
        question: "Monotonic?",
        answer:
          "This generator does not bump entropy inside the same millisecond. Two IDs in one ms can sort either way.",
      },
    ],
    examples: [
      {
        title: "Layout",
        code: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
        note: "First 10 characters are time. The rest is entropy.",
      },
    ],
    sections: [
      {
        title: "Alphabet",
        paragraphs: [
          "Crockford Base32 drops I, L, O, and U so IDs are easier to read aloud. Decoding here uppercases the value first.",
        ],
      },
    ],
  },
  {
    slug: "http-status",
    name: "HTTP Status Codes",
    description: "Look up HTTP status codes, phrases, and a one-line meaning.",
    category: "developer",
    keywords: ["http status", "404", "429", "503", "rfc 9110"],
    path: "/tools/http-status",
    title: "HTTP Status Code Lookup | Prayas.dev",
    metaDescription:
      "Look up HTTP status codes and reason phrases in your browser. Filter by class or search 404, 429, 503.",
    h1: "HTTP Status Codes",
    intro:
      "A blotter of the status codes that show up in APIs and OMS logs. Phrases follow RFC 9110 where they exist. 422 and 429 are included because APIs use them.",
    related: ["url-inspector", "json-formatter", "jwt-decoder"],
    localProcessing: true,
    faqs: [
      {
        question: "Is this the full IANA registry?",
        answer:
          "No. It is the set I actually search for. Unofficial codes are omitted unless they are widely used (422, 429).",
      },
    ],
    examples: [
      {
        title: "Rate limit",
        code: "429 Too Many Requests",
      },
    ],
    sections: [
      {
        title: "How to read a class",
        paragraphs: [
          "2xx succeeded. 3xx go elsewhere. 4xx the client can fix. 5xx the server or an upstream failed. 429 is a 4xx: back off.",
        ],
      },
    ],
  },
  {
    slug: "markdown-preview",
    name: "Markdown Preview",
    description: "Preview markdown as HTML in your browser. Copy the HTML out.",
    category: "developer",
    keywords: [
      "markdown preview",
      "markdown to html",
      "md preview",
      "github flavored markdown",
    ],
    path: "/tools/markdown-preview",
    title: "Markdown Preview Online — Markdown to HTML, No Upload",
    metaDescription:
      "Preview markdown and copy HTML in your browser. Tables, strikethrough, task lists. No upload, no account.",
    h1: "Markdown Preview",
    intro:
      "Paste markdown on the left. The HTML preview updates in this tab. Copy the HTML when you need it. Not a full sanitizer for untrusted input.",
    related: ["html-entities", "text-diff", "xml-formatter"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is the HTML sanitized?",
        answer:
          "No. Do not paste untrusted markdown. This page is for your own notes and READMEs.",
      },
      {
        question: "Which flavour?",
        answer:
          "Showdown with tables, strikethrough, GFM code blocks, and task lists.",
      },
    ],
    examples: [
      {
        title: "Heading",
        code: "# Title\n\nParagraph with **bold**.",
      },
    ],
    sections: [
      {
        title: "Why this page",
        paragraphs: [
          "I keep checking markdown before it hits a PR description. A local preview is enough; the text never needs a server.",
        ],
      },
    ],
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    description: "Pretty-print and minify XML in the browser with DOMParser.",
    category: "developer",
    keywords: [
      "xml formatter",
      "xml beautifier",
      "pretty print xml",
      "minify xml",
    ],
    path: "/tools/xml-formatter",
    title: "XML Formatter Online — Beautify & Minify XML",
    metaDescription:
      "Format and minify XML in your browser with DOMParser. Catch parse errors locally. No upload.",
    h1: "XML Formatter",
    intro:
      "Paste XML, format or minify it, copy the result. Parsing uses the browser DOMParser — nothing is uploaded.",
    related: ["json-formatter", "html-entities", "markdown-preview"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Does it validate against a schema?",
        answer:
          "No. It only checks that the document parses as XML. XSD and DTD validation are out of scope.",
      },
      {
        question: "Is the XML uploaded?",
        answer: "No. Format and minify stay in this tab.",
      },
    ],
    examples: [
      {
        title: "Root with children",
        code: "<root><item id=\"1\">ok</item></root>",
      },
    ],
    sections: [
      {
        title: "How it works",
        paragraphs: [
          "DOMParser builds a document. On success, the tree is serialized with two-space indentation or compacted. Parser errors from the engine are shown as-is.",
        ],
      },
    ],
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    description: "Pretty-print SQL for PostgreSQL, MySQL, SQLite, or standard SQL.",
    category: "developer",
    keywords: [
      "sql formatter",
      "format sql",
      "pretty print sql",
      "postgresql formatter",
    ],
    path: "/tools/sql-formatter",
    title: "SQL Formatter Online — PostgreSQL, MySQL, SQLite",
    metaDescription:
      "Format SQL in your browser. PostgreSQL, MySQL, SQLite, or standard SQL. No upload, no account.",
    h1: "SQL Formatter",
    intro:
      "Paste a query, pick a dialect, pretty-print. Formatting runs with sql-formatter in this tab — the query never leaves the page.",
    related: ["json-formatter", "text-diff", "csv-json"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Does it run the query?",
        answer: "No. It only formats text. There is no database connection.",
      },
      {
        question: "Which dialects?",
        answer: "Standard SQL, PostgreSQL, MySQL, and SQLite.",
      },
    ],
    examples: [
      {
        title: "Select with join",
        code: "select o.id from orders o join fills f on f.order_id=o.id;",
      },
    ],
    sections: [
      {
        title: "When to use this",
        paragraphs: [
          "OMS and API logs often dump one-line SQL. Formatting it locally is faster than pasting into a random site that might keep the query.",
        ],
      },
    ],
  },
];
