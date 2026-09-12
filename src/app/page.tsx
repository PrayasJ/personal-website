import { HomeView } from "@/components/portfolio/HomeView";
import { SiteGraphSchema } from "@/components/seo/PersonSchema";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Prayas Jain — Backend engineer at Nubra",
  description:
    "Backend engineer at Nubra working on order management in Go. Portfolio, writing, and free browser tools — JSON, PDF, image, and India calculators. No upload.",
  path: "/",
  absoluteTitle: true,
  keywords: [
    "Prayas Jain",
    "backend engineer",
    "Nubra",
    "free online tools",
    "JSON formatter",
    "merge PDF",
  ],
});

export default function Home() {
  return (
    <>
      <SiteGraphSchema />
      <HomeView />
    </>
  );
}
