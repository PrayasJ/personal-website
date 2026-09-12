import type { Tool } from "@/lib/tools";

export const extraDeveloperTools: Tool[] = [
  {
    slug: "json-yaml",
    name: "JSON ↔ YAML",
    description: "Convert JSON to YAML and back in the browser.",
    category: "developer",
    keywords: ["json", "yaml", "convert", "yml"],
    path: "/tools/json-yaml",
    title: "JSON to YAML Converter Online | Prayas.dev",
    metaDescription:
      "Convert JSON to YAML and YAML to JSON in your browser. JSON-compatible YAML, no upload.",
    h1: "JSON ↔ YAML Converter",
    intro:
      "Paste JSON or JSON-compatible YAML and convert either way. Maps, lists, and scalars only — no anchors or tags. Nothing is uploaded.",
    related: ["json-formatter", "json-to-go", "base64"],
    localProcessing: true,
    faqs: [
      {
        question: "Is this full YAML?",
        answer:
          "No. It covers the JSON subset: mappings, sequences, strings, numbers, booleans, and null. Anchors, tags, merge keys, and document streams are out of scope.",
      },
      {
        question: "Does the text leave my browser?",
        answer: "No. Conversion is local JavaScript.",
      },
    ],
    examples: [
      {
        title: "YAML mapping",
        code: "name: Prayas\nactive: true\n",
      },
    ],
    sections: [
      {
        title: "When to use this",
        paragraphs: [
          "Kubernetes manifests, GitHub Actions, and a lot of config still speak YAML. APIs speak JSON. This page is the boring bridge between the two, with a documented subset so it does not pretend to be a YAML spec implementation.",
        ],
      },
    ],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode a JWT header and payload. Signatures are not verified.",
    category: "developer",
    keywords: ["jwt", "json web token", "decode", "base64url", "jwt decoder online"],
    path: "/tools/jwt-decoder",
    title: "JWT Decoder Online — Header & Payload, No Upload",
    metaDescription:
      "Decode a JWT in your browser. Header and payload, exp/iat as ISO times. Signatures are never verified. Token is not uploaded.",
    h1: "JWT Decoder",
    intro:
      "Paste a token. The header and payload are base64url-decoded here. This page does not check signatures and must not be used to decide whether a token is authentic.",
    related: ["base64", "json-formatter", "unix-timestamp"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Do you verify the signature?",
        answer:
          "No. Verification needs the correct key and algorithm. A decoded payload is just bytes that happened to be JSON.",
      },
      {
        question: "Is the token uploaded?",
        answer:
          "No. Decode it on a machine you trust. A JWT in a URL bar or a screenshot is still a credential.",
      },
    ],
    examples: [
      {
        title: "Shape",
        code: "header.payload.signature",
        note: "Three base64url segments separated by dots. The signature is shown, not checked.",
      },
    ],
    sections: [
      {
        title: "What a JWT is",
        paragraphs: [
          "A JSON Web Token is three encoded segments: a header, a payload, and a signature. The payload often carries iss, sub, exp, and friends. Reading those claims is useful when debugging an OMS or an API. Trusting them still requires verifying the signature with the right key.",
        ],
      },
    ],
  },
  {
    slug: "base64",
    name: "Base64 Encoder",
    description: "Encode and decode UTF-8 text as Base64, including URL-safe alphabet.",
    category: "developer",
    keywords: ["base64", "encode", "decode", "base64url", "base64 encoder online"],
    path: "/tools/base64",
    title: "Base64 Encoder & Decoder Online — UTF-8, URL-safe",
    metaDescription:
      "Encode and decode Base64 in your browser. UTF-8 text, standard or URL-safe alphabet. No upload, no account.",
    h1: "Base64 Encoder & Decoder",
    intro:
      "Convert UTF-8 text to Base64 and back. URL-safe mode uses - and _ and omits padding. Processing stays on this page.",
    related: ["url-encoder", "jwt-decoder", "hash-generator"],
    localProcessing: true,
    faqs: [
      {
        question: "What is URL-safe Base64?",
        answer:
          "The same encoding with + replaced by -, / replaced by _, and padding equals signs dropped. JWTs use this alphabet.",
      },
      {
        question: "Can I encode files?",
        answer:
          "This page is for text. Binary files would need a file picker; that is not wired yet.",
      },
    ],
    examples: [
      {
        title: "hello",
        code: "aGVsbG8=",
      },
    ],
    sections: [
      {
        title: "About Base64",
        paragraphs: [
          "Base64 turns bytes into ASCII. It is not encryption. Anyone who can read the output can recover the input. Use it for transport, not for secrets.",
        ],
      },
    ],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder",
    description: "Percent-encode and decode URL components or full URIs.",
    category: "developer",
    keywords: ["url encode", "percent encoding", "encodeURIComponent"],
    path: "/tools/url-encoder",
    title: "URL Encoder & Decoder Online | Prayas.dev",
    metaDescription:
      "Encode and decode URL components or full URIs in your browser. Uses encodeURIComponent and encodeURI.",
    h1: "URL Encoder & Decoder",
    intro:
      "Percent-encode query values with encodeURIComponent, or encode a full URI while leaving : / ? # in place.",
    related: ["base64", "url-inspector", "html-entities"],
    localProcessing: true,
    faqs: [
      {
        question: "Component or full URI?",
        answer:
          "Component mode is for values you put in a query string. Full URI mode is for an entire URL that should keep its structure.",
      },
      {
        question: "Is this the same as JavaScript’s encodeURIComponent?",
        answer: "Yes. That is the function this page calls.",
      },
    ],
    examples: [
      {
        title: "Query value",
        code: "json formatter",
        note: "Becomes json%20formatter in component mode.",
      },
    ],
    sections: [
      {
        title: "Percent encoding",
        paragraphs: [
          "Spaces, unicode, and reserved characters have to be escaped in URLs. This page is a thin UI over the platform functions so you do not have to open a console.",
        ],
      },
    ],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate RFC 4122 version 4 UUIDs in the browser.",
    category: "developer",
    keywords: ["uuid", "guid", "v4", "generate", "uuid generator online"],
    path: "/tools/uuid-generator",
    title: "UUID Generator Online — Free v4 UUID / GUID",
    metaDescription:
      "Generate UUID v4 values in your browser with Web Crypto. Copy one or many, with or without hyphens. No upload.",
    h1: "UUID Generator (v4)",
    intro:
      "Version 4 UUIDs from crypto.randomUUID when the browser has it. Generate up to 100 at a time, with or without hyphens.",
    related: ["ulid-generator", "base64", "json-formatter"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Which version?",
        answer:
          "Version 4: random bits, with the version and variant bits set as in RFC 4122.",
      },
      {
        question: "Are these unique?",
        answer:
          "Collisions are vanishingly unlikely for v4. They are still not a substitute for a database primary key strategy you have thought about.",
      },
    ],
    examples: [
      {
        title: "v4",
        code: "550e8400-e29b-41d4-a716-446655440000",
        note: "Example shape only — generate a fresh value on the page.",
      },
    ],
    sections: [
      {
        title: "Why v4",
        paragraphs: [
          "I mostly need a unique id for a test fixture or a local row. v4 is the one the platform gives you for free. Time-based UUIDs are a different tool.",
        ],
      },
    ],
  },
  {
    slug: "cron",
    name: "Cron Expression Generator",
    description: "Build and read 5-field cron expressions.",
    category: "developer",
    keywords: ["cron", "schedule", "crontab", "expression", "cron generator"],
    path: "/tools/cron",
    title: "Cron Expression Generator Online — 5-Field Crontab",
    metaDescription:
      "Build a 5-field cron expression and read it in plain language. Minute, hour, day, month, weekday. Runs in your browser.",
    h1: "Cron Expression Generator",
    intro:
      "Five fields: minute, hour, day of month, month, day of week. Presets for hourly, weekdays, and monthly. This is not Quartz and not systemd OnCalendar.",
    related: ["regex-tester", "unix-timestamp"],
    localProcessing: true,
    faqs: [
      {
        question: "Five fields or six?",
        answer:
          "Five. There is no seconds field. Quartz-style 6/7 field expressions are not parsed here.",
      },
      {
        question: "Is Sunday 0 or 7?",
        answer:
          "Both appear in the wild. This explainer treats 0–6 as SUN–SAT. A 7 is shown as 7.",
      },
    ],
    examples: [
      {
        title: "Weekdays at 09:00",
        code: "0 9 * * 1-5",
      },
    ],
    sections: [
      {
        title: "Reading cron",
        paragraphs: [
          "Left to right: minute, hour, day of month, month, weekday. Stars mean every. Commas are lists, dashes are ranges, and */n is a step. The description on this page is a gloss, not a guarantee that every scheduler agrees.",
        ],
      },
    ],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test JavaScript regular expressions against a string.",
    category: "developer",
    keywords: ["regex", "regexp", "match", "replace", "regex tester online"],
    path: "/tools/regex-tester",
    title: "Regex Tester Online — JavaScript RegExp, No Upload",
    metaDescription:
      "Test JavaScript regular expressions in your browser. Flags, match list, and replace. The test string is not uploaded.",
    h1: "Regex Tester",
    intro:
      "The same RegExp engine the browser uses. Set flags, list matches with indices, and run a replace.",
    related: ["cron", "json-formatter"],
    localProcessing: true,
    faqs: [
      {
        question: "Which flavour?",
        answer:
          "JavaScript. It is not PCRE, not Python, and not ripgrep. Possessive quantifiers and some lookbehinds differ.",
      },
      {
        question: "Does the test string leave the machine?",
        answer: "No. The pattern and the haystack stay in the page.",
      },
    ],
    examples: [
      {
        title: "Word of capitals",
        code: "\\b[A-Z]{3}\\b",
      },
    ],
    sections: [
      {
        title: "Testing here",
        paragraphs: [
          "I keep a tester next to the formatter because logs and blotters are full of patterns. This one is honest about being JavaScript’s engine and nothing else.",
        ],
      },
    ],
  },
  {
    slug: "json-to-go",
    name: "JSON → Go struct",
    description: "Turn JSON into Go structs with json tags.",
    category: "developer",
    keywords: ["go", "golang", "json", "struct", "codegen"],
    path: "/tools/json-to-go",
    title: "JSON to Go Struct Online | Prayas.dev",
    metaDescription:
      "Generate Go structs from JSON in your browser. Nested objects become named types with json tags.",
    h1: "JSON → Go struct",
    intro:
      "Paste JSON, name the root type, get structs with json tags. Integers become int64. Nested objects become their own types. Run gofmt on the result.",
    related: ["json-formatter", "json-to-ts", "json-yaml"],
    localProcessing: true,
    faqs: [
      {
        question: "Is the output gofmt-clean?",
        answer:
          "It is meant to compile after a paste. Alignment is best-effort. Pipe it through gofmt.",
      },
      {
        question: "How are numbers typed?",
        answer:
          "Safe integers become int64. Anything else numeric becomes float64. Null becomes any.",
      },
    ],
    examples: [
      {
        title: "Object",
        code: `{"name":"Prayas","active":true}`,
      },
    ],
    sections: [
      {
        title: "Why this exists",
        paragraphs: [
          "Decoding API fixtures into Go is a thing I do often enough that a local converter is cheaper than another gist. Nested objects get their own type names so the output is something you can actually edit.",
        ],
      },
    ],
  },
];
