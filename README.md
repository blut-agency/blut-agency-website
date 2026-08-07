# blut-agency-website

blut.agency website — migrated from Webflow to a standalone Next.js codebase, deployed on Vercel.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- Styling: the original Webflow-exported CSS (`public/css/`), linked globally — not Tailwind
- Deployed on [Vercel](https://vercel.com)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project structure

- `src/app` — routes and pages (App Router)
- `src/components` — shared UI components (`Header`, `Footer`)
- `src/content/cms-content.json` — case studies, locations, colors, and awards data exported from the old Webflow CMS
- `src/lib/content.ts` — typed accessors over `cms-content.json`
- `public/css`, `public/js`, `public/fonts` — the Webflow-generated stylesheets, interaction/animation scripts, and font, carried over as-is for visual fidelity
- `public/images` — site imagery exported from Webflow

## Content

Case study, office location, color-theme, and award data lives in `src/content/cms-content.json`, generated from a Webflow CMS export. To update content, edit that file directly (or re-export from Webflow and regenerate it) — there is no live CMS connection anymore.

## Notes on the migration

This site was ported from a Webflow export rather than rebuilt from scratch, to preserve the original design pixel-for-pixel. Practical implications:

- Global interactions (sticky nav, accordions, audio/video players, marquees, page-transition fades) come from `public/js/embeds.js`, consolidated from the per-page `<script>` embeds in the original export.
- GSAP, jQuery, and the Vimeo Player API are loaded from their original CDNs in `src/app/layout.tsx`.
- Case study media (images, quote photos, award logos) still points at Webflow's asset CDN (`cdn.prod.website-files.com`). Consider migrating these to `public/` or another asset host if the Webflow account is ever decommissioned.
- A handful of draft/internal pages from the export (`home-copy`, `analyze`, `visuals`, `styleguide`, and the standalone `detail_awards/color/home-sound/location` CMS templates) were intentionally not ported, as they weren't linked from the live site's navigation.

## Deployment

The site deploys to Vercel. Pushes to `main` deploy to production; other branches get preview deployments.
