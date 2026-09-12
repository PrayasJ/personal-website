import type { Tool } from "@/lib/tools";

export const qrTools: Tool[] = [
  {
    slug: "qr-code-generator",
    name: "QR code generator",
    description: "Generate a QR code for URL, text, or UPI and download a PNG.",
    category: "qr",
    keywords: [
      "qr code generator",
      "create qr code",
      "qr generator online",
      "text to qr",
    ],
    path: "/qr/qr-code-generator",
    title: "QR Code Generator Online — URL, Text, UPI, Free PNG",
    metaDescription:
      "Generate a QR code for a URL, plain text, or UPI payment string in your browser. Download PNG. No upload, no account.",
    h1: "QR Code Generator",
    intro:
      "Type a URL, text, or build a UPI payload, then download a PNG. Encoding runs fully in this tab.",
    related: ["upi-qr-code-generator", "url-encoder", "url-inspector"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Is data sent to a server?",
        answer: "No. The QR is drawn with a client-side library in your browser.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "Payload tips",
        paragraphs: [
          "Keep URLs short when you can — denser QR codes are harder to scan. For UPI, fill payee VPA and optional amount/note fields.",
        ],
      },
    ],
  },
  {
    slug: "upi-qr-code-generator",
    name: "UPI QR code generator",
    description: "Build a UPI payment QR from VPA, amount, and note — download PNG.",
    category: "qr",
    keywords: [
      "upi qr code generator",
      "upi qr",
      "payment qr code",
      "upi id qr",
    ],
    path: "/qr/upi-qr-code-generator",
    title: "UPI QR Code Generator Online — Free PNG, No Upload",
    metaDescription:
      "Generate a UPI payment QR from VPA, name, amount, and note in your browser. Download PNG. No upload.",
    h1: "UPI QR Code Generator",
    intro:
      "Same QR engine as the general generator, with UPI fields selected. Builds a upi://pay string and encodes it locally.",
    related: ["qr-code-generator", "gst-calculator", "emi-calculator"],
    localProcessing: true,
    faqs: [
      {
        question: "Will every UPI app accept this?",
        answer:
          "Most apps scan standard upi://pay links. Merchant-specific QR rules may still apply at checkout.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "UPI string",
        paragraphs: [
          "Fields map to pa (VPA), pn (name), am (amount), and tn (note). Leave amount blank for a flexible collect QR.",
        ],
      },
    ],
  },
];
