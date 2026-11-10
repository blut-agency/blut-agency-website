import { defineArrayMember, defineField, defineType } from "sanity";

/*
  A person at blut. The About page shows everyone ticked "Show on About".
  People with a page of their own (/team/<address>) have its texts in the
  "Own page" tab. Photos and colours are set in the site's code for now.
*/

const strings = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: "array", group: "page", of: [defineArrayMember({ type: "text", rows: 3 })] });

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  groups: [
    { name: "person", title: "Person", default: true },
    { name: "page", title: "Own page" },
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "sortOrder", direction: "asc" }] }],
  fields: [
    defineField({ name: "name", type: "string", group: "person", validation: (r) => r.required() }),
    defineField({ name: "firstName", title: "First name", type: "string", group: "person", description: "Used in links like “Write to Michael”." }),
    defineField({ name: "role", type: "string", group: "person" }),
    defineField({ name: "email", type: "string", group: "person", validation: (r) => r.email() }),
    defineField({ name: "phone", type: "string", group: "person" }),
    defineField({ name: "showOnAbout", title: "Show on About", type: "boolean", group: "person", initialValue: true }),
    defineField({ name: "key", title: "Code name", type: "string", group: "person", readOnly: true, description: "Set once. Pages use it to pick their contact person." }),
    defineField({ name: "file", title: "Photo file name", type: "string", group: "person", readOnly: true, description: "The portrait files on the site. Ask Nic to add new photos." }),
    defineField({ name: "sortOrder", type: "number", hidden: true }),
    defineField({
      name: "page",
      title: "Own page",
      type: "object",
      group: "page",
      description: "Leave empty for people without a page of their own.",
      options: { collapsible: true },
      fields: [
        defineField({ name: "slug", title: "Web address", type: "string", description: "The part after /team/, e.g. michael-robb." }),
        defineField({ name: "heroLine", title: "Line in the banner", type: "text", rows: 2 }),
        strings("intro", "Intro paragraphs"),
        strings("bio", "Bio paragraphs", "In the person's own words. Leave empty until they send it."),
        defineField({
          name: "expertise",
          title: "Expertise",
          type: "object",
          fields: [
            defineField({ name: "heading", type: "string" }),
            defineField({ name: "line", type: "string" }),
            defineField({ name: "intro", type: "text", rows: 3 }),
            defineField({ name: "image", title: "Photo", type: "image" }),
            defineField({ name: "alt", title: "Photo description", type: "string" }),
            defineField({
              name: "items",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "expertiseItem",
                  fields: [defineField({ name: "name", type: "string" }), defineField({ name: "text", type: "text", rows: 3 })],
                  preview: { select: { title: "name" } },
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "work",
          title: "Selected work",
          type: "object",
          fields: [
            defineField({ name: "heading", type: "string" }),
            defineField({ name: "spots", title: "Films (client names from Production or Post)", type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
            defineField({ name: "cases", title: "Cases", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] })] }),
          ],
        }),
        defineField({
          name: "faq",
          title: "Questions and answers",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "faqItem",
              fields: [defineField({ name: "name", title: "Question", type: "string" }), defineField({ name: "text", title: "Answer", type: "text", rows: 3 })],
              preview: { select: { title: "name" } },
            }),
          ],
        }),
        defineField({
          name: "seo",
          title: "Search",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Tab title", type: "string" }),
            defineField({ name: "description", type: "text", rows: 3 }),
            defineField({ name: "keywords", type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
          ],
        }),
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role" } },
});
