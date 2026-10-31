import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Case study details live at /project/<slug> to match the Webflow site.
      // This catches the /case-studies/<slug> paths used earlier in the port.
      {
        source: "/case-studies/:slug",
        destination: "/project/:slug",
        permanent: true,
      },
      // The Strategy page took over from the old Services page.
      {
        source: "/services",
        destination: "/strategy",
        permanent: true,
      },
      // Work became Production (call with Michael and Timo, 30 Oct 2026).
      // Temporary until the new menu is signed off.
      {
        source: "/work",
        destination: "/production",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
