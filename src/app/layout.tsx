import type { Metadata } from "next";
import { share } from "@/lib/share";
import Script from "next/script";
import PageTransition from "@/components/PageTransition";
import CenterHover from "@/components/CenterHover";
import MotionLayer from "@/components/MotionLayer";
import "./globals.css";
import "./landing.css";
import "./highlight.css";
import "./blocks.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.blut.agency"),
  title: "blut – Music Strategies with Measurable Impact | Sonic Branding Agency",
  description:
    "blut is a music-led creative agency crafting unique sonic identities and strategies. We combine music production with data-driven performance measurement to boost brand impact.",
  ...share({
    title: "blut – Music Strategies with Measurable Impact",
    description:
      "blut is a music-led creative agency crafting unique sonic identities and strategies. We combine music production with data-driven performance measurement to boost brand impact.",
    path: "/",
  }),
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/webclip.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ready before first paint, so text doesn't rewrap and shift the page when the font swaps in. */}
        <link rel="preload" href="/fonts/PPAgrandir-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link href="/css/normalize.css" rel="stylesheet" type="text/css" />
        <link href="/css/webflow.css" rel="stylesheet" type="text/css" />
        <link href="/css/blut-dev.webflow.css" rel="stylesheet" type="text/css" />
        <link href="/css/embeds.css" rel="stylesheet" type="text/css" />
        <link href="/css/expressive.css" rel="stylesheet" type="text/css" />
      </head>
      <body>
        <PageTransition />
        <CenterHover />
        <MotionLayer />
        {children}
        <noscript>
          <style>{`.main-wrapper { opacity: 1 !important; }`}</style>
        </noscript>

        <Script id="webflow-mod-classes" strategy="beforeInteractive">
          {`!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`}
        </Script>
        <Script
          src="/js/jquery-3.5.1.min.js"
          strategy="beforeInteractive"
        />
        <Script src="/js/webflow.js" strategy="afterInteractive" />
        <Script src="/js/gsap.min.js" strategy="beforeInteractive" />
        <Script
          src="/js/MorphSVGPlugin.min.js"
          strategy="beforeInteractive"
        />
        <Script id="gsap-register" strategy="beforeInteractive">
          {`if (window.gsap && window.MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);`}
        </Script>
        <Script src="/js/embeds.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
