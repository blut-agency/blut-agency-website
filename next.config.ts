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
    ];
  },
};

export default nextConfig;
