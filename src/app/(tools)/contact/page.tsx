import { profile } from "@/lib/site";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact Prayas Jain about prayas.dev tools, corrections, or suggestions.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        description="Email is the most reliable way to reach me."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <Container size="narrow" className="space-y-4 pb-16 text-sm leading-7 text-muted">
        <p>
          For tool ideas, broken pages, or privacy questions, email{" "}
          <a href={profile.emailHref} className="text-ink underline">
            {profile.email}
          </a>
          .
        </p>
        <p>
          There is no support SLA. I read mail when I can. Do not send secrets,
          production tokens, or personal data you would not want sitting in an
          inbox.
        </p>
        <ul className="space-y-2">
          <li>
            <a href={profile.github} className="text-ink underline" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={profile.linkedin} className="text-ink underline" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </Container>
    </>
  );
}
