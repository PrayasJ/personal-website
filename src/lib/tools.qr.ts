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
    related: ["upi-qr-code-generator", "whatsapp-link-generator", "url-encoder"],
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
    related: ["qr-code-generator", "whatsapp-link-generator", "gst-calculator"],
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
  {
    slug: "whatsapp-link-generator",
    name: "WhatsApp link generator",
    description:
      "Create a wa.me click-to-chat link with optional message and download a QR.",
    category: "qr",
    keywords: [
      "whatsapp link generator",
      "wa.me link",
      "whatsapp click to chat",
      "whatsapp qr code",
    ],
    path: "/qr/whatsapp-link-generator",
    title: "WhatsApp Link Generator Online — wa.me + QR, Free",
    metaDescription:
      "Generate a WhatsApp wa.me click-to-chat link with a pre-filled message and optional QR PNG. Runs in your browser.",
    h1: "WhatsApp Link Generator",
    intro:
      "Enter a phone number (India 10-digit mobiles get +91) and optional message. Copy the link, open chat, or download a QR. Nothing is uploaded.",
    related: ["qr-code-generator", "upi-qr-code-generator", "url-encoder"],
    popular: true,
    localProcessing: true,
    faqs: [
      {
        question: "Do I need WhatsApp Web?",
        answer:
          "No. The link opens WhatsApp on phone or desktop when the person clicking has WhatsApp installed.",
      },
    ],
    examples: [],
    sections: [
      {
        title: "wa.me format",
        paragraphs: [
          "Links look like https://wa.me/9198XXXXXXXX?text=… with digits-only country code and number. Prefer short messages so the QR stays easy to scan.",
        ],
      },
    ],
  },
];
