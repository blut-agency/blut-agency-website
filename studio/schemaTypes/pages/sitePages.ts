import { defineArrayMember, defineField, defineType } from "sanity";

/** Texts every page shares: menu, contact block, footer. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Menu and footer",
  type: "document",
  groups: [
    { name: "menu", title: "Menu", default: true },
    { name: "contact", title: "Contact block" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({ name: "menu", title: "Menu links", description: "Drag to change the order.", type: "array", group: "menu", of: [defineArrayMember({ type: "cta" })] }),
    defineField({ name: "contactHeading", title: "Heading", type: "text", rows: 2, group: "contact", description: "The black block near the end of most pages. Enter starts a new line." }),
    defineField({ name: "contactEmail", title: "General email", type: "string", group: "contact" }),
    defineField({ name: "mailLabel", title: "Mail link words", type: "string", group: "contact" }),
    defineField({
      name: "footerContact",
      title: "Contact column",
      description: "One entry per line group. Enter starts a new line within an entry. The general email becomes a link.",
      type: "array",
      group: "footer",
      of: [defineArrayMember({ type: "text", rows: 2 })],
    }),
    defineField({ name: "footerLegal", title: "Legal links", type: "array", group: "footer", of: [defineArrayMember({ type: "cta" })] }),
    defineField({ name: "footerSocial", title: "Social links", type: "array", group: "footer", of: [defineArrayMember({ type: "cta" })] }),
  ],
  preview: { prepare: () => ({ title: "Menu and footer" }) },
});

const legalPage = (name: string, title: string) =>
  defineType({
    name,
    title,
    type: "document",
    fields: [
      defineField({ name: "body", title: "Text", type: "legalText" }),
      defineField({ name: "seo", title: "Search and sharing", type: "seo" }),
    ],
    preview: { prepare: () => ({ title }) },
  });

export const imprintPage = legalPage("imprintPage", "Imprint");
export const privacyPage = legalPage("privacyPage", "Privacy Policy");
