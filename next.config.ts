import type { NextConfig } from "next";

// Videos and audio live in blut's Nextcloud (Hetzner Storage Share, a public
// read-only folder); everything on the site links to /media/<file>.
const MEDIA_URL = "https://cloud.blut.agency/public.php/dav/files/7ax7TLoEpTWKzq6";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/media/:file*", destination: `${MEDIA_URL}/:file*`, permanent: false },
      // The editing studio (Sanity), so the team only needs to remember /admin.
      { source: "/admin", destination: "https://blut-agency.sanity.studio", permanent: false },
      { source: "/admin/:path*", destination: "https://blut-agency.sanity.studio/:path*", permanent: false },
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
