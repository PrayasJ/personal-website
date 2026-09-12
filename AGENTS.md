## Learned User Preferences
- Keep the existing portfolio design and structure; new features (including tools) must be additive and must not delete or replace current work.
- The homepage is a personal portfolio first (about, education, work, projects, links), with tools and writing as subsections rather than the primary landing.
- Visual identity should read as a backend engineer at a trading firm: Nubra-inspired colors, animations, and a custom cursor, but stay modern and professional rather than toy-like.
- Theme control offers Dark and Light only — do not expose a System option; theme transitions should be animated.
- The site must stay mobile-friendly, including the header menu and tool UIs.
- Live ticking values start with a clear background; on a tick, flash a borderless, non-rounded highlight (green for increases, red for decreases) that lingers; do not apply this treatment to every value or section.
- Tool inputs and outputs can use richer color; surrounding portfolio and marketing sections should stay restrained.
- New tools should also appear in the projects list with links.
- Work and experience should present as a timeline.
- Tools process user data in the browser only — no backend, database, user accounts, or paid APIs.
- PDF and image tools should preview the file and result, then ask for confirmation before download.
- Ads on tool pages should earn revenue without making the tools unusable.
- New consumer SEO tools prioritize India everyday intent (photo KB caps, student utils, UPI QR) while staying additive; do not invent official exam/gov size claims.

## Learned Workspace Facts
- The site is https://www.prayas.dev — Prayas Jain's portfolio plus SEO-focused free browser tools, deployed on Vercel for static hosting.
- The owner is a backend engineer at Nubra working on the order management system (Go, RPC).
- Stack is Next.js App Router, TypeScript, React, and Tailwind CSS, plus existing Sass portfolio styles; prefer static generation.
- Portfolio content lives in `data.config.tsx`; site constants and navigation live in `src/lib/site.ts`.
- Tools are registered centrally in `src/lib/tools.ts` and routed under `/tools`, `/calculators`, `/pdf`, `/image`, `/photo`, `/student`, and `/qr`; the `/tools` hub lists all categories with consumer-first ordering (Photo, PDF, Calculators, Student, QR, Image, Developer).
- The homepage includes About, Work, Desk (an interactive trading game), Projects, Tools, and Writing.
- Legal and utility pages include `/privacy`, `/terms`, `/about`, `/contact`, and `/guides`.
- Google AdSense is wired through `NEXT_PUBLIC_ADSENSE_*` environment variables and shown on tool pages.
