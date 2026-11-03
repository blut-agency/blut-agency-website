import { defineArrayMember, defineField, defineType } from "sanity";

/** One settings document: which cases are pinned and featured. */
export const casesPage = defineType({
  name: "casesPage",
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
      description: "In this order.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "caseStudy" }] })],
      validation: (r) => r.unique(),
    }),
  ],
  preview: { prepare: () => ({ title: "Cases settings" }) },
});
