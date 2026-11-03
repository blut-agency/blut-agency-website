import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
// The studio only sees SANITY_STUDIO_* variables (from .env.local).
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

/*
  The blut Studio: where the team edits cases.
  Run it locally with `npm run studio` (localhost:3333) and put it online
  with `npm run studio:deploy` (blut-agency.sanity.studio).
*/
export default defineConfig({
  name: "blut",
  title: "blut",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // "Cases settings" exists once; nobody creates a second one.
    templates: (templates) => templates.filter((t) => t.schemaType !== "casesPage"),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("caseStudy").title("Cases").child(
              S.documentTypeList("caseStudy").title("Cases").defaultOrdering([{ field: "position", direction: "asc" }]),
            ),
            S.listItem().title("Cases settings").id("casesPage").child(S.document().schemaType("casesPage").documentId("casesPage")),
            S.divider(),
            S.documentTypeListItem("colorTheme").title("Colour themes"),
            S.documentTypeListItem("award").title("Awards"),
          ]),
    }),
  ],
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === "casesPage" ? actions.filter(({ action }) => action !== "duplicate" && action !== "delete") : actions,
  },
});
