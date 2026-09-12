import Link from "next/link";
import { AboutData } from "../../../data.config";
import { navItems, profile } from "@/lib/site";
import { LiveTape } from "@/components/desk/LiveTape";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { ToolSearch } from "@/components/navigation/ToolSearch";
import { MobileNav } from "@/components/navigation/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <LiveTape />
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-[0.18em] text-ink uppercase"
        >
          PJ
        </Link>
        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-sm tracking-wide text-muted uppercase transition-colors hover:bg-surface-muted hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden w-56 md:block">
          <ToolSearch />
        </div>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a
            href={profile.github}
            className="hidden text-sm text-muted hover:text-accent lg:inline"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          {AboutData.resume ? (
            <a
              href={AboutData.resume}
              className="btn btn-primary hidden h-8 px-3 text-[11px] lg:inline-flex"
              target="_blank"
              rel="noopener noreferrer"
            >
              Résumé
            </a>
          ) : null}
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
