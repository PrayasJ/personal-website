import { JsonFormatter } from "@/components/tools/json-formatter/JsonFormatter";
import { UnixTimestamp } from "@/components/tools/unix-timestamp/UnixTimestamp";
import { DeskGame } from "@/components/desk/DeskGame";
import { JsonYaml } from "@/components/tools/json-yaml/JsonYaml";
import { JwtDecoder } from "@/components/tools/jwt-decoder/JwtDecoder";
import { Base64Tool } from "@/components/tools/base64/Base64Tool";
import { UrlEncoder } from "@/components/tools/url-encoder/UrlEncoder";
import { UuidGenerator } from "@/components/tools/uuid-generator/UuidGenerator";
import { CronBuilder } from "@/components/tools/cron/CronBuilder";
import { RegexTester } from "@/components/tools/regex-tester/RegexTester";
import { JsonToGo } from "@/components/tools/json-to-go/JsonToGo";
import { HashTool } from "@/components/tools/hash/HashTool";
import { UrlInspector } from "@/components/tools/url-inspector/UrlInspector";
import { HtmlEntities } from "@/components/tools/html-entities/HtmlEntities";
import { TextDiff } from "@/components/tools/text-diff/TextDiff";
import { CaseConverter } from "@/components/tools/case-converter/CaseConverter";
import { NumberBase } from "@/components/tools/number-base/NumberBase";
import { PasswordGenerator } from "@/components/tools/password-generator/PasswordGenerator";
import { CsvJson } from "@/components/tools/csv-json/CsvJson";
import { ColorConverter } from "@/components/tools/color-converter/ColorConverter";
import { UnicodeInspector } from "@/components/tools/unicode/UnicodeInspector";
import { HexUtf8 } from "@/components/tools/hex-utf8/HexUtf8";
import { TextTools } from "@/components/tools/text-tools/TextTools";
import { TimezoneConverter } from "@/components/tools/timezone/TimezoneConverter";
import { JsonToTs } from "@/components/tools/json-to-ts/JsonToTs";
import { GoDuration } from "@/components/tools/go-duration/GoDuration";
import { ByteSize } from "@/components/tools/byte-size/ByteSize";
import { QueryString } from "@/components/tools/query-string/QueryString";
import { UlidGenerator } from "@/components/tools/ulid-generator/UlidGenerator";
import { HttpStatus } from "@/components/tools/http-status/HttpStatus";
import { EmiCalculator } from "@/components/tools/emi/EmiCalculator";
import { SipCalculator } from "@/components/tools/sip/SipCalculator";
import { FdCalculator } from "@/components/tools/fd/FdCalculator";
import { GstCalculator } from "@/components/tools/gst/GstCalculator";
import { PercentageCalculator } from "@/components/tools/percentage/PercentageCalculator";
import { PpfCalculator } from "@/components/tools/ppf/PpfCalculator";
import { RdCalculator } from "@/components/tools/rd/RdCalculator";
import { GratuityCalculator } from "@/components/tools/gratuity/GratuityCalculator";
import { CtcCalculator } from "@/components/tools/ctc/CtcCalculator";
import { InHandSalary } from "@/components/tools/in-hand/InHandSalary";
import { PdfMerge } from "@/components/tools/pdf-merge/PdfMerge";
import { PdfSplit } from "@/components/tools/pdf-split/PdfSplit";
import { PdfCompress } from "@/components/tools/pdf-compress/PdfCompress";
import { PdfRotate } from "@/components/tools/pdf-rotate/PdfRotate";
import { PdfToImage } from "@/components/tools/pdf-to-image/PdfToImage";
import { ImageCompress } from "@/components/tools/image-compress/ImageCompress";
import { ImageResize } from "@/components/tools/image-resize/ImageResize";
import { ImageConvert } from "@/components/tools/image-convert/ImageConvert";
import { ImageCrop } from "@/components/tools/image-crop/ImageCrop";
import { FaviconGenerator } from "@/components/tools/favicon/FaviconGenerator";
import { IncomeTaxCalculator } from "@/components/tools/income-tax/IncomeTaxCalculator";
import { HraCalculator } from "@/components/tools/hra/HraCalculator";
import { MarkdownPreview } from "@/components/tools/markdown-preview/MarkdownPreview";
import { XmlFormatter } from "@/components/tools/xml-formatter/XmlFormatter";
import { SqlFormatter } from "@/components/tools/sql-formatter/SqlFormatter";
import { ImagesToPdf } from "@/components/tools/images-to-pdf/ImagesToPdf";
import { TargetCompress } from "@/components/tools/target-compress/TargetCompress";
import { PassportPhoto } from "@/components/tools/passport-photo/PassportPhoto";
import { SignatureResizer } from "@/components/tools/signature-resizer/SignatureResizer";
import { CgpaToPercentage } from "@/components/tools/cgpa/CgpaToPercentage";
import { AttendanceCalculator } from "@/components/tools/attendance/AttendanceCalculator";
import { AgeCalculator } from "@/components/tools/age/AgeCalculator";
import { QrGenerator } from "@/components/tools/qr/QrGenerator";

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
    case "compress-image-to-50kb":
      return <TargetCompress maxBytes={50 * 1024} label="50 KB" />;
    case "compress-image-to-100kb":
      return <TargetCompress maxBytes={100 * 1024} label="100 KB" />;
    case "compress-image-to-200kb":
      return <TargetCompress maxBytes={200 * 1024} label="200 KB" />;
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
    default:
      return null;
  }
}
