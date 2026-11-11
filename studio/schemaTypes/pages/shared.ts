import { defineArrayMember, defineField, defineType } from "sanity";

/*
  Building blocks for the page forms. Every page is one document that exists
  once. Its fields hold the page's words, pictures and links; the layout,
  colours and motion stay in the site's code.
*/

/** Search and sharing texts: the tab title, Google's snippet and the link preview. */
export const seo = defineType({
  name: "seo",
  title: "Search and sharing",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Tab title", type: "string", description: "Shown in the browser tab and on Google." }),
    defineField({ name: "shareTitle", title: "Link preview title", type: "string", description: "Shown when someone shares the page." }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, description: "The short text under the title on Google." }),
    defineField({ name: "shareDescription", title: "Link preview text", type: "text", rows: 3, description: "Shown when someone shares the page. Leave empty to use the description." }),
  ],
});

/** The old "Text is a placeholder" switch: hidden since the site stopped marking placeholder text (11 Nov 2026). Kept so old data stays valid. */
export const placeholder = (name = "placeholder", group?: string) =>
  defineField({
    name,
    title: "Text is a placeholder",
    description: "No longer shown on the site.",
    type: "boolean",
    initialValue: false,
    hidden: true,
    group,
  });

/** A link with its words, e.g. "View all cases" → /case-studies. */
export const cta = defineType({
  name: "cta",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Words", type: "string" }),
    defineField({ name: "href", title: "Goes to", type: "string", description: "A page on the site, e.g. /about, or a full web address." }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

/** The coloured banner at the top of a page. */
export const hero = defineType({
  name: "hero",
  title: "Top banner",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "text", rows: 3, description: "Start a new line with Enter where the heading should break." }),
    defineField({ name: "line", title: "Line under the heading", type: "text", rows: 2, description: "Keep it short: the banner has a fixed height." }),
    placeholder(),
  ],
});

/** A two-tone heading: the question, then blut's answer in colour. */
export const callResponse = defineType({
  name: "callResponse",
  title: "Question and answer",
  type: "object",
  fields: [
    defineField({ name: "question", type: "text", rows: 2 }),
    defineField({ name: "answer", type: "string" }),
    placeholder(),
  ],
});

/** The boxed heading, text and link near the bottom of a page. */
export const leadBox = defineType({
  name: "leadBox",
  title: "Box with link",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "text", type: "text", rows: 3 }),
    defineField({ name: "link", type: "cta" }),
  ],
});

/** One film with its text, as on Production and Post. */
export const workSpot = defineType({
  name: "workSpot",
  title: "Film",
  type: "object",
  fields: [
    defineField({ name: "client", title: "Client", type: "string", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Title", type: "string", description: "Optional. Wide films show no title." }),
    defineField({ name: "text", title: "Text", type: "text", rows: 4 }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Full width", value: "wide" },
          { title: "Photo left", value: "row" },
          { title: "Photo right", value: "row-flipped" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "row",
    }),
    defineField({ name: "image", title: "Still", type: "image" }),
    defineField({ name: "videoUrl", title: "Video file", type: "string", description: "Plays when someone clicks the still, e.g. /media/samsung-nina-chuba.mp4" }),
    defineField({ name: "preview", title: "Hover loop", type: "string", description: "Short silent video over the still on hover." }),
    defineField({ name: "caseSlug", title: "Case", type: "reference", to: [{ type: "caseStudy" }], description: "Optional. Adds a link to the case." }),
  ],
  preview: { select: { title: "client", subtitle: "layout", media: "image" } },
});

/** A service with its three tools as drawers, as on Strategy. */
export const service = defineType({
  name: "service",
  title: "Service",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "line", title: "Question", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 4 }),
    defineField({ name: "image", title: "Photo", type: "image" }),
    defineField({ name: "alt", title: "Photo description", type: "string" }),
    defineField({
      name: "items",
      title: "Tools",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "tool",
          fields: [defineField({ name: "name", type: "string" }), defineField({ name: "text", type: "text", rows: 3 })],
          preview: { select: { title: "name", subtitle: "text" } },
        }),
      ],
    }),
    defineField({ name: "link", title: "Link (optional)", type: "cta" }),
  ],
  preview: { select: { title: "heading", subtitle: "line" } },
});
