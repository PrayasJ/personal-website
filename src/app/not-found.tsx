import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="tape text-accent">404</p>
      <h1 className="font-display text-gradient mt-4 text-4xl font-semibold">Page not found</h1>
      <p className="mt-4 text-muted">That route is not on this desk.</p>
      <p className="mt-8 flex justify-center gap-4 text-sm">
        <Link href="/" className="text-accent hover:underline">
          Index
        </Link>
        <Link href="/tools" className="text-accent hover:underline">
          Tools
        </Link>
      </p>
    </div>
  );
}
