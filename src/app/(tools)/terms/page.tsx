import Link from "next/link";
import { profile, SITE_NAME, SITE_URL } from "@/lib/site";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms for using the free tools on prayas.dev. Provided as-is, without warranty.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of Use"
        description="Last updated: 12 September 2026"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ]}
      />
      <Container size="narrow" className="space-y-8 pb-16 text-sm leading-7 text-muted">
        <section>
          <h2 className="text-base font-semibold text-ink">The site</h2>
          <p className="mt-2">
            {SITE_NAME} ({SITE_URL}) is a personal website operated by{" "}
            {profile.name}. It provides free tools and related pages. Use of the
            site constitutes acceptance of these terms.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-ink">No warranty</h2>
          <p className="mt-2">
            The tools are provided as-is. Output may be wrong, incomplete, or
            unsuitable for your situation. You are responsible for checking
            results before you rely on them, especially for financial calculators
            and generated code.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-ink">Not advice</h2>
          <p className="mt-2">
            Nothing on this site is legal, tax, financial, or professional advice.
            Calculator pages will state their assumptions; those assumptions can
            be outdated or simplified.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-ink">Acceptable use</h2>
          <p className="mt-2">
            Do not use the site to break the law, attack other systems, or overload
            the host. Automated scraping that degrades service may be blocked by
            the CDN.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-ink">Advertising</h2>
          <p className="mt-2">
            Free tools are supported by ads on tool pages. Ads are labeled and
            sit around the workspace, not inside it. Third-party networks serve
            those units; their content is not an endorsement. Blocking ads does
            not change the licence of the tools.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            Questions:{" "}
            <Link href="/contact" className="text-ink underline">
              contact
            </Link>
            .
          </p>
        </section>
      </Container>
    </>
  );
}
