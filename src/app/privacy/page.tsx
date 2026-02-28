import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './privacy.module.scss'

export const metadata: Metadata = {
  title: 'Privacy Policy | Prayas Jain',
  description: 'Privacy policy for prayas.dev.',
}

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Back to home</Link>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: February 28, 2025</p>
      </header>

      <main className={styles.content}>
        <section>
          <h2>Overview</h2>
          <p>
            This privacy policy describes how prayas.dev (&quot;this site&quot;) collects, uses, and
            shares information when you visit or interact with it.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <p>
            When you visit this site, we may automatically collect certain information, including:
          </p>
          <ul>
            <li>Usage data (e.g., pages visited, time on site)</li>
            <li>Technical data (e.g., browser type, device type, approximate location)</li>
            <li>Analytics data to understand how the site is used and improve it</li>
          </ul>
          <p>
            This site uses Vercel Analytics to collect anonymized usage statistics. No personally
            identifiable information is collected for analytics purposes.
          </p>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Operate and improve the site</li>
            <li>Understand how visitors use the site</li>
            <li>Respond to inquiries if you contact us</li>
          </ul>
        </section>

        <section>
          <h2>Cookies and Similar Technologies</h2>
          <p>
            This site may use cookies and similar technologies (e.g., local storage) for analytics
            and to remember preferences. You can control cookie settings through your browser.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            We may use third-party services that have their own privacy policies. These include:
          </p>
          <ul>
            <li><strong>Vercel</strong> — hosting and analytics (see{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                Vercel&apos;s privacy policy
              </a>)
            </li>
          </ul>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>
            We retain analytics and usage data only as long as necessary to operate and improve the
            site, or as required by law.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, or delete your
            personal data, or to object to or restrict certain processing. Contact us if you wish
            to exercise these rights.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. The &quot;Last updated&quot; date at the
            top will reflect the most recent changes. Continued use of the site after changes
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy, you can reach out via the contact
            information on the <Link href="/">home page</Link>.
          </p>
        </section>
      </main>
    </div>
  )
}
