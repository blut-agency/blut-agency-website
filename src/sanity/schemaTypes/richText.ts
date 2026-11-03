import { defineArrayMember, defineType } from "sanity";

/**
 * A case's text section: headings, paragraphs, bold, links and full-width
 * pictures. The site turns it back into the HTML the case pages already use.
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
            fields: [{ name: "href", type: "url", title: "URL", validation: (r) => r.uri({ scheme: ["http", "https", "mailto"] }) }],
          },
        ],
      },
    }),
    defineArrayMember({ type: "image", title: "Picture", options: { hotspot: true } }),
  ],
});
