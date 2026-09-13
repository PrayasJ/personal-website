import { categories } from "@/lib/site";
import { getToolsByCategory, toToolListItem } from "@/lib/tools";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@/components/ads/AdSlot";
import { ItemListSchema } from "@/components/seo/ItemListSchema";

export const metadata = pageMetadata({
  title: "Free Online Tools — Photo, PDF, Calculators, Student, QR",
  description:
    "Free browser tools: compress photos to KB, PDF merge, EMI, CGPA, QR codes, JSON, and more. No signup, no upload — processing stays in this tab.",
  path: "/tools",
  absoluteTitle: true,
  keywords: [
    "compress image to 50kb",
    "pdf tools",
    "emi calculator",
    "cgpa to percentage",
    "qr code generator",
    "developer tools",
  ],
});

export default function ToolsIndexPage() {
  const photo = getToolsByCategory("photo").map(toToolListItem);
  const pdf = getToolsByCategory("pdf").map(toToolListItem);
  const calculators = getToolsByCategory("calculator").map(toToolListItem);
  const student = getToolsByCategory("student").map(toToolListItem);
  const qr = getToolsByCategory("qr").map(toToolListItem);
  const image = getToolsByCategory("image").map(toToolListItem);
  const developer = getToolsByCategory("developer").map(toToolListItem);

  const all = [
    ...photo,
    ...pdf,
    ...calculators,
    ...student,
    ...qr,
    ...image,
    ...developer,
  ];

  const sections: {
    key: string;
    title: string;
    tools: typeof photo;
    blurb: string;
  }[] = [
    { key: "photo", title: "Photo", tools: photo, blurb: categories.photo.blurb },
    { key: "pdf", title: "PDF", tools: pdf, blurb: categories.pdf.blurb },
    {
      key: "calculators",
      title: "Calculators",
      tools: calculators,
      blurb: categories.calculator.blurb,
    },
    {
      key: "student",
      title: "Student",
      tools: student,
      blurb: categories.student.blurb,
    },
    { key: "qr", title: "QR", tools: qr, blurb: categories.qr.blurb },
    { key: "image", title: "Image", tools: image, blurb: categories.image.blurb },
    {
      key: "developer",
      title: "Developer",
      tools: developer,
      blurb: categories.developer.blurb,
    },
  ];

  return (
    <>
      <ItemListSchema
        name="Free online tools"
        description="Photo, PDF, calculators, student, QR, image, and developer tools that run in the browser."
        path="/tools"
        items={all.map((tool) => ({
          name: tool.name,
          path: tool.path,
          description: tool.description,
        }))}
      />
      <PageHeader
        title="Tools"
        description="Everyday utilities first — photo compress, PDF, EMI, CGPA, QR — plus developer tools. Everything runs in this tab."
        crumbs={[
          { name: "Index", path: "/" },
          { name: "Tools", path: "/tools" },
        ]}
      />
      <Container className="pb-20">
        {sections.map((section, index) =>
          section.tools.length > 0 ? (
            <div key={section.key} className={index === 0 ? undefined : "mt-14"}>
              <div className="tool-index-kicker">
                <h2>{section.title}</h2>
                <span className="tool-index-rule" aria-hidden />
                <span className="chip">{section.tools.length}</span>
              </div>
              <p className="tool-index-blurb">{section.blurb}</p>
              <div className="mt-4">
                <ToolGrid tools={section.tools} hideEmpty />
              </div>
              {index === 0 ? <AdSlot placement="index" /> : null}
            </div>
          ) : null,
        )}
        <AdSlot placement="foot" />
      </Container>
    </>
  );
}
