import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeScript } from "@/components/navigation/ThemeScript";
import { TapeProvider } from "@/components/desk/TapeProvider";
import { DeferredFx } from "@/components/fx/DeferredFx";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});

const display = Fraunces({
  subsets: ["latin"],
  // Headings use semibold; one weight avoids extra display files on /.
  weight: ["600"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050816",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prayas Jain — Backend engineer",
    template: "%s | Prayas Jain",
  },
  description:
    "Backend engineer at Nubra. I work on order management systems in Go, and I keep a small set of free browser tools on this site.",
  authors: [{ name: "Prayas Jain", url: SITE_URL }],
  creator: "Prayas Jain",
  publisher: SITE_NAME,
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Prayas Jain — Backend engineer",
    description:
      "OMS, Go, RPC at Nubra. Portfolio, writing, and browser-based developer tools.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Prayas Jain — Backend engineer",
    description:
      "OMS, Go, RPC at Nubra. Portfolio, writing, and browser-based developer tools.",
    card: "summary_large_image",
  },
  keywords: [
    "backend engineer",
    "OMS",
    "golang",
    "trading systems",
    "Nubra",
    "Prayas Jain",
    "free online tools",
    "JSON formatter",
    "PDF tools",
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className={`${sans.className} antialiased`}>
        <ThemeScript />
        <DeferredFx />
        <TapeProvider>
        <div id="site" className="flex min-h-dvh flex-col">
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        </TapeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
