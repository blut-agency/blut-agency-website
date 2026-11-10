import { defineArrayMember, defineType } from "sanity";

/** Long text with headings and bullet lists, for the imprint and privacy policy. */
export const legalText = defineType({
  name: "legalText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Page title", value: "h1" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Small heading", value: "h4" },
      ],
      lists: [{ title: "Bullets", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [{ name: "href", type: "url", title: "Web address", validation: (r) => r.uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }) }],
          },
        ],
      },
    }),
  ],
});
