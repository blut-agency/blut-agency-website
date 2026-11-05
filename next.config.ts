import type { NextConfig } from "next";

// Where the videos and audio live: everything on the site links to /media/<file>.
// Without it, /media is served from public/media (git-ignored), for local work.
const MEDIA_URL = process.env.MEDIA_URL;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...(MEDIA_URL ? [{ source: "/media/:file*", destination: `${MEDIA_URL}/:file*`, permanent: false }] : []),
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
