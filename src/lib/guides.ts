import { absoluteUrl } from "@/lib/site";

export type GuideSection = {
  title: string;
  paragraphs: string[];
};

export type Guide = {
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  description: string;
  relatedTools: string[];
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: "format-json",
    path: "/guides/format-json",
    title: "How to Format and Validate JSON Online",
    metaDescription:
      "Pretty-print, minify, and validate JSON in the browser. Trailing commas, quotes, and other parse errors — without uploading the payload.",
    h1: "How to format and validate JSON",
    description:
      "JSON is picky about commas and quotes. This is the short version of how to beautify it, minify it, and see why a parser rejected it — on a page that never sends the text to a server.",
    relatedTools: ["json-formatter", "json-yaml", "json-to-go", "json-to-ts"],
    sections: [
      {
        title: "What “format” actually changes",
        paragraphs: [
          "Pretty-printing JSON only changes whitespace. The value is the same: objects, arrays, strings, numbers, booleans, and null. Minify is the inverse — one compact value, still valid JSON.",
          "If two documents parse to the same structure, they are the same JSON, even when one is indented and the other is a single line. That is why a formatter is safe for configs and API payloads you still intend to send.",
        ],
      },
      {
        title: "Why a payload fails to parse",
        paragraphs: [
          "The usual breaks are trailing commas, single quotes, unquoted keys, comments, and JavaScript-only syntax such as undefined. Standard JSON does not allow those. JSON5 and object literals in source files are a different language.",
          "Read the first error the parser reports, then the character position if it gives one. Fix that token before chasing anything further down the file — later errors are often knock-ons.",
        ],
      },
      {
        title: "Do it without uploading",
        paragraphs: [
          "A lot of “JSON formatter” sites post the text to a backend. That is convenient until the payload has tokens, PII, or an internal OMS dump. The JSON formatter on this site runs JSON.parse and JSON.stringify in your browser.",
          "Paste, hit Format, copy the result. Use Minify when you need a smaller body. Nothing in that flow is an API call.",
        ],
      },
    ],
  },
  {
    slug: "read-jwt",
    path: "/guides/read-jwt",
    title: "How to Read a JWT Header and Payload",
    metaDescription:
      "Decode a JSON Web Token in the browser. What header, payload, and signature mean — and why decoding is not verification.",
    h1: "How to read a JWT",
    description:
      "A JWT is three base64url segments. Reading claims such as exp and sub is useful when an API returns 401. Trusting those claims still requires a signature check you should not skip.",
    relatedTools: ["jwt-decoder", "base64", "unix-timestamp", "json-formatter"],
    sections: [
      {
        title: "The three segments",
        paragraphs: [
          "header.payload.signature — each piece is base64url, not encryption. Anyone who can see the token can read the header and payload. The signature is meant to prove that someone with the key issued it.",
          "Typical header fields are alg and typ. Typical payload fields are iss, sub, aud, iat, nbf, and exp. Times are usually unix seconds.",
        ],
      },
      {
        title: "Decoding is not verifying",
        paragraphs: [
          "A decoder that only base64url-decodes the first two segments cannot tell a forged token from a real one. Do not use a browser decoder to authorize anything.",
          "Use it to inspect a token you already have on a machine you trust: see whether exp is in the past, whether alg is none, whether the payload is even JSON. Then verify with the real key in your service.",
        ],
      },
      {
        title: "Treat tokens as credentials",
        paragraphs: [
          "Do not paste production tokens into a site that uploads them. The JWT decoder here stays in the tab. That still does not make a screenshot of the token safe.",
        ],
      },
    ],
  },
  {
    slug: "unix-timestamps",
    path: "/guides/unix-timestamps",
    title: "Unix Timestamps: Seconds, Milliseconds, UTC and IST",
    metaDescription:
      "What unix time is, how to tell seconds from milliseconds, and how to convert epoch values to UTC and IST in the browser.",
    h1: "Unix timestamps, UTC, and IST",
    description:
      "Logs and APIs store time as an integer. This is how to read it without guessing the timezone, and without sending the value to a conversion service.",
    relatedTools: ["unix-timestamp", "timezone-converter", "cron", "go-duration"],
    sections: [
      {
        title: "Seconds since 1970",
        paragraphs: [
          "Unix time counts seconds since 1970-01-01T00:00:00Z, ignoring leap seconds. Ten-digit values around 1.7e9 are seconds in the 2020s. Thirteen-digit values are usually milliseconds (Java, JavaScript Date.now, many databases).",
          "ISO-8601 with a trailing Z is the same instant in UTC. Asia/Kolkata (IST) is UTC+05:30 with no daylight-saving shift.",
        ],
      },
      {
        title: "Convert it locally",
        paragraphs: [
          "The unix timestamp converter on this site treats a 13+ digit integer as milliseconds and shorter integers as seconds. It prints UTC and IST next to each other so OMS logs and IST wall clocks can be compared without a spreadsheet.",
        ],
      },
    ],
  },
  {
    slug: "merge-pdf-no-upload",
    path: "/guides/merge-pdf-no-upload",
    title: "Merge PDF Files in the Browser — No Upload",
    metaDescription:
      "Combine PDFs on your machine with pdf-lib. Why local merge is different from an upload-based PDF site, and how page order works.",
    h1: "Merge PDFs without uploading them",
    description:
      "Most “merge PDF” products send the file to a server, wait, then let you download. That is the wrong model for contracts, IDs, and anything you would not attach to a random email.",
    relatedTools: ["merge-pdf", "split-pdf", "rotate-pdf", "compress-pdf"],
    sections: [
      {
        title: "What local merge does",
        paragraphs: [
          "This site’s merge tool loads each PDF with pdf-lib in the tab, copies pages into a new document in the order you set, and asks you to confirm before download. Encrypted PDFs fail on purpose — decrypt them yourself first.",
          "The download is a new file. Your originals are not rewritten.",
        ],
      },
      {
        title: "Split, rotate, compress",
        paragraphs: [
          "Extract a range such as 1-3,5 into its own PDF. Rotate by setting the page rotate flag (content streams stay). Compress here means rasterizing pages to JPEG — honest for scans, wrong for contracts you still need to search.",
        ],
      },
    ],
  },
  {
    slug: "compress-images-locally",
    path: "/guides/compress-images-locally",
    title: "Compress and Convert Images in the Browser",
    metaDescription:
      "Shrink JPEG, WebP, and PNG with canvas encoding. Resize, crop, convert, and build a favicon without uploading the photo.",
    h1: "Compress images without an upload",
    description:
      "Image CDNs and “compress image” websites decode your file on their servers. If the photo should not leave the laptop, use the canvas in the browser instead.",
    relatedTools: [
      "image-compress",
      "image-resize",
      "image-convert",
      "image-crop",
      "favicon-generator",
    ],
    sections: [
      {
        title: "What the encoder can and cannot do",
        paragraphs: [
          "This site draws the bitmap and calls canvas.toBlob. JPEG and WebP quality is whatever the current browser implements — Chrome, Firefox, and Safari will not bit-match. PNG is rewritten without a quality slider.",
          "That is still enough to cap a long edge, drop a 12 MB phone photo to a size you can attach, or turn a PNG into WebP. It is not Adobe’s encoder and it will not magically restore a blurry source.",
        ],
      },
      {
        title: "Favicons",
        paragraphs: [
          "A favicon.ico here is an ICO container with 16, 32, and 48 px PNG frames, plus a 180 px Apple touch PNG. Crop to a square first if the source is not already one.",
        ],
      },
    ],
  },
  {
    slug: "emi-calculator-india",
    path: "/guides/emi-calculator-india",
    title: "EMI Calculator India — Reducing Balance Formula",
    metaDescription:
      "How monthly reducing-balance EMI is calculated in INR, what the schedule shows, and why it will not match every bank quote.",
    h1: "How an EMI calculator works (India)",
    description:
      "Home and personal loans in India are usually quoted as a monthly EMI on a reducing balance. The formula is short. The bank’s number still includes fees and day-count you will not see on a webpage.",
    relatedTools: ["emi-calculator", "fd-calculator", "rd-calculator", "sip-calculator"],
    sections: [
      {
        title: "The textbook EMI",
        paragraphs: [
          "Monthly rate r is annual percent divided by 1200. If P is principal and n is the number of months, EMI is P·r·(1+r)^n / ((1+r)^n−1). Interest each month is charged on the remaining principal; the rest of the EMI pays principal down.",
          "The calculator on this site uses that formula and prints the first year of the schedule. It is not a loan offer.",
        ],
      },
      {
        title: "What it will not match",
        paragraphs: [
          "Processing fees, rounding to the nearest rupee, moratoriums, and floating-rate resets all move the number. Use the page to sanity-check a quote, not to replace the amortization the lender signs.",
        ],
      },
    ],
  },
  {
    slug: "ctc-in-hand-india",
    path: "/guides/ctc-in-hand-india",
    title: "CTC vs In-hand Salary in India (New Regime)",
    metaDescription:
      "How a common IT CTC split (basic, HRA, PF, gratuity) becomes monthly in-hand under the new tax regime — and which bits this site does not model.",
    h1: "CTC and in-hand salary, without the HR fog",
    description:
      "Cost-to-company is not take-home. This is the split many Indian IT offers use, then the new-regime tax that comes off, with the assumptions written in the open.",
    relatedTools: [
      "ctc-calculator",
      "in-hand-salary",
      "gratuity-calculator",
      "gst-calculator",
    ],
    sections: [
      {
        title: "A common CTC template",
        paragraphs: [
          "Basic as a percent of CTC, HRA as 50% of basic in metro cities (40% otherwise), employer PF at 12% of basic (sometimes capped), gratuity provision around 4.81% of basic, special allowance as the remainder. Gross for in-hand is usually basic + HRA + special — employer PF and gratuity stay in CTC.",
          "Your offer letter can differ on every one of those knobs. The CTC calculator is a template, not the letter.",
        ],
      },
      {
        title: "New regime in-hand",
        paragraphs: [
          "The in-hand page subtracts employee PF, professional tax, and new-regime income tax (standard deduction, rebate toward ₹12 lakh, marginal relief, 4% cess). Old regime, 80C, and HRA exemption are omitted on purpose so the arithmetic stays inspectable. It is not tax advice.",
        ],
      },
    ],
  },
  {
    slug: "cron-expressions",
    path: "/guides/cron-expressions",
    title: "How to Read a Cron Expression",
    metaDescription:
      "Five-field cron (minute hour day month weekday), common gotchas, and a browser generator that never sends the expression to a server.",
    h1: "How to read a cron expression",
    description:
      "Cron looks like noise until you name the five fields. This is the mental model, plus why “every day at 9” is not the same in every engine.",
    relatedTools: ["cron", "unix-timestamp", "timezone-converter"],
    sections: [
      {
        title: "Five fields",
        paragraphs: [
          "Standard unix cron is minute, hour, day-of-month, month, day-of-week. Stars mean any. Commas are lists. Hyphens are ranges. A slash is a step (*/15 in minutes is every quarter hour).",
          "Day-of-month and day-of-week together are the classic trap: some engines OR them, some AND them. Read the man page for the scheduler you actually run (cron, systemd, k8s, a cloud worker).",
        ],
      },
      {
        title: "Generate one locally",
        paragraphs: [
          "The cron generator on this site builds a five-field expression in the browser. It will not know whether your worker uses UTC or IST — pair it with the timezone page if the job must hit an Indian wall clock.",
        ],
      },
    ],
  },
  {
    slug: "income-tax-new-regime",
    path: "/guides/income-tax-new-regime",
    title: "Income Tax New Regime India — Slabs, Rebate, Cess",
    metaDescription:
      "How Budget 2025 new-regime income tax works in India: slabs, §87A rebate to ₹12 lakh, standard deduction, and 4% cess — without uploading numbers.",
    h1: "New-regime income tax, without the fog",
    description:
      "The new regime after Budget 2025 is a short ladder of slabs plus a rebate. This is the mental model behind the calculator on this site.",
    relatedTools: [
      "income-tax-calculator",
      "in-hand-salary",
      "ctc-calculator",
      "hra-calculator",
    ],
    sections: [
      {
        title: "Slabs and the rebate",
        paragraphs: [
          "Taxable income is sliced: 0–4L nil, then 5%, 10%, 15%, 20%, 25%, and 30% above ₹24 lakh. If taxable income is at most ₹12 lakh, §87A rebates income tax to zero. Just above that, marginal relief stops you paying more tax than the rupees over ₹12 lakh until the slab tax is smaller.",
          "A 4% health and education cess sits on top. Surcharge for very high incomes is a separate story and is not modelled on this site’s calculators.",
        ],
      },
      {
        title: "Gross vs taxable",
        paragraphs: [
          "The income tax calculator can take taxable income as-is, or subtract the ₹75,000 standard deduction from gross. The in-hand salary page starts from CTC or monthly gross and also pulls employee PF and professional tax. HRA exemption is old-regime only — use the HRA page for that formula.",
        ],
      },
    ],
  },
  {
    slug: "markdown-to-html",
    path: "/guides/markdown-to-html",
    title: "Markdown to HTML in the Browser",
    metaDescription:
      "Preview markdown as HTML without uploading. What Showdown supports, and why you should not paste untrusted markdown into a client-side preview.",
    h1: "Markdown to HTML, locally",
    description:
      "README drafts and PR descriptions are markdown. A browser preview is enough when you do not want the text on someone else’s server.",
    relatedTools: ["markdown-preview", "html-entities", "text-diff", "xml-formatter"],
    sections: [
      {
        title: "What the preview does",
        paragraphs: [
          "The markdown preview on this site uses Showdown with tables, strikethrough, GFM code blocks, and task lists. The HTML is rendered in the tab and you can copy it out.",
          "It is not a sanitizer. Untrusted markdown can carry script-shaped content. Use it for your own notes.",
        ],
      },
    ],
  },
  {
    slug: "compress-image-to-50kb",
    path: "/guides/compress-image-to-50kb",
    title: "How to Compress an Image to 50 KB",
    metaDescription:
      "Why forms ask for 50 KB photos, how quality search and downscaling work, and how to do it in the browser without uploading.",
    h1: "Compress an image to 50 KB",
    description:
      "Many KYC and job portals cap photo uploads at 50 KB. Hitting that size usually means lowering JPEG quality and, if needed, shrinking the long edge — not just dragging a single slider once.",
    relatedTools: [
      "compress-image-to-50kb",
      "compress-image-to-100kb",
      "compress-image-to-200kb",
      "image-compress",
    ],
    sections: [
      {
        title: "Quality first, then scale",
        paragraphs: [
          "Encoders trade detail for bytes. A binary search on JPEG or WebP quality often gets under 50 KB. If the lowest useful quality is still too large, reduce the long edge and try again.",
          "The compress-to-50KB tool on this site does that loop in your browser and reports the final size before you download. If it cannot reach the cap, it says so instead of handing you an oversize file.",
        ],
      },
      {
        title: "Start from a sensible original",
        paragraphs: [
          "A huge phone photo with heavy noise may never look good at 50 KB. Crop first, prefer JPEG over PNG for photos, and avoid upscaling a soft source.",
        ],
      },
    ],
  },
  {
    slug: "passport-photo-common-sizes",
    path: "/guides/passport-photo-common-sizes",
    title: "Passport Photo Common Sizes (Pixels)",
    metaDescription:
      "Common passport and form photo pixel sizes such as 35×45 mm and 2×2 inch — and why you should still read the form, not a generic claim.",
    h1: "Passport photo common sizes",
    description:
      "Online forms often want a fixed pixel box. This note lists common sizes used on many Indian and US-style forms — not verified official SSC, UPSC, or embassy requirements.",
    relatedTools: [
      "passport-photo",
      "signature-resizer",
      "compress-image-to-50kb",
      "image-crop",
    ],
    sections: [
      {
        title: "Common pixel boxes",
        paragraphs: [
          "35×45 mm at about 300 dpi is roughly 413×531 px. A 2×2 inch square at 300 dpi is about 600×600 px. Tools on this site center-crop to cover that aspect, then resize.",
          "Background color, chin-to-crown height, and print margins are separate rules. Always match the instructions on the form or portal you are filling.",
        ],
      },
      {
        title: "Byte limits after crop",
        paragraphs: [
          "Some portals also cap file size. After you have the right dimensions, use a compress-to-KB tool if the JPEG is still too large.",
        ],
      },
    ],
  },
  {
    slug: "cgpa-to-percentage-caveats",
    path: "/guides/cgpa-to-percentage-caveats",
    title: "CGPA to Percentage — Why Boards Differ",
    metaDescription:
      "Why ×9.5 is only a common rule of thumb for CGPA to percentage, and how to use a custom multiplier from your handbook.",
    h1: "CGPA to percentage caveats",
    description:
      "Percentage = CGPA × multiplier looks simple. The hard part is which multiplier your board or university actually uses.",
    relatedTools: [
      "cgpa-to-percentage",
      "attendance-calculator",
      "percentage-calculator",
      "age-calculator",
    ],
    sections: [
      {
        title: "The ×9.5 habit",
        paragraphs: [
          "A common CBSE-style conversion is percentage = CGPA × 9.5. Many colleges publish a different factor, a grade table, or no single formula at all. Treat ×9.5 as a default estimate unless your mark sheet or handbook says otherwise.",
        ],
      },
      {
        title: "Use the converter carefully",
        paragraphs: [
          "The CGPA tool on this site lets you pick ×9.5 or a custom multiplier. It does not replace an official transcript. For attendance planning, use the attendance calculator separately.",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf-to-200kb",
    path: "/guides/compress-pdf-to-200kb",
    title: "How to Compress a PDF to 200 KB",
    metaDescription:
      "Why portals ask for small PDFs, how in-browser raster compression works, and when 200 KB is unreachable.",
    h1: "Compress a PDF to 200 KB",
    description:
      "Job and KYC uploads often cap PDFs at a few hundred kilobytes. Hitting 200 KB in the browser usually means redrawing pages as JPEG — text will not stay selectable.",
    relatedTools: [
      "compress-pdf-to-200kb",
      "compress-pdf-to-500kb",
      "compress-pdf-to-1mb",
      "compress-pdf",
    ],
    sections: [
      {
        title: "Rasterize on purpose",
        paragraphs: [
          "True lossless PDF recompression is hard in a tab. The tools here draw each page, encode JPEG, and write a new PDF. Scans shrink; contracts become pictures.",
          "The 200 KB tool steps down quality until the size fits or reports failure. Prefer 500 KB or 1 MB when the portal allows it.",
        ],
      },
    ],
  },
  {
    slug: "whatsapp-wa-me-links",
    path: "/guides/whatsapp-wa-me-links",
    title: "WhatsApp wa.me Click-to-Chat Links",
    metaDescription:
      "How wa.me links work, country codes for India, and how to add a pre-filled message or QR without uploading data.",
    h1: "WhatsApp wa.me links",
    description:
      "A wa.me link opens a chat with a number. Add ?text= for a draft message. Useful for business cards, posters, and support pages.",
    relatedTools: [
      "whatsapp-link-generator",
      "qr-code-generator",
      "upi-qr-code-generator",
    ],
    sections: [
      {
        title: "Format",
        paragraphs: [
          "Use digits only after wa.me/ — country code then number, e.g. 91 for India. Ten-digit Indian mobiles can omit the country code in the generator; it adds 91.",
          "Keep messages short if you also print a QR. Dense payloads are harder to scan.",
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getGuidesForTool(toolSlug: string): Guide[] {
  return guides.filter((guide) => guide.relatedTools.includes(toolSlug));
}

export function getIndexableGuidePaths(): string[] {
  return guides.map((guide) => guide.path);
}

export function guideUrl(guide: Guide): string {
  return absoluteUrl(guide.path);
}
