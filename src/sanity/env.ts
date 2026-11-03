/*
  Sanity settings for the site. The project ID comes from .env.local (or
  Vercel's environment variables). Without it the site reads
  src/content/cms-content.json, exactly as before.
*/
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-11-01";
