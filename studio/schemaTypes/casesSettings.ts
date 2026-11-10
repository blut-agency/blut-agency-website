import { defineArrayMember, defineField, defineType } from "sanity";

/** Settings for the Cases page and the featured cases on Home. Exists once. */
export const casesSettings = defineType({
  name: "casesSettings",
  title: "Cases settings",
  type: "document",
  fields: [
    defineField({
      name: "pinnedCase",
      title: "Pinned case",
      description: "Shown first on the Cases page.",
      type: "reference",
      to: [{ type: "caseStudy" }],
    }),
    defineField({
      name: "featuredCases",
      title: "Featured cases on Home",
      description: "Drag to change the order.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] })],
      validation: (r) => r.unique(),
    }),
  ],
  preview: { prepare: () => ({ title: "Cases settings" }) },
});
