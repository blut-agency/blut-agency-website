import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { dataset, projectId } from "./env";
import { schemaTypes, SINGLETONS } from "./schemaTypes";

/*
  The blut Studio: where the team edits the website.
  Run it locally with `npm run dev` (localhost:3333).
  Put it online with `npm run deploy` (blut-agency.sanity.studio).
  Published changes reach the site with its next build.
*/
export default defineConfig({
  name: "blut",
  title: "blut",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !SINGLETONS.includes(t.schemaType)),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("caseStudy")
              .title("Cases")
              .child(S.documentTypeList("caseStudy").title("Cases").defaultOrdering([{ field: "position", direction: "asc" }])),
            S.listItem().title("Cases settings").id("casesSettings").child(S.document().schemaType("casesSettings").documentId("casesSettings")),
            S.divider(),
            S.documentTypeListItem("colorTheme").title("Colour themes"),
            S.documentTypeListItem("award").title("Awards"),
          ]),
    }),
    visionTool(),
  ],
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.includes(schemaType) ? actions.filter(({ action }) => action !== "duplicate" && action !== "delete" && action !== "unpublish") : actions,
  },
});
