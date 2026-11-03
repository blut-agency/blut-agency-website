import { defineField, defineType } from "sanity";

/** Two-tone colour theme: a case page's gradient and its card highlight. */
export const colorTheme = defineType({
  name: "colorTheme",
  title: "Colour theme",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "main", title: "Main colour (lines)", type: "string", description: "Hex code, e.g. #6183ff", validation: (r) => r.required().regex(/^#[0-9a-fA-F]{6}$/) }),
    defineField({ name: "secondary", title: "Secondary colour (background)", type: "string", description: "Hex code, e.g. #dfe5ac", validation: (r) => r.required().regex(/^#[0-9a-fA-F]{6}$/) }),
    defineField({
      name: "order",
      title: "Order",
      description: "Themes are matched to photos in this order. New themes can stay empty.",
      type: "number",
    }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "main" } },
});
