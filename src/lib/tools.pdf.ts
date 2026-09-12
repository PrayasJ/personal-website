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
    related: ["split-pdf", "rotate-pdf", "compress-pdf"],
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
    related: ["pdf-to-image", "merge-pdf", "split-pdf"],
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
    related: ["compress-pdf", "split-pdf", "image-compress"],
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
];
