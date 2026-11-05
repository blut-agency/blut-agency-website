import { defineField, defineType } from "sanity";

const HEX = /^#[0-9a-fA-F]{6}$/;

/** A colour pair for a case: the line colour and the background colour. */
export const colorTheme = defineType({
  name: "colorTheme",
  title: "Colour theme",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "sortOrder", type: "number", hidden: true }),
    defineField({ name: "slug", title: "Short name", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "main", title: "Line colour", type: "string", description: "e.g. #6183ff", validation: (r) => r.required().regex(HEX, { name: "colour code" }) }),
    defineField({ name: "secondary", title: "Background colour", type: "string", description: "e.g. #dfe5ac", validation: (r) => r.required().regex(HEX, { name: "colour code" }) }),
    defineField({
      name: "photoMatch",
      title: "Use for photo highlights",
      description: "The site may pick this theme for the coloured highlight behind photos.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "name", main: "main", secondary: "secondary" },
    prepare: ({ title, main, secondary }) => ({ title, subtitle: `${main ?? ""} / ${secondary ?? ""}` }),
  },
});
