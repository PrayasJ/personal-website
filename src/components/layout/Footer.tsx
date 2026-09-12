import Link from "next/link";
import { footerNavItems, profile } from "@/lib/site";
import { getPopularTools } from "@/lib/tools";

export function Footer() {
  const year = new Date().getFullYear();
  const popular = getPopularTools(6);

  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight text-ink">{profile.name}</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
              Backend at Nubra. This site is a portfolio, a short writing log, and a
              few tools that run in the browser.
            </p>
          </div>
          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="tape mb-3">Site</p>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {footerNavItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="tape mb-3">Popular tools</p>
              <ul className="grid gap-y-2 text-sm">
                {popular.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={tool.path} className="text-muted hover:text-accent">
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
        <p className="font-mono text-[11px] tracking-wide text-muted uppercase">
          © {year} {profile.name} · tools as-is · not financial advice
        </p>
      </div>
    </footer>
  );
}
