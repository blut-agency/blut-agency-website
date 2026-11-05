import { defineArrayMember, defineType } from "sanity";

/**
 * A text section: paragraphs, headings, bold, links and full-width pictures.
 * The site turns it back into the HTML its pages already use.
 */
export const richText = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading", value: "h2" },
      ],
      lists: [],
      marks: {
        decorators: [{ title: "Bold", value: "strong" }],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "Web address",
                validation: (r) => r.uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      title: "Picture",
      fields: [{ name: "alt", type: "string", title: "Description for screen readers" }],
    }),
  ],
});
