import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export type Crumb = {
  name: string;
  path: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <BreadcrumbSchema items={items} />
      <nav aria-label="Breadcrumb" className="tape mb-6">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1">
                {index > 0 ? (
                  <span aria-hidden="true" className="px-1 text-border">
                    /
                  </span>
                ) : null}
                {last ? (
                  <span className="text-ink" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="hover:text-ink hover:underline">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
