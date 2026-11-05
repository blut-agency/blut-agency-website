import { defineField, defineType } from "sanity";

/** An award a case can show, with its logo. */
export const award = defineType({
  name: "award",
  title: "Award",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "sortOrder", type: "number", hidden: true }),
    defineField({ name: "slug", title: "Short name", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "image", title: "Logo", type: "image", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "name", media: "image" } },
});
