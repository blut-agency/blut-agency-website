import { defineArrayMember, defineField, defineType } from "sanity";

const word = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: "string", validation: (r) => r.required() });

/** Texts every page shares: menu, contact block, footer, welcome card, small words, the 404 page. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Shared texts",
  type: "document",
  groups: [
    { name: "menu", title: "Menu", default: true },
    { name: "contact", title: "Contact block" },
    { name: "footer", title: "Footer" },
    { name: "welcome", title: "Welcome card" },
    { name: "words", title: "Small words" },
    { name: "notFound", title: "Page not found" },
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

    defineField({
      name: "welcome",
      title: "Welcome card",
      description: "The small card that slides in on a first visit. Add ?recap=1 to a link to always show it.",
      type: "object",
      group: "welcome",
      fields: [
        defineField({ name: "title", title: "First words", type: "string", description: "In white, e.g. It’s been a minute." }),
        defineField({ name: "text", title: "Next words", type: "string", description: "In grey, e.g. Here’s what we’ve been up to." }),
        defineField({ name: "button", title: "Button", type: "string" }),
        defineField({ name: "video", title: "Film", type: "string", description: "Plays with sound in the video player, e.g. /media/blut-recap-web.mp4" }),
        defineField({ name: "teaser", title: "Card loop", type: "string", description: "Short silent loop in the card." }),
        defineField({ name: "poster", title: "Still", type: "string", description: "Shown until the video loads, e.g. /images/welcome/blut-recap-poster.jpg" }),
      ],
    }),

    defineField({
      name: "labels",
      title: "Small words",
      description: "Words the site repeats in many places.",
      type: "object",
      group: "words",
      fields: [
        word("readMore", "Case card link", "Under each case card, e.g. Read more."),
        word("playVideo", "Play button", "On every film still."),
        word("filterAll", "Cases filter: first button"),
        word("caseClient", "Case banner: client"),
        word("caseWhatWeDid", "Case banner: what we did"),
        word("caseCollaborators", "Case banner: collaborators"),
        defineField({ name: "caseChapterLink", title: "Case chapter link", type: "cta", description: "Shown under a case chapter that has the link switched on." }),
        word("nextCase", "Case: next case heading"),
      ],
    }),

    defineField({
      name: "notFound",
      title: "Page not found",
      description: "The page people see after a broken link.",
      type: "object",
      group: "notFound",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "text", type: "string" }),
        defineField({ name: "button", title: "Button to Home", type: "string" }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Shared texts" }) },
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
