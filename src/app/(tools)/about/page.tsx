import Link from "next/link";
import { profile } from "@/lib/site";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Prayas Jain is a backend engineer at Nubra, working on order management systems.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About"
        description="A person, not a product company."
        crumbs={[
          { name: "Index", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      <Container size="narrow" className="space-y-4 pb-16 text-sm leading-7 text-muted">
        <p>{profile.shortBio}</p>
        <p>
          The long version — work, education, projects, tools, and writing — is on
          the{" "}
          <Link href="/" className="text-accent hover:underline">
            index
          </Link>
          .
        </p>
        <p>
          Tools that can run in the browser do so. There are no user accounts and
          no application database.
        </p>
      </Container>
    </>
  );
}
