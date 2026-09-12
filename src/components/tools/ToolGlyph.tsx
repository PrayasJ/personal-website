import type { ReactNode } from "react";

function Mark({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-5 w-5"
    >
      {children}
    </svg>
  );
}

export function ToolGlyph({ slug }: { slug: string }) {
  switch (slug) {
    case "json-formatter":
      return (
        <Mark>
          <path d="M8 5c-2 0-3 1.2-3 3v2c0 1-1 1.5-2 1.5 1 0 2 .5 2 1.5v2c0 1.8 1 3 3 3" />
          <path d="M16 5c2 0 3 1.2 3 3v2c0 1 1 1.5 2 1.5-1 0-2 .5-2 1.5v2c0 1.8-1 3-3 3" />
        </Mark>
      );
    case "tape-trader":
      return (
        <Mark>
          <path d="M6 18V9" />
          <rect x="4.5" y="11" width="3" height="5" rx="0.4" />
          <path d="M12 18V6" />
          <rect x="10.5" y="8" width="3" height="6" rx="0.4" />
          <path d="M18 18V10" />
          <rect x="16.5" y="12" width="3" height="4" rx="0.4" />
        </Mark>
      );
    case "unix-timestamp":
      return (
        <Mark>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.5l3 1.5" />
        </Mark>
      );
    case "json-yaml":
      return (
        <Mark>
          <rect x="4" y="5" width="7" height="14" rx="1.4" />
          <path d="M14 8h6M14 12h6M14 16h4" />
        </Mark>
      );
    case "jwt-decoder":
      return (
        <Mark>
          <rect x="4" y="4.5" width="16" height="4.2" rx="1.2" />
          <rect x="4" y="9.9" width="16" height="4.2" rx="1.2" />
          <rect x="4" y="15.3" width="16" height="4.2" rx="1.2" />
        </Mark>
      );
    case "base64":
      return (
        <Mark>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M8 12h8M10 9h4M10 15h4" />
        </Mark>
      );
    case "url-encoder":
      return (
        <Mark>
          <path d="M10 8.5a4 4 0 0 1 5.7.2l1.6 1.6a4 4 0 0 1-5.6 5.6" />
          <path d="M14 15.5a4 4 0 0 1-5.7-.2L6.7 13.7a4 4 0 0 1 5.6-5.6" />
        </Mark>
      );
    case "uuid-generator":
      return (
        <Mark>
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
        </Mark>
      );
    case "cron":
      return (
        <Mark>
          <rect x="4" y="6" width="16" height="14" rx="2" />
          <path d="M8 4v4M16 4v4M4 11h16" />
          <circle cx="9" cy="15" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="12" cy="15" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="15" cy="15" r="0.8" fill="currentColor" stroke="none" />
        </Mark>
      );
    case "regex-tester":
      return (
        <Mark>
          <path d="M5 7l4 5-4 5" />
          <path d="M12 17h7" />
          <circle cx="15.5" cy="8.5" r="2.2" />
        </Mark>
      );
    case "json-to-go":
      return (
        <Mark>
          <path d="M5 7h6v10H5z" />
          <path d="M13 12h6" />
          <path d="M16.5 8.5L20 12l-3.5 3.5" />
        </Mark>
      );
    case "json-to-ts":
      return (
        <Mark>
          <path d="M8 6v12" />
          <path d="M6 8h4M6 16h4" />
          <path d="M14 12h6" />
          <path d="M17.5 8.5 21 12l-3.5 3.5" />
        </Mark>
      );
    case "hash-generator":
      return (
        <Mark>
          <path d="M9 5v14M15 5v14M5 9h14M5 15h14" />
        </Mark>
      );
    case "url-inspector":
      return (
        <Mark>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16.5 20 20.5" />
        </Mark>
      );
    case "html-entities":
      return (
        <Mark>
          <path d="M8 7 4 12l4 5" />
          <path d="M16 7l4 5-4 5" />
        </Mark>
      );
    case "text-diff":
      return (
        <Mark>
          <path d="M7 5v14M5 12h4" />
          <path d="M15 12h4M17 8v8" />
        </Mark>
      );
    case "case-converter":
      return (
        <Mark>
          <path d="M5 17 9.5 7h1L15 17" />
          <path d="M7 13h6" />
          <path d="M17 11c1.4 0 2.5 1 2.5 2.6S18.4 16.2 17 16.2 14.5 15.2 14.5 13.6 15.6 11 17 11Z" />
        </Mark>
      );
    case "number-base":
      return (
        <Mark>
          <path d="M7 16V8l-2 2" />
          <path d="M12 8v8" />
          <path d="M16 8h4l-4 8h4" />
        </Mark>
      );
    case "password-generator":
      return (
        <Mark>
          <rect x="4" y="10" width="16" height="9" rx="2" />
          <path d="M8 10V8a4 4 0 0 1 8 0v2" />
        </Mark>
      );
    case "csv-json":
      return (
        <Mark>
          <rect x="4" y="5" width="16" height="14" rx="1.6" />
          <path d="M4 10h16M4 14h16M10 5v14M14 5v14" />
        </Mark>
      );
    case "color-converter":
      return (
        <Mark>
          <circle cx="9" cy="10" r="4" />
          <circle cx="15" cy="10" r="4" />
          <circle cx="12" cy="15" r="4" />
        </Mark>
      );
    case "unicode-inspector":
      return (
        <Mark>
          <path d="M6 17V8h2.2c1.8 0 3 1.1 3 2.9S10 13.8 8.2 13.8H6" />
          <path d="M14 9h5M16.5 9v8" />
        </Mark>
      );
    case "hex-utf8":
      return (
        <Mark>
          <path d="M6 8h4M8 8v8M13 8h5M13 12h4M13 16h5" />
        </Mark>
      );
    case "text-tools":
      return (
        <Mark>
          <path d="M5 7h14M5 12h10M5 17h14" />
        </Mark>
      );
    case "timezone-converter":
      return (
        <Mark>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4c2.2 2.4 3.4 5 3.4 8S14.2 17.6 12 20c-2.2-2.4-3.4-5-3.4-8S9.8 6.4 12 4Z" />
          <path d="M4 12h16" />
        </Mark>
      );
    case "emi-calculator":
    case "sip-calculator":
    case "fd-calculator":
    case "ppf-calculator":
    case "rd-calculator":
      return (
        <Mark>
          <path d="M5 19h14" />
          <path d="M7 16 11 9l3 4 4-8" />
        </Mark>
      );
    case "gst-calculator":
    case "percentage-calculator":
      return (
        <Mark>
          <circle cx="8" cy="8" r="2.2" />
          <circle cx="16" cy="16" r="2.2" />
          <path d="M7 17 17 7" />
        </Mark>
      );
    case "gratuity-calculator":
      return (
        <Mark>
          <rect x="5" y="8" width="14" height="11" rx="1.6" />
          <path d="M9 8V7a3 3 0 0 1 6 0v1" />
        </Mark>
      );
    case "ctc-calculator":
    case "in-hand-salary":
    case "income-tax-calculator":
      return (
        <Mark>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M8 10h8M8 14h5" />
        </Mark>
      );
    case "hra-calculator":
      return (
        <Mark>
          <path d="M4 11 12 5l8 6" />
          <path d="M6 10v8h12v-8" />
          <path d="M10 18v-4h4v4" />
        </Mark>
      );
    case "merge-pdf":
    case "split-pdf":
    case "compress-pdf":
    case "compress-pdf-to-100kb":
    case "compress-pdf-to-200kb":
    case "compress-pdf-to-500kb":
    case "compress-pdf-to-1mb":
    case "compress-pdf-to-2mb":
    case "rotate-pdf":
    case "pdf-to-image":
    case "images-to-pdf":
      return (
        <Mark>
          <path d="M7 4h7l4 4v12H7z" />
          <path d="M14 4v4h4" />
          <path d="M9 13h6M9 16h4" />
        </Mark>
      );
    case "image-compress":
    case "image-resize":
    case "image-convert":
    case "image-crop":
    case "favicon-generator":
      return (
        <Mark>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <circle cx="9" cy="11" r="1.6" />
          <path d="M8 16 11 13l3 3 2-2 3 3" />
        </Mark>
      );
    case "go-duration":
      return (
        <Mark>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </Mark>
      );
    case "byte-size":
      return (
        <Mark>
          <path d="M5 18h14M7 14h10M9 10h6M11 6h2" />
        </Mark>
      );
    case "query-string":
      return (
        <Mark>
          <circle cx="8" cy="8" r="2.4" />
          <path d="M10 10.5 14.5 15" />
          <path d="M15 8h5M15 12h5M15 16h4" />
        </Mark>
      );
    case "ulid-generator":
      return (
        <Mark>
          <rect x="3.5" y="7" width="8" height="10" rx="1.4" />
          <rect x="12.5" y="7" width="8" height="10" rx="1.4" />
        </Mark>
      );
    case "http-status":
      return (
        <Mark>
          <path d="M7 15 12 5l5 10" />
          <path d="M9 15h6" />
        </Mark>
      );
    case "markdown-preview":
      return (
        <Mark>
          <path d="M5 7h14v10H5z" />
          <path d="M7 14V9l2.5 3L12 9v5M14 14v-2.5M14 11.5 16.5 9 19 11.5V14" />
        </Mark>
      );
    case "xml-formatter":
      return (
        <Mark>
          <path d="M8 5c-2 0-3 1.2-3 3v2c0 1-1 1.5-2 1.5 1 0 2 .5 2 1.5v2c0 1.8 1 3 3 3" />
          <path d="M16 5c2 0 3 1.2 3 3v2c0 1 1 1.5 2 1.5-1 0-2 .5-2 1.5v2c0 1.8-1 3-3 3" />
        </Mark>
      );
    case "sql-formatter":
      return (
        <Mark>
          <ellipse cx="12" cy="7" rx="7" ry="2.5" />
          <path d="M5 7v5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V7" />
          <path d="M5 12v5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-5" />
        </Mark>
      );
    case "compress-image-to-40kb":
    case "compress-image-to-50kb":
    case "compress-image-to-100kb":
    case "compress-image-to-200kb":
    case "compress-image-to-300kb":
      return (
        <Mark>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 14l2.5-3 2 2 3.5-4.5" />
          <path d="M15 17H9" />
        </Mark>
      );
    case "passport-photo":
      return (
        <Mark>
          <rect x="6" y="3.5" width="12" height="17" rx="1.5" />
          <circle cx="12" cy="9" r="2.2" />
          <path d="M8.5 16.5c1-2 2.2-3 3.5-3s2.5 1 3.5 3" />
        </Mark>
      );
    case "signature-resizer":
      return (
        <Mark>
          <path d="M5 16c2-4 4-6 7-6s5 2 7 6" />
          <path d="M7 18h10" />
        </Mark>
      );
    case "cgpa-to-percentage":
      return (
        <Mark>
          <path d="M7 17V7l5 6 5-6v10" />
        </Mark>
      );
    case "attendance-calculator":
      return (
        <Mark>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 9h8M8 12h5M8 15h3" />
        </Mark>
      );
    case "age-calculator":
      return (
        <Mark>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.5l3 1.5" />
        </Mark>
      );
    case "qr-code-generator":
    case "upi-qr-code-generator":
      return (
        <Mark>
          <rect x="4" y="4" width="7" height="7" rx="1" />
          <rect x="13" y="4" width="7" height="7" rx="1" />
          <rect x="4" y="13" width="7" height="7" rx="1" />
          <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM17 17h3v3" />
        </Mark>
      );
    case "whatsapp-link-generator":
      return (
        <Mark>
          <path d="M6 8.5c0-3 2.7-5 6-5s6 2 6 5-2.7 5-6 5c-.7 0-1.4-.1-2-.3L6 16l1.2-3.2C6.4 11.8 6 10.2 6 8.5z" />
        </Mark>
      );
    case "rent-receipt":
      return (
        <Mark>
          <path d="M6 4h9l3 3v13H6z" />
          <path d="M15 4v3h3M8 11h8M8 14h6M8 17h4" />
        </Mark>
      );
    case "number-to-words":
      return (
        <Mark>
          <path d="M7 16V8l4 5 4-5v8" />
        </Mark>
      );
    case "gst-invoice":
      return (
        <Mark>
          <path d="M6 4h9l3 3v13H6z" />
          <path d="M15 4v3h3M8 11h8M8 14h5M8 17h6" />
        </Mark>
      );
    default:
      return (
        <Mark>
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M9 12h6" />
        </Mark>
      );
  }
}
