import type { Tool } from "@/lib/tools";

export const photoTools: Tool[] = [
  {
    slug: "compress-image-to-50kb",
    name: "Compress image to 50 KB",
    description:
      "Shrink a photo to 50 KB or less in the browser with quality search and downscale.",
    category: "photo",
    keywords: [
      "compress image to 50kb",
      "reduce image to 50kb",
      "image compressor 50kb",
      "photo under 50kb",
    ],
    path: "/photo/compress-image-to-50kb",
    title: "Compress Image to 50 KB Online — No Upload",
    metaDescription:
      "Compress a JPEG or WebP photo to 50 KB or less in your browser. Preview, then download. No upload, no account.",
    h1: "Compress Image to 50 KB",
    intro:
      "Binary-searches encode quality, then downscales if needed, until the file is ≤ 50 KB — or tells you honestly when it cannot.",
    related: [
      "compress-image-to-100kb",
      "compress-image-to-200kb",
      "image-compress",
      "passport-photo",
    ],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is the photo uploaded?",
        answer: "No. Canvas encode runs in this tab only.",
      },
      {
        question: "What if 50 KB is unreachable?",
        answer:
          "Very large or already-noisy images may fail even after downscaling. Try a smaller crop or JPEG instead of PNG.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "How the target works",
        paragraphs: [
          "The tool searches JPEG or WebP quality, then reduces the long edge in steps until the blob fits under 50 KB.",
          "Results vary by browser encoder. Always check the reported byte size before submitting a form.",
        ],
      },
    ],
  },
  {
    slug: "compress-image-to-100kb",
    name: "Compress image to 100 KB",
    description: "Shrink a photo to 100 KB or less in the browser.",
    category: "photo",
    keywords: [
      "compress image to 100kb",
      "reduce image to 100kb",
      "image compressor 100kb",
    ],
    path: "/photo/compress-image-to-100kb",
    title: "Compress Image to 100 KB Online — No Upload",
    metaDescription:
      "Compress a JPEG or WebP photo to 100 KB or less in your browser. Preview, then download. No upload.",
    h1: "Compress Image to 100 KB",
    intro:
      "Same target-byte engine as the 50 KB tool, with a 100 KB cap. Preview before you download.",
    related: [
      "compress-image-to-50kb",
      "compress-image-to-200kb",
      "image-compress",
      "signature-resizer",
    ],
    localProcessing: true,
    faqs: [
      {
        question: "Is the photo uploaded?",
        answer: "No. Processing stays in this tab.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "When to use 100 KB",
        paragraphs: [
          "Many job portals and KYC forms ask for photos under 100 KB. This page aims for that cap without sending the file to a server.",
        ],
      },
    ],
  },
  {
    slug: "compress-image-to-200kb",
    name: "Compress image to 200 KB",
    description: "Shrink a photo to 200 KB or less in the browser.",
    category: "photo",
    keywords: [
      "compress image to 200kb",
      "reduce image to 200kb",
      "image compressor 200kb",
    ],
    path: "/photo/compress-image-to-200kb",
    title: "Compress Image to 200 KB Online — No Upload",
    metaDescription:
      "Compress a JPEG or WebP photo to 200 KB or less in your browser. Preview, then download. No upload.",
    h1: "Compress Image to 200 KB",
    intro:
      "Target-byte compression with a 200 KB limit. Useful when a form allows a bit more headroom than 50–100 KB.",
    related: [
      "compress-image-to-50kb",
      "compress-image-to-100kb",
      "image-compress",
      "images-to-pdf",
    ],
    localProcessing: true,
    faqs: [
      {
        question: "Is the photo uploaded?",
        answer: "No. createImageBitmap and canvas.toBlob run here.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Quality vs size",
        paragraphs: [
          "Larger targets usually keep more detail. If the result still looks soft, start from a sharper original rather than upscaling.",
        ],
      },
    ],
  },
  {
    slug: "passport-photo",
    name: "Passport photo",
    description:
      "Crop and resize a photo to common passport and form sizes in the browser.",
    category: "photo",
    keywords: [
      "passport photo maker",
      "passport size photo",
      "35x45 photo",
      "2x2 photo online",
    ],
    path: "/photo/passport-photo",
    title: "Passport Photo Maker Online — Common Sizes, No Upload",
    metaDescription:
      "Make a passport-style photo at common sizes (35×45 mm, 2×2 in) in your browser. Center-crop, preview, download. Not an official exam checker.",
    h1: "Passport Photo (Common Sizes)",
    intro:
      "Pick a common pixel size, center-crop to fit, then download JPEG. These are common form sizes — not verified official SSC/UPSC requirements.",
    related: [
      "signature-resizer",
      "compress-image-to-50kb",
      "image-crop",
      "image-resize",
    ],
    localProcessing: true,
    faqs: [
      {
        question: "Are these official passport requirements?",
        answer:
          "No. They are common pixel sizes used on many forms. Always check the form or embassy instructions you are filling.",
      },
      {
        question: "Is the photo uploaded?",
        answer: "No. Crop and encode stay in this tab.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Common sizes only",
        paragraphs: [
          "35×45 mm at ~300 dpi and 2×2 inch squares are frequent on Indian and US-style forms. Background color, face height, and print margins are not enforced here.",
          "Use the preview, then confirm download. For byte limits, follow up with a compress-to-KB tool.",
        ],
      },
    ],
  },
  {
    slug: "signature-resizer",
    name: "Signature resizer",
    description:
      "Resize a signature image to common max-edge and max-byte presets.",
    category: "photo",
    keywords: [
      "signature resizer",
      "resize signature online",
      "signature under 20kb",
      "compress signature",
    ],
    path: "/photo/signature-resizer",
    title: "Signature Resizer Online — Common Presets, No Upload",
    metaDescription:
      "Resize a signature scan to common max-edge and KB presets in your browser. Preview, then download. No upload.",
    h1: "Signature Resizer",
    intro:
      "Fit a signature to common max-edge sizes, optionally with a byte cap. Presets are typical form limits — not official exam rules.",
    related: [
      "passport-photo",
      "compress-image-to-50kb",
      "image-resize",
      "image-compress",
    ],
    localProcessing: true,
    faqs: [
      {
        question: "White background?",
        answer:
          "This tool only resizes and optionally recompresses. It does not remove backgrounds.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Presets",
        paragraphs: [
          "Max-edge and under-KB options cover many online form fields. Always match the size your form states.",
        ],
      },
    ],
  },
];
