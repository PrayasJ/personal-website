import type { Tool } from "@/lib/tools";

export const pdfTools: Tool[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description: "Combine PDFs in your browser. Files never leave this tab.",
    category: "pdf",
    keywords: ["merge pdf", "combine pdf", "join pdf", "merge pdf online", "pdf-lib"],
    path: "/pdf/merge-pdf",
    title: "Merge PDF Online Free — Combine PDFs in Browser, No Upload",
    metaDescription:
      "Merge PDF files in your browser with pdf-lib. No upload, no account. Reorder pages, preview, then download one file.",
    h1: "Merge PDF Online",
    intro:
      "Drop two or more PDFs, order them, merge. pdf-lib runs in this tab. Encrypted files are not supported.",
    related: ["merge-pdf", "rotate-pdf", "images-to-pdf"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is the PDF uploaded?",
        answer: "No. The file is read with the File API and merged in JavaScript.",
      },
      {
        question: "Password-protected PDFs?",
        answer: "They fail on purpose. Decrypt them locally first.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "How it works",
        paragraphs: [
          "Each file is loaded with pdf-lib. Pages are copied into a new document in list order. The download is a fresh PDF, not a rewrite of your originals.",
        ],
      },
    ],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Extract a page range into a new PDF in the browser.",
    category: "pdf",
    keywords: ["split pdf", "extract pages", "pdf range", "split pdf online"],
    path: "/pdf/split-pdf",
    title: "Split PDF Online — Extract Pages in Your Browser",
    metaDescription:
      "Extract PDF pages by range (1-3,5) in your browser. No upload. Download a new file; the source stays on your machine.",
    h1: "Split PDF Online",
    intro:
      "Keep 1-3,5,8-10 as one file. The source stays on your machine.",
    related: ["merge-pdf", "rotate-pdf", "pdf-to-image"],
    localProcessing: true,
    faqs: [
      {
        question: "One PDF per page?",
        answer:
          "This page extracts into a single PDF. Run it once per range if you need several files.",
      },
    ],
    examples: [{ title: "Range", code: "1-3,5,8-10" }],
    sections: [
      {
        title: "Ranges",
        paragraphs: [
          "Pages are 1-indexed. Commas separate tokens. A hyphen is an inclusive span. all means every page.",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description: "Rasterize PDF pages to JPEG to shrink scans in the browser.",
    category: "pdf",
    keywords: ["compress pdf", "reduce pdf size", "pdf jpeg", "compress pdf online"],
    path: "/pdf/compress-pdf",
    title: "Compress PDF Online — Shrink Scans in Your Browser",
    metaDescription:
      "Compress a PDF by rasterizing pages to JPEG in your browser. No upload. Best for scans; vector text becomes an image.",
    h1: "Compress PDF Online",
    intro:
      "Each page is drawn, JPEG-encoded, and placed in a new PDF. That is honest in-browser compression: scans shrink; sharp vector text will look like a picture.",
    related: ["compress-pdf-to-100kb", "compress-pdf-to-200kb", "pdf-to-image", "merge-pdf"],
    localProcessing: true,
    faqs: [
      {
        question: "Will text stay selectable?",
        answer: "No. This method paints pixels. Use it on scans, not on contracts you still need to search.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Why rasterize",
        paragraphs: [
          "pdf-lib cannot recompress arbitrary embedded images well. Drawing pages with PDF.js and writing JPEGs is the method that actually reduces size here.",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf-to-100kb",
    name: "Compress PDF to 100 KB",
    description: "Shrink a PDF to 100 KB or less by rasterizing pages in the browser.",
    category: "pdf",
    keywords: [
      "compress pdf to 100kb",
      "reduce pdf to 100kb",
      "pdf under 100kb",
    ],
    path: "/pdf/compress-pdf-to-100kb",
    title: "Compress PDF to 100 KB Online — No Upload",
    metaDescription:
      "Compress a PDF to 100 KB or less in your browser by rasterizing pages. Preview, then download. No upload.",
    h1: "Compress PDF to 100 KB",
    intro:
      "Aggressive target-byte compression for portals that demand ~100 KB. Best for short scans; multi-page photo PDFs may fail honestly.",
    related: [
      "compress-pdf-to-200kb",
      "compress-pdf-to-500kb",
      "compress-pdf",
      "compress-image-to-50kb",
    ],
    localProcessing: true,
    faqs: [
      {
        question: "Is the PDF uploaded?",
        answer: "No. PDF.js and pdf-lib run in this tab.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Tight PDF caps",
        paragraphs: [
          "100 KB is hard for long documents. Split pages first, or try the 200 KB / 500 KB tools.",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf-to-200kb",
    name: "Compress PDF to 200 KB",
    description: "Shrink a PDF to 200 KB or less by rasterizing pages in the browser.",
    category: "pdf",
    keywords: [
      "compress pdf to 200kb",
      "reduce pdf to 200kb",
      "pdf compressor 200kb",
    ],
    path: "/pdf/compress-pdf-to-200kb",
    title: "Compress PDF to 200 KB Online — No Upload",
    metaDescription:
      "Compress a PDF to 200 KB or less in your browser by rasterizing pages. Preview, then download. No upload.",
    h1: "Compress PDF to 200 KB",
    intro:
      "Tries progressively stronger JPEG raster settings until the file is ≤ 200 KB — or says when it cannot. Best for scans and photo PDFs.",
    related: [
      "compress-pdf-to-100kb",
      "compress-pdf-to-500kb",
      "compress-pdf-to-1mb",
      "compress-pdf-to-2mb",
    ],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is the PDF uploaded?",
        answer: "No. PDF.js and pdf-lib run in this tab.",
      },
      {
        question: "Will text stay selectable?",
        answer: "No. Pages become JPEG images inside a new PDF.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Target size",
        paragraphs: [
          "Portals often ask for PDFs under a few hundred KB. This page aims for 200 KB. Multi-page photo scans may still fail — try fewer pages or the 500 KB / 1 MB tools.",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf-to-500kb",
    name: "Compress PDF to 500 KB",
    description: "Shrink a PDF to 500 KB or less in the browser.",
    category: "pdf",
    keywords: [
      "compress pdf to 500kb",
      "reduce pdf to 500kb",
      "pdf under 500kb",
    ],
    path: "/pdf/compress-pdf-to-500kb",
    title: "Compress PDF to 500 KB Online — No Upload",
    metaDescription:
      "Compress a PDF to 500 KB or less in your browser. Preview pages, then download. No upload.",
    h1: "Compress PDF to 500 KB",
    intro:
      "Same target-byte engine as the 200 KB tool, with a 500 KB cap. Useful when portals allow a bit more headroom.",
    related: [
      "compress-pdf-to-200kb",
      "compress-pdf-to-1mb",
      "compress-pdf",
      "images-to-pdf",
    ],
    localProcessing: true,
    faqs: [
      {
        question: "Is the PDF uploaded?",
        answer: "No. Processing stays in this tab.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "When to use 500 KB",
        paragraphs: [
          "Many job and KYC uploads accept half a megabyte. Prefer this over aggressive 200 KB when you need clearer scans.",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf-to-1mb",
    name: "Compress PDF to 1 MB",
    description: "Shrink a PDF to 1 MB or less in the browser.",
    category: "pdf",
    keywords: [
      "compress pdf to 1mb",
      "reduce pdf to 1mb",
      "pdf under 1mb",
    ],
    path: "/pdf/compress-pdf-to-1mb",
    title: "Compress PDF to 1 MB Online — No Upload",
    metaDescription:
      "Compress a PDF to 1 MB or less in your browser. Preview, then download. No upload.",
    h1: "Compress PDF to 1 MB",
    intro:
      "Target-byte PDF compression with a 1 MB limit. If the file is already under 1 MB, you can download it as-is.",
    related: [
      "compress-pdf-to-100kb",
      "compress-pdf-to-200kb",
      "compress-pdf-to-1mb",
      "compress-pdf-to-2mb",
    ],
    localProcessing: true,
    faqs: [
      {
        question: "Already under 1 MB?",
        answer: "The tool detects that and offers the original bytes without re-encoding.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Quality ladder",
        paragraphs: [
          "Scale and JPEG quality step down until the cap is met. Very large multi-page photo PDFs may still miss the target.",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf-to-2mb",
    name: "Compress PDF to 2 MB",
    description: "Shrink a PDF to 2 MB or less in the browser.",
    category: "pdf",
    keywords: [
      "compress pdf to 2mb",
      "reduce pdf to 2mb",
      "pdf under 2mb",
    ],
    path: "/pdf/compress-pdf-to-2mb",
    title: "Compress PDF to 2 MB Online — No Upload",
    metaDescription:
      "Compress a PDF to 2 MB or less in your browser. Preview, then download. No upload.",
    h1: "Compress PDF to 2 MB",
    intro:
      "A higher byte cap for longer scans. If the file is already under 2 MB, you can download it as-is.",
    related: [
      "compress-pdf-to-200kb",
      "compress-pdf-to-500kb",
      "compress-pdf-to-1mb",
      "compress-pdf",
    ],
    localProcessing: true,
    faqs: [
      {
        question: "Is text selectable after compress?",
        answer: "No. Pages are rasterized to JPEG inside a new PDF.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "When to use 2 MB",
        paragraphs: [
          "Email and portal limits often sit at 2 MB. Prefer this over 100–200 KB when you need clearer pages.",
        ],
      },
    ],
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate selected PDF pages 90, 180, or 270 degrees locally.",
    category: "pdf",
    keywords: ["rotate pdf", "pdf orientation", "landscape", "rotate pdf online"],
    path: "/pdf/rotate-pdf",
    title: "Rotate PDF Online — 90, 180, 270 in the Browser",
    metaDescription:
      "Rotate PDF pages clockwise in your browser. All pages or a range. No upload — pdf-lib sets the page rotate flag.",
    h1: "Rotate PDF Online",
    intro:
      "Clockwise 90, 180, or 270 on all pages or a range. The file is not sent anywhere.",
    related: ["split-pdf", "merge-pdf", "compress-pdf"],
    localProcessing: true,
    faqs: [
      {
        question: "Does rotation flatten the PDF?",
        answer: "No. pdf-lib sets the page rotate attribute. Content streams stay.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Page rotate",
        paragraphs: [
          "The PDF page rotate key is incremented modulo 360. Viewers honour that. Printers usually do too.",
        ],
      },
    ],
  },
  {
    slug: "pdf-to-image",
    name: "PDF to image",
    description: "Render PDF pages to PNG, JPEG, or WebP in the browser.",
    category: "pdf",
    keywords: ["pdf to png", "pdf to jpg", "pdf to image", "pdf render"],
    path: "/pdf/pdf-to-image",
    title: "PDF to Image Online — PNG, JPEG, WebP, No Upload",
    metaDescription:
      "Convert PDF pages to PNG, JPEG, or WebP in your browser with PDF.js. No upload. Pick pages and scale, then confirm download.",
    h1: "PDF to PNG / JPEG / WebP",
    intro:
      "Pick pages and a scale. PDF.js draws onto a canvas; the canvas encodes the image. Multiple pages download one after another.",
    related: ["compress-pdf", "split-pdf", "images-to-pdf"],
    localProcessing: true,
    faqs: [
      {
        question: "What is scale 2?",
        answer: "PDF.js treats 1 as 72 dpi. 2 is roughly 144 dpi. Large pages at high scale can exhaust memory.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Rendering",
        paragraphs: [
          "The worker is a local copy of pdf.worker.min.mjs. Page bytes never go to a conversion API.",
        ],
      },
    ],
  },
  {
    slug: "images-to-pdf",
    name: "Images to PDF",
    description: "Combine PNG, JPEG, or WebP images into one PDF in the browser.",
    category: "pdf",
    keywords: [
      "images to pdf",
      "jpg to pdf",
      "png to pdf",
      "convert images to pdf",
    ],
    path: "/pdf/images-to-pdf",
    title: "Images to PDF Online — PNG, JPEG, WebP, No Upload",
    metaDescription:
      "Convert images to a PDF in your browser. PNG, JPEG, WebP. Reorder pages, preview, confirm download. No upload.",
    h1: "Images to PDF",
    intro:
      "Drop images, set the page order, build a PDF with pdf-lib. Each image is one page at its pixel size. Preview, then confirm download. Nothing is uploaded.",
    related: ["merge-pdf", "pdf-to-image", "image-convert"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is WebP supported?",
        answer:
          "Yes. WebP is drawn to a canvas and embedded as PNG or JPEG. Animated WebP becomes a still frame.",
      },
      {
        question: "Are the images uploaded?",
        answer: "No. Files stay in this tab until you download the PDF.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Page size",
        paragraphs: [
          "Each page matches the image pixel dimensions. For a fixed A4 layout you would need a different tool; this one keeps the bitmap size.",
        ],
      },
    ],
  },
];
