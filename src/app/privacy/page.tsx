import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Prayas Jain",
  description: "Privacy policy for prayas.dev.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <p className="tape mb-4">
        <Link href="/" className="hover:text-ink">
          index
        </Link>
        {"  "}/{"  "}privacy
      </p>
      <h1 className="font-display text-gradient text-4xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 font-mono text-xs text-muted uppercase">
        Last updated: 12 September 2026
      </p>

      <div className="mt-10 space-y-8 text-sm leading-7 text-muted">
        <section>
          <h2 className="text-base text-ink">Overview</h2>
          <p className="mt-2">
            This policy describes how prayas.dev collects, uses, and shares
            information. This is a personal site operated by {profile.name}, not
            a registered company.
          </p>
        </section>
        <section>
          <h2 className="text-base text-ink">Tool input</h2>
          <p className="mt-2">
            Developer tools on this site are designed to process your data in the
            browser. When a page says your data is processed locally, that input
            is not uploaded as part of using the tool.
          </p>
        </section>
        <section>
          <h2 className="text-base text-ink">Information stored on your device</h2>
          <p className="mt-2">
            The site stores your theme preference in localStorage so the choice
            survives a reload. That value does not leave your browser.
          </p>
        </section>
        <section>
          <h2 className="text-base text-ink">Hosting and analytics</h2>
          <p className="mt-2">
            The host may collect standard request logs. This site uses Vercel
            Analytics for anonymized usage statistics and Vercel Speed Insights
            for Core Web Vitals. See{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              className="text-accent hover:underline"
              rel="noopener noreferrer"
            >
              Vercel&apos;s privacy policy
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="text-base text-ink">Advertising</h2>
          <p className="mt-2">
            Tool pages may show Google AdSense advertisements. Google may use
            cookies or similar identifiers to serve and measure ads, including
            personalized ads if you have not opted out. See{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              className="text-accent hover:underline"
              rel="noopener noreferrer"
            >
              Google&apos;s advertising policy
            </a>{" "}
            and{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="text-accent hover:underline"
              rel="noopener noreferrer"
            >
              ad settings
            </a>
            . Tool input is still processed in your browser and is not sent to
            this site as part of using a tool.
          </p>
        </section>
        <section>
          <h2 className="text-base text-ink">Contact</h2>
          <p className="mt-2">
            Questions: the{" "}
            <Link href="/" className="text-accent hover:underline">
              home page
            </Link>{" "}
            or {profile.email}.
          </p>
        </section>
      </div>
    </article>
  );
}
