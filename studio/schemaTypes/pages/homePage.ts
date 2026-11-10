import { defineArrayMember, defineField, defineType } from "sanity";
import { placeholder } from "./shared";

/** Home (/): the red stage, the three offer tiles, featured cases, "Why blut". */
export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  groups: [
    { name: "stage", title: "Top", default: true },
    { name: "offers", title: "What we do" },
    { name: "cases", title: "Featured cases" },
    { name: "why", title: "Why blut" },
    { name: "seo", title: "Search" },
  ],
  fields: [
    defineField({ name: "stageLine", title: "Line under the logo", type: "string", group: "stage" }),
    placeholder("stageLinePlaceholder", "stage"),
    defineField({ name: "soundLabel", title: "Sound button", type: "string", group: "stage", description: "e.g. Click for sound" }),
    defineField({ name: "pauseLabel", title: "Pause button", type: "string", group: "stage" }),

    defineField({ name: "offersHeading", title: "Heading", type: "string", group: "offers" }),
    defineField({ name: "offersText", title: "Text beside the heading", type: "text", rows: 3, group: "offers" }),
    placeholder("offersTextPlaceholder", "offers"),
    defineField({
      name: "offers",
      title: "Tiles",
      description: "Drag to change the order. Each tile takes the colours of its page.",
      type: "array",
      group: "offers",
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: "object",
          name: "offerTile",
          fields: [
            defineField({
              name: "page",
              title: "Page",
              type: "string",
              options: { list: ["Production", "Strategy", "Post"], layout: "radio", direction: "horizontal" },
              validation: (r) => r.required(),
            }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
            placeholder(),
            defineField({ name: "linkLabel", title: "Link words for screen readers", type: "string", description: "The tile only shows an arrow. Screen readers read these words." }),
            defineField({ name: "image", title: "Photo", type: "image" }),
            defineField({ name: "alt", title: "Photo description", type: "string", description: "For screen readers, e.g. Nina Chuba in the Samsung spot." }),
            defineField({ name: "preview", title: "Hover loop", type: "string", description: "Short silent video over the photo on hover, e.g. /media/crazy-wolf-preview.mp4" }),
          ],
          preview: { select: { title: "page", subtitle: "text", media: "image" } },
        }),
      ],
    }),

    defineField({ name: "casesHeading", title: "Heading", type: "string", group: "cases", description: "Which cases show here: Cases settings." }),
    defineField({ name: "casesLink", title: "Link", type: "cta", group: "cases" }),

    defineField({ name: "whyHeading", title: "Question", type: "string", group: "why" }),
    defineField({ name: "whyText", title: "Answer", type: "text", rows: 5, group: "why" }),
    defineField({ name: "whyLink", title: "Link", type: "cta", group: "why" }),

    defineField({ name: "seo", title: "Search and sharing", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home" }) },
});
