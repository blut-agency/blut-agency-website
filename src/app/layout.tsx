import type { Metadata } from "next";
import Script from "next/script";
import PageTransition from "@/components/PageTransition";
import MotionLayer from "@/components/MotionLayer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.blut.agency"),
  title: "blut – Music Strategies with Measurable Impact | Sonic Branding Agency",
  description:
    "blut is a music-led creative agency crafting unique sonic identities and strategies. We combine music production with data-driven performance measurement to boost brand impact.",
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/webclip.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/css/normalize.css" rel="stylesheet" type="text/css" />
        <link href="/css/webflow.css" rel="stylesheet" type="text/css" />
        <link href="/css/blut-dev.webflow.css" rel="stylesheet" type="text/css" />
        <link href="/css/embeds.css" rel="stylesheet" type="text/css" />
        <link href="/css/expressive.css" rel="stylesheet" type="text/css" />
      </head>
      <body>
        <PageTransition />
        <MotionLayer />
        {children}
        <noscript>
          <style>{`.main-wrapper { opacity: 1 !important; }`}</style>
        </noscript>

        <Script id="webflow-mod-classes" strategy="beforeInteractive">
          {`!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`}
        </Script>
        <Script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6821e3f2904304c7319e5938"
          strategy="beforeInteractive"
        />
        <Script src="/js/webflow.js" strategy="afterInteractive" />
        <Script src="https://cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js" strategy="beforeInteractive" />
        <Script
          src="https://cdn.prod.website-files.com/gsap/3.15.0/MorphSVGPlugin.min.js"
          strategy="beforeInteractive"
        />
        <Script id="gsap-register" strategy="beforeInteractive">
          {`if (window.gsap && window.MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);`}
        </Script>
        <Script src="https://player.vimeo.com/api/player.js" strategy="beforeInteractive" />
        <Script src="/js/embeds.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
