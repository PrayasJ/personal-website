import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeScript } from "@/components/navigation/ThemeScript";
import { TapeProvider } from "@/components/desk/TapeProvider";
import { Ambient } from "@/components/fx/Ambient";
import { CustomCursor } from "@/components/fx/CustomCursor";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
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
  openGraph: {
    title: "Prayas Jain — Backend engineer",
    description:
      "OMS, Go, RPC at Nubra. Portfolio, writing, and browser-based developer tools.",
    url: "https://www.prayas.dev/",
    siteName: "Prayas Jain",
    images: [
      {
        url: "https://www.prayas.dev/images/site-preview.png",
        width: 1726,
        height: 971,
      },
    ],
    type: "website",
  },
  twitter: {
    title: "Prayas Jain — Backend engineer",
    description:
      "OMS, Go, RPC at Nubra. Portfolio, writing, and browser-based developer tools.",
    card: "summary_large_image",
    images: [
      {
        url: "https://www.prayas.dev/images/site-preview.png",
        width: 1726,
        height: 971,
      },
    ],
  },
  keywords: [
    "backend engineer",
    "OMS",
    "golang",
    "trading systems",
    "Nubra",
    "Prayas Jain",
  ],
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
        <CustomCursor />
        <Ambient />
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
        <AdSenseScript />
      </body>
    </html>
  );
}
