import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  crumbs,
  wide = false,
}: {
  title: string;
  description: string;
  crumbs: { name: string; path: string }[];
  wide?: boolean;
}) {
  return (
    <Container size={wide ? "wide" : "default"} className="pt-8 pb-6 sm:pt-10">
      <Breadcrumbs items={crumbs} />
      <h1 className={cn("font-display text-gradient text-3xl font-semibold sm:text-4xl")}>{title}</h1>
      <p className="mt-3 max-w-2xl text-muted">{description}</p>
    </Container>
  );
}
