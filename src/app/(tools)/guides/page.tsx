import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Guides",
  description:
    "Short, practical guides on JSON, JWTs, cron expressions, Unix timestamps, and other topics behind the tools on Prayas.dev.",
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <>
      <PageHeader
        title="Guides"
        description="Short explanations of the formats and ideas behind the tools. Written to be useful, not to rank for every possible keyword."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ]}
      />
      <Container className="pb-16">
        <p className="max-w-2xl text-sm leading-7 text-muted">
          Guides will cover topics like how to format JSON, what a JWT actually
          contains, how Unix timestamps work, and how cron expressions are read.
          Each article will stand on its own. Nothing has been published yet.
        </p>
      </Container>
    </>
  );
}
