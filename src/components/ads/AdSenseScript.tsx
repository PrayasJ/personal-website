import Script from "next/script";
import { adsEnabled, adsenseClient } from "@/lib/ads";

export function AdSenseScript() {
  if (!adsEnabled()) {
    return null;
  }

  return (
    <Script
      id="adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient()}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
