/**
 * The site's own address, used for link previews (og:image, og:url), the
 * sitemap and structured data. Link previews need full URLs, so this must
 * point at the host that actually serves the files.
 *
 * 1. SITE_URL, if set in Vercel (e.g. "https://www.blut.agency" at launch).
 * 2. A Vercel preview build: its own branch URL, so shared preview links show the picture.
 * 3. A Vercel production build: the project's production domain. Today that is
 *    blut-agency-website.vercel.app; once blut.agency is added to the project, Vercel uses it.
 * 4. Local dev: localhost.
 */
function siteUrl(): string {
  const env = process.env;
  if (env.SITE_URL) return env.SITE_URL.replace(/\/$/, "");
  const host =
    env.VERCEL_ENV === "preview"
      ? env.VERCEL_BRANCH_URL || env.VERCEL_URL
      : env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  return host ? `https://${host}` : `http://localhost:${env.PORT || 3000}`;
}

export const SITE = siteUrl();
