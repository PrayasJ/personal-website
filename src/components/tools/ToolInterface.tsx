import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyNamed(loader: () => Promise<Record<string, ComponentType<any>>>, exportName: string) {
  return dynamic(() =>
    loader().then((mod) => {
      const Comp = mod[exportName];
      if (!Comp) {
        throw new Error(`Missing export ${exportName}`);
      }
      return Comp;
    }),
  );
}

const JsonFormatter = lazyNamed(
  () => import("@/components/tools/json-formatter/JsonFormatter"),
  "JsonFormatter",
);
const DeskGame = lazyNamed(() => import("@/components/desk/DeskGame"), "DeskGame");
const JsonYaml = lazyNamed(
  () => import("@/components/tools/json-yaml/JsonYaml"),
  "JsonYaml",
);
const JwtDecoder = lazyNamed(
  () => import("@/components/tools/jwt-decoder/JwtDecoder"),
  "JwtDecoder",
);
const Base64Tool = lazyNamed(
  () => import("@/components/tools/base64/Base64Tool"),
  "Base64Tool",
);
const UrlEncoder = lazyNamed(
  () => import("@/components/tools/url-encoder/UrlEncoder"),
  "UrlEncoder",
);
const UuidGenerator = lazyNamed(
  () => import("@/components/tools/uuid-generator/UuidGenerator"),
  "UuidGenerator",
);
const CronBuilder = lazyNamed(
  () => import("@/components/tools/cron/CronBuilder"),
  "CronBuilder",
);
const RegexTester = lazyNamed(
  () => import("@/components/tools/regex-tester/RegexTester"),
  "RegexTester",
);
const JsonToGo = lazyNamed(
  () => import("@/components/tools/json-to-go/JsonToGo"),
  "JsonToGo",
);
const HashTool = lazyNamed(
  () => import("@/components/tools/hash/HashTool"),
  "HashTool",
);
const UrlInspector = lazyNamed(
  () => import("@/components/tools/url-inspector/UrlInspector"),
  "UrlInspector",
);
const HtmlEntities = lazyNamed(
  () => import("@/components/tools/html-entities/HtmlEntities"),
  "HtmlEntities",
);
const TextDiff = lazyNamed(
  () => import("@/components/tools/text-diff/TextDiff"),
  "TextDiff",
);
const CaseConverter = lazyNamed(
  () => import("@/components/tools/case-converter/CaseConverter"),
  "CaseConverter",
);
const NumberBase = lazyNamed(
  () => import("@/components/tools/number-base/NumberBase"),
  "NumberBase",
);
const PasswordGenerator = lazyNamed(
  () => import("@/components/tools/password-generator/PasswordGenerator"),
  "PasswordGenerator",
);
const CsvJson = lazyNamed(
  () => import("@/components/tools/csv-json/CsvJson"),
  "CsvJson",
);
const ColorConverter = lazyNamed(
  () => import("@/components/tools/color-converter/ColorConverter"),
  "ColorConverter",
);
const UnicodeInspector = lazyNamed(
  () => import("@/components/tools/unicode/UnicodeInspector"),
  "UnicodeInspector",
);
const HexUtf8 = lazyNamed(
  () => import("@/components/tools/hex-utf8/HexUtf8"),
  "HexUtf8",
);
const TextTools = lazyNamed(
  () => import("@/components/tools/text-tools/TextTools"),
  "TextTools",
);
const TimezoneConverter = lazyNamed(
  () => import("@/components/tools/timezone/TimezoneConverter"),
  "TimezoneConverter",
);
const JsonToTs = lazyNamed(
  () => import("@/components/tools/json-to-ts/JsonToTs"),
  "JsonToTs",
);
const GoDuration = lazyNamed(
  () => import("@/components/tools/go-duration/GoDuration"),
  "GoDuration",
);
const ByteSize = lazyNamed(
  () => import("@/components/tools/byte-size/ByteSize"),
  "ByteSize",
);
const QueryString = lazyNamed(
  () => import("@/components/tools/query-string/QueryString"),
  "QueryString",
);
const UlidGenerator = lazyNamed(
  () => import("@/components/tools/ulid-generator/UlidGenerator"),
  "UlidGenerator",
);
const HttpStatus = lazyNamed(
  () => import("@/components/tools/http-status/HttpStatus"),
  "HttpStatus",
);
const EmiCalculator = lazyNamed(
  () => import("@/components/tools/emi/EmiCalculator"),
  "EmiCalculator",
);
const SipCalculator = lazyNamed(
  () => import("@/components/tools/sip/SipCalculator"),
  "SipCalculator",
);
const FdCalculator = lazyNamed(
  () => import("@/components/tools/fd/FdCalculator"),
  "FdCalculator",
);
const GstCalculator = lazyNamed(
  () => import("@/components/tools/gst/GstCalculator"),
  "GstCalculator",
);
const PercentageCalculator = lazyNamed(
  () => import("@/components/tools/percentage/PercentageCalculator"),
  "PercentageCalculator",
);
const PpfCalculator = lazyNamed(
  () => import("@/components/tools/ppf/PpfCalculator"),
  "PpfCalculator",
);
const RdCalculator = lazyNamed(
  () => import("@/components/tools/rd/RdCalculator"),
  "RdCalculator",
);
const GratuityCalculator = lazyNamed(
  () => import("@/components/tools/gratuity/GratuityCalculator"),
  "GratuityCalculator",
);
const CtcCalculator = lazyNamed(
  () => import("@/components/tools/ctc/CtcCalculator"),
  "CtcCalculator",
);
const InHandSalary = lazyNamed(
  () => import("@/components/tools/in-hand/InHandSalary"),
  "InHandSalary",
);
const PdfMerge = lazyNamed(
  () => import("@/components/tools/pdf-merge/PdfMerge"),
  "PdfMerge",
);
const PdfSplit = lazyNamed(
  () => import("@/components/tools/pdf-split/PdfSplit"),
  "PdfSplit",
);
const PdfCompress = lazyNamed(
  () => import("@/components/tools/pdf-compress/PdfCompress"),
  "PdfCompress",
);
const PdfRotate = lazyNamed(
  () => import("@/components/tools/pdf-rotate/PdfRotate"),
  "PdfRotate",
);
const PdfToImage = lazyNamed(
  () => import("@/components/tools/pdf-to-image/PdfToImage"),
  "PdfToImage",
);
const ImageCompress = lazyNamed(
  () => import("@/components/tools/image-compress/ImageCompress"),
  "ImageCompress",
);
const ImageResize = lazyNamed(
  () => import("@/components/tools/image-resize/ImageResize"),
  "ImageResize",
);
const ImageConvert = lazyNamed(
  () => import("@/components/tools/image-convert/ImageConvert"),
  "ImageConvert",
);
const ImageCrop = lazyNamed(
  () => import("@/components/tools/image-crop/ImageCrop"),
  "ImageCrop",
);
const FaviconGenerator = lazyNamed(
  () => import("@/components/tools/favicon/FaviconGenerator"),
  "FaviconGenerator",
);
const IncomeTaxCalculator = lazyNamed(
  () => import("@/components/tools/income-tax/IncomeTaxCalculator"),
  "IncomeTaxCalculator",
);
const HraCalculator = lazyNamed(
  () => import("@/components/tools/hra/HraCalculator"),
  "HraCalculator",
);
const MarkdownPreview = lazyNamed(
  () => import("@/components/tools/markdown-preview/MarkdownPreview"),
  "MarkdownPreview",
);
const XmlFormatter = lazyNamed(
  () => import("@/components/tools/xml-formatter/XmlFormatter"),
  "XmlFormatter",
);
const SqlFormatter = lazyNamed(
  () => import("@/components/tools/sql-formatter/SqlFormatter"),
  "SqlFormatter",
);
const ImagesToPdf = lazyNamed(
  () => import("@/components/tools/images-to-pdf/ImagesToPdf"),
  "ImagesToPdf",
);
const TargetCompress = lazyNamed(
  () => import("@/components/tools/target-compress/TargetCompress"),
  "TargetCompress",
);
const PassportPhoto = lazyNamed(
  () => import("@/components/tools/passport-photo/PassportPhoto"),
  "PassportPhoto",
);
const SignatureResizer = lazyNamed(
  () => import("@/components/tools/signature-resizer/SignatureResizer"),
  "SignatureResizer",
);
const CgpaToPercentage = lazyNamed(
  () => import("@/components/tools/cgpa/CgpaToPercentage"),
  "CgpaToPercentage",
);
const AttendanceCalculator = lazyNamed(
  () => import("@/components/tools/attendance/AttendanceCalculator"),
  "AttendanceCalculator",
);
const AgeCalculator = lazyNamed(
  () => import("@/components/tools/age/AgeCalculator"),
  "AgeCalculator",
);
const QrGenerator = lazyNamed(
  () => import("@/components/tools/qr/QrGenerator"),
  "QrGenerator",
);
const TargetPdfCompress = lazyNamed(
  () => import("@/components/tools/target-pdf-compress/TargetPdfCompress"),
  "TargetPdfCompress",
);
const WhatsAppLinkGenerator = lazyNamed(
  () => import("@/components/tools/whatsapp/WhatsAppLinkGenerator"),
  "WhatsAppLinkGenerator",
);
const RentReceipt = lazyNamed(
  () => import("@/components/tools/rent-receipt/RentReceipt"),
  "RentReceipt",
);
const NumberToWords = lazyNamed(
  () => import("@/components/tools/number-to-words/NumberToWords"),
  "NumberToWords",
);
const GstInvoice = lazyNamed(
  () => import("@/components/tools/gst-invoice/GstInvoice"),
  "GstInvoice",
);
const UnixTimestamp = lazyNamed(
  () => import("@/components/tools/unix-timestamp/UnixTimestamp"),
  "UnixTimestamp",
);

export function ToolInterface({ slug }: { slug: string }) {
  switch (slug) {
    case "json-formatter":
      return <JsonFormatter />;
    case "tape-trader":
      return <DeskGame variant="full" />;
    case "unix-timestamp":
      return <UnixTimestamp />;
    case "json-yaml":
      return <JsonYaml />;
    case "jwt-decoder":
      return <JwtDecoder />;
    case "base64":
      return <Base64Tool />;
    case "url-encoder":
      return <UrlEncoder />;
    case "uuid-generator":
      return <UuidGenerator />;
    case "cron":
      return <CronBuilder />;
    case "regex-tester":
      return <RegexTester />;
    case "json-to-go":
      return <JsonToGo />;
    case "hash-generator":
      return <HashTool />;
    case "url-inspector":
      return <UrlInspector />;
    case "html-entities":
      return <HtmlEntities />;
    case "text-diff":
      return <TextDiff />;
    case "case-converter":
      return <CaseConverter />;
    case "number-base":
      return <NumberBase />;
    case "password-generator":
      return <PasswordGenerator />;
    case "csv-json":
      return <CsvJson />;
    case "color-converter":
      return <ColorConverter />;
    case "unicode-inspector":
      return <UnicodeInspector />;
    case "hex-utf8":
      return <HexUtf8 />;
    case "text-tools":
      return <TextTools />;
    case "timezone-converter":
      return <TimezoneConverter />;
    case "json-to-ts":
      return <JsonToTs />;
    case "go-duration":
      return <GoDuration />;
    case "byte-size":
      return <ByteSize />;
    case "query-string":
      return <QueryString />;
    case "ulid-generator":
      return <UlidGenerator />;
    case "http-status":
      return <HttpStatus />;
    case "emi-calculator":
      return <EmiCalculator />;
    case "sip-calculator":
      return <SipCalculator />;
    case "fd-calculator":
      return <FdCalculator />;
    case "gst-calculator":
      return <GstCalculator />;
    case "percentage-calculator":
      return <PercentageCalculator />;
    case "ppf-calculator":
      return <PpfCalculator />;
    case "rd-calculator":
      return <RdCalculator />;
    case "gratuity-calculator":
      return <GratuityCalculator />;
    case "ctc-calculator":
      return <CtcCalculator />;
    case "in-hand-salary":
      return <InHandSalary />;
    case "income-tax-calculator":
      return <IncomeTaxCalculator />;
    case "hra-calculator":
      return <HraCalculator />;
    case "merge-pdf":
      return <PdfMerge />;
    case "split-pdf":
      return <PdfSplit />;
    case "compress-pdf":
      return <PdfCompress />;
    case "compress-pdf-to-100kb":
      return <TargetPdfCompress maxBytes={100 * 1024} label="100 KB" />;
    case "compress-pdf-to-200kb":
      return <TargetPdfCompress maxBytes={200 * 1024} label="200 KB" />;
    case "compress-pdf-to-500kb":
      return <TargetPdfCompress maxBytes={500 * 1024} label="500 KB" />;
    case "compress-pdf-to-1mb":
      return <TargetPdfCompress maxBytes={1024 * 1024} label="1 MB" />;
    case "compress-pdf-to-2mb":
      return <TargetPdfCompress maxBytes={2 * 1024 * 1024} label="2 MB" />;
    case "rotate-pdf":
      return <PdfRotate />;
    case "pdf-to-image":
      return <PdfToImage />;
    case "images-to-pdf":
      return <ImagesToPdf />;
    case "image-compress":
      return <ImageCompress />;
    case "image-resize":
      return <ImageResize />;
    case "image-convert":
      return <ImageConvert />;
    case "image-crop":
      return <ImageCrop />;
    case "favicon-generator":
      return <FaviconGenerator />;
    case "markdown-preview":
      return <MarkdownPreview />;
    case "xml-formatter":
      return <XmlFormatter />;
    case "sql-formatter":
      return <SqlFormatter />;
    case "compress-image-to-40kb":
      return <TargetCompress maxBytes={40 * 1024} label="40 KB" />;
    case "compress-image-to-50kb":
      return <TargetCompress maxBytes={50 * 1024} label="50 KB" />;
    case "compress-image-to-100kb":
      return <TargetCompress maxBytes={100 * 1024} label="100 KB" />;
    case "compress-image-to-200kb":
      return <TargetCompress maxBytes={200 * 1024} label="200 KB" />;
    case "compress-image-to-300kb":
      return <TargetCompress maxBytes={300 * 1024} label="300 KB" />;
    case "passport-photo":
      return <PassportPhoto />;
    case "signature-resizer":
      return <SignatureResizer />;
    case "cgpa-to-percentage":
      return <CgpaToPercentage />;
    case "attendance-calculator":
      return <AttendanceCalculator />;
    case "age-calculator":
      return <AgeCalculator />;
    case "qr-code-generator":
      return <QrGenerator defaultMode="url" />;
    case "upi-qr-code-generator":
      return <QrGenerator defaultMode="upi" />;
    case "whatsapp-link-generator":
      return <WhatsAppLinkGenerator />;
    case "rent-receipt":
      return <RentReceipt />;
    case "number-to-words":
      return <NumberToWords />;
    case "gst-invoice":
      return <GstInvoice />;
    default:
      return null;
  }
}
