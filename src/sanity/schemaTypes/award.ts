import { defineField, defineType } from "sanity";

export const award = defineType({
  name: "award",
  title: "Award",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "image", title: "Logo", type: "image" }),
  ],
  preview: { select: { title: "name", media: "image" } },
});
