import type { Tool } from "@/lib/tools";

export const imageTools: Tool[] = [
  {
    slug: "image-compress",
    name: "Compress image",
    description: "Shrink PNG, JPEG, or WebP in the browser with a quality slider.",
    category: "image",
    keywords: ["compress image", "jpeg quality", "webp", "reduce image size", "compress image online"],
    path: "/image/image-compress",
    title: "Compress Image Online — JPEG, WebP, PNG, No Upload",
    metaDescription:
      "Compress JPEG, WebP, or PNG in your browser. Cap the long edge, set quality, preview, download. No upload, no account.",
    h1: "Compress Image Online",
    intro:
      "Optional max edge, then a lossy encode. PNG is rewritten without a quality knob. The file stays in this tab.",
    related: ["image-convert", "image-resize", "image-crop"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is the image uploaded?",
        answer: "No. createImageBitmap and canvas.toBlob run here.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Encoders",
        paragraphs: [
          "JPEG and WebP quality is whatever this browser implements. Safari, Firefox, and Chrome will not bit-match.",
        ],
      },
    ],
  },
  {
    slug: "image-resize",
    name: "Resize image",
    description: "Resize an image with optional locked aspect ratio, locally.",
    category: "image",
    keywords: ["resize image", "scale image", "image dimensions", "resize image online"],
    path: "/image/image-resize",
    title: "Resize Image Online — PNG, JPEG, WebP in the Browser",
    metaDescription:
      "Resize PNG, JPEG, or WebP in your browser. Lock aspect ratio, preview, then download. No upload.",
    h1: "Resize Image Online",
    intro:
      "Set width and height. Lock aspect to keep the original ratio. High-quality canvas smoothing.",
    related: ["image-crop", "image-compress", "image-convert"],
    localProcessing: true,
    faqs: [
      {
        question: "Upscaling?",
        answer: "Allowed, and it will look soft. 8192 px is the cap on each side.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Smoothing",
        paragraphs: [
          "The canvas uses imageSmoothingQuality high. It is not a dedicated super-resolution model.",
        ],
      },
    ],
  },
  {
    slug: "image-convert",
    name: "Convert image",
    description: "Convert between PNG, JPEG, and WebP in the browser.",
    category: "image",
    keywords: ["png to jpg", "jpg to webp", "convert image", "png to webp"],
    path: "/image/image-convert",
    title: "Convert Image Online — PNG, JPEG, WebP, No Upload",
    metaDescription:
      "Convert images between PNG, JPEG, and WebP in your browser. No upload. Animated GIFs become a still frame.",
    h1: "Convert PNG / JPEG / WebP",
    intro:
      "Decode, then encode as PNG, JPEG, or WebP. Animated GIFs become a still frame.",
    related: ["image-compress", "favicon-generator", "image-resize"],
    localProcessing: true,
    faqs: [
      {
        question: "Transparency?",
        answer: "PNG and WebP keep alpha. JPEG does not — transparent pixels become the canvas backdrop (black).",
      },
    ],
    examples: [],
    sections: [
      {
        title: "GIF",
        paragraphs: [
          "The browser draws one frame. This is not a GIF editor.",
        ],
      },
    ],
  },
  {
    slug: "image-crop",
    name: "Crop image",
    description: "Drag a crop rectangle and export PNG, JPEG, or WebP locally.",
    category: "image",
    keywords: ["crop image", "trim image", "crop png", "crop image online"],
    path: "/image/image-crop",
    title: "Crop Image Online — Drag or Type Pixels, No Upload",
    metaDescription:
      "Crop an image in your browser. Drag the rectangle or type pixels, then confirm download. No upload.",
    h1: "Crop Image Online",
    intro:
      "Drag on the preview or type x, y, width, height in source pixels.",
    related: ["image-resize", "image-compress", "favicon-generator"],
    localProcessing: true,
    faqs: [
      {
        question: "Retina?",
        answer:
          "The crop is in image pixels, not CSS pixels. The download matches the source resolution.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Coordinates",
        paragraphs: [
          "Origin is the top-left of the bitmap. Values outside the image are clamped.",
        ],
      },
    ],
  },
  {
    slug: "favicon-generator",
    name: "Favicon generator",
    description: "Build a 16/32/48 ICO and a 180px Apple touch PNG in the browser.",
    category: "image",
    keywords: ["favicon", "ico", "apple-touch-icon", "favicon generator"],
    path: "/image/favicon-generator",
    title: "Favicon Generator Online — ICO + Apple Touch Icon",
    metaDescription:
      "Generate a multi-size .ico (16/32/48) and a 180px apple-touch-icon PNG in your browser. No upload.",
    h1: "Favicon Generator",
    intro:
      "The ICO contains 16, 32, and 48 px PNG frames. Download a 180 px PNG separately for Apple touch icons.",
    related: ["image-resize", "image-convert", "image-crop"],
    localProcessing: true,
    faqs: [
      {
        question: "Non-square source?",
        answer: "It is stretched to a square. Crop first if you care about composition.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "ICO",
        paragraphs: [
          "The file is an ICO container of PNG images, which current browsers accept as favicon.ico.",
        ],
      },
    ],
  },
];
