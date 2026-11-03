import { defineCliConfig } from "sanity/cli";
// The studio only sees SANITY_STUDIO_* variables (from .env.local).
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineCliConfig({
  api: { projectId, dataset },
  // Online at https://blut-agency.sanity.studio after `npm run studio:deploy`.
  studioHost: "blut-agency",
  // The site's public/ folder (videos, ~114 MB) has no place in the studio.
  vite: (config) => ({ ...config, publicDir: false }),
});
