import { AdSenseScript } from "@/components/ads/AdSenseScript";

export default function ToolsGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AdSenseScript />
    </>
  );
}
