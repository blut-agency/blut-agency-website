import { defineArrayMember, defineField, defineType } from "sanity";

/*
  The page forms besides Home. Each has the same tabs where it can: the top
  banner, the page's own content, the box near the end, and search.
*/

const seoField = defineField({ name: "seo", title: "Search and sharing", type: "seo", group: "seo" });
const heroField = defineField({ name: "hero", title: "Top banner", type: "hero", group: "top" });
const leadField = defineField({ name: "lead", title: "Box with link", type: "leadBox", group: "end" });
const groups = (main: string) => [
  { name: "top", title: "Top banner", default: true },
  { name: "main", title: main },
  { name: "end", title: "End of page" },
  { name: "seo", title: "Search" },
];
/** The people in the black contact block near the end of the page. */
const contactsField = defineField({
  name: "contacts",
  title: "Contact people",
  description: "Shown in the black “Sound good? Get in touch!” block. Leave empty to show the general email.",
  type: "array",
  group: "end",
  of: [defineArrayMember({ type: "reference", to: [{ type: "teamMember" }] })],
  validation: (r) => r.max(2).unique(),
});
const spots = defineField({
  name: "spots",
  title: "Films",
  description: "Drag to change the order.",
  type: "array",
  group: "main",
  of: [defineArrayMember({ type: "workSpot" })],
});

export const productionPage = defineType({
  name: "productionPage",
  title: "Production",
  type: "document",
  groups: groups("Films"),
  fields: [heroField, defineField({ name: "intro", title: "Question and answer", type: "callResponse", group: "main" }), spots, leadField, contactsField, seoField],
  preview: { prepare: () => ({ title: "Production" }) },
});

export const postPage = defineType({
  name: "postPage",
  title: "Post",
  type: "document",
  groups: groups("Films"),
  fields: [heroField, defineField({ name: "intro", title: "Question and answer", type: "callResponse", group: "main" }), spots, leadField, contactsField, seoField],
  preview: { prepare: () => ({ title: "Post" }) },
});

export const strategyPage = defineType({
  name: "strategyPage",
  title: "Strategy",
  type: "document",
  groups: groups("Services"),
  fields: [
    heroField,
    defineField({ name: "intro", title: "Intro text", type: "text", rows: 4, group: "main" }),
    defineField({ name: "film", title: "Film", type: "workSpot", group: "main" }),
    defineField({ name: "services", title: "Services", type: "array", group: "main", of: [defineArrayMember({ type: "service" })] }),
    leadField,
    contactsField,
    seoField,
  ],
  preview: { prepare: () => ({ title: "Strategy" }) },
});

export const casesPage = defineType({
  name: "casesPage",
  title: "Case Studies",
  type: "document",
  groups: groups("Cases"),
  fields: [heroField, leadField, contactsField, seoField],
  preview: { prepare: () => ({ title: "Case Studies" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  groups: groups("Team"),
  fields: [
    heroField,
    defineField({ name: "teamHeading", title: "Heading above the team", type: "string", group: "main" }),
    defineField({ name: "teamIntro", title: "Text above the team", type: "text", rows: 3, group: "main", description: "The team itself is under Team." }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "About" }) },
});
