/*
  Which Sanity project and dataset the studio edits. The project ID is not a
  secret. "site" is the dataset for this setup (2026-11-05); the older
  "production" dataset from the first attempt stays untouched.
*/
export const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "ph7c3oz0";
export const dataset = process.env.SANITY_STUDIO_DATASET || "site";
