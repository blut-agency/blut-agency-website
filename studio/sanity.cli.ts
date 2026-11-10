import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./env";

export default defineCliConfig({
  api: { projectId, dataset },
  // `npm run deploy` puts the studio online at blut-agency.sanity.studio.
  studioHost: "blut-agency",
});
