import { defineArrayMember, defineField, defineType } from "sanity";

/*
  One case (/project/<slug>). The tabs follow the case page from top to
  bottom: the card on the Cases list, the banner facts, then the page's
  sections (the case builder: chapters, quote, videos, pictures, loop, audio
  and awards in any order).

  The old fixed fields (three chapters, quote, galleries, players, videos)
  stay in the data but are hidden: a case without sections still shows them
  in the old order, and the import builds each case's sections from them.

  Videos and audio live in blut's own media folder (Nextcloud, GDPR), so the
  fields hold a file path like /media/hyundai-film.mp4, not an upload.
*/

export const MEDIA = "A file in blut's media folder, e.g. /media/hyundai-film.mp4";

const mediaPath = (name: string, title: string, group = "page", description = MEDIA, hidden = false) =>
  defineField({
    name,
    title,
    type: "string",
    group,
    description,
    hidden,
    validation: (r) => r.regex(/^(\/|https:\/\/)/, { name: "file path starting with /media/" }),
  });


const nameList = (name: string, title: string, description: string, group: string) =>
  defineField({ name, title, description, type: "array", group, of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } });

const player = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    group: "page",
    hidden: true,
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "title", type: "text", rows: 2 }),
      defineField({ name: "subline", type: "string" }),
      defineField({ name: "url", title: "Audio file", type: "string", description: "e.g. /media/hyundai-audio.m4a" }),
    ],
  });

const pictures = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    group: "page",
    hidden: true,
    of: [defineArrayMember({ type: "image" })],
    options: { layout: "grid" },
  });

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case",
  type: "document",
  groups: [
    { name: "card", title: "Card", default: true },
    { name: "facts", title: "Facts" },
    { name: "page", title: "Page sections" },
    { name: "look", title: "Look" },
  ],
  orderings: [{ title: "Position", name: "position", by: [{ field: "position", direction: "asc" }] }],
  fields: [
    // Card: what the Cases list and Home show.
    defineField({
      name: "internalName",
      title: "Name in the studio",
      description: "Client – project, e.g. Hyundai – Are You In. Only shown here in the studio, not on the site.",
      type: "string",
      group: "card",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Page title", type: "string", group: "card", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      description: "The part after /project/. Changing it breaks old links.",
      type: "slug",
      group: "card",
      options: { source: "internalName" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "position",
      title: "Position in the list",
      description: "1 comes first.",
      type: "number",
      group: "card",
      validation: (r) => r.required().integer().min(1),
    }),
    defineField({
      name: "published",
      title: "Show on the site",
      description: "Off: the case stays here but the site leaves it out, also from the lists and the “Next case” links.",
      type: "boolean",
      group: "card",
      initialValue: true,
    }),
    defineField({ name: "teaserClient", title: "Card: client line", type: "string", group: "card" }),
    defineField({ name: "teaserCampaign", title: "Card: campaign line", type: "string", group: "card" }),
    defineField({ name: "thumbnail", title: "Card: photo", type: "image", group: "card" }),
    defineField({
      name: "thumbnailPosition",
      title: "Card: photo focus",
      type: "string",
      group: "card",
      description: "Where the crop centres, e.g. 50% 10% keeps the top. Leave empty for the centre.",
    }),
    mediaPath("previewUrl", "Card: hover loop", "card", "Short silent video that plays on hover, e.g. /media/hyundai-loop.mp4"),
    defineField({ name: "showOnHomepage", title: "Show on Home", type: "boolean", group: "card", initialValue: false, hidden: true }),

    // Facts: the banner lists. "What we did" also drives the filter pills.
    nameList("clients", "Client", "One entry per name.", "facts"),
    nameList(
      "whatWeDid",
      "What we did",
      "These become the filter pills on the Cases page. Sonic Strategy and Sonic Branding count as Strategy. Content Production and Artist Partnership count as Production.",
      "facts",
    ),
    nameList("collaborators", "Collaborators", "Agencies and partners.", "facts"),
    defineField({ name: "awards", type: "array", group: "facts", of: [defineArrayMember({ type: "reference", to: [{ type: "award" }] })] }),

    // Page: the case builder.
    defineField({
      name: "sections",
      title: "Page sections",
      description: "The case page between the banner and “Next case”. Add, remove and drag sections to change the page.",
      type: "array",
      group: "page",
      of: ["caseChapter", "caseQuote", "caseVideos", "caseGallery", "caseLoop", "caseAudio", "caseAwards"].map((type) => defineArrayMember({ type })),
    }),

    // Old fixed fields: hidden, kept for cases without sections.
    defineField({ name: "introText", hidden: true, title: "Chapter 1: the brief", type: "richText", group: "page" }),
    defineField({ name: "quote", hidden: true, type: "text", rows: 3, group: "page" }),
    defineField({ name: "quoteName", hidden: true, title: "Quote by", type: "string", group: "page" }),
    defineField({ name: "quoteImage", hidden: true, title: "Quote photo", type: "image", group: "page" }),
    defineField({ name: "textAfterGallery", hidden: true, title: "Chapter 2: the making", type: "richText", group: "page" }),
    defineField({ name: "textAfterAudioPlayer", hidden: true, title: "Chapter 3: the result", type: "richText", group: "page" }),
    defineField({
      name: "aiDraftCopy",
      title: "Text is a placeholder",
      description: "No longer shown on the site.",
      type: "boolean",
      hidden: true,
      group: "page",
      initialValue: false,
    }),
    defineField({ name: "nextCaseStudy", title: "Next case", type: "reference", to: [{ type: "caseStudy" }], group: "page" }),

    defineField({ name: "videoUnderQuote", hidden: true, title: "Video under the quote", type: "videoFile", group: "page" }),
    pictures("gallery1", "Picture strip 1"),
    mediaPath("loopUrl", "Short loop", "page", "Short silent video, e.g. /media/hyundai-loop.mp4", true),
    defineField({ name: "gifVideoHashtags", hidden: true, title: "Short loop hashtags", type: "string", group: "page" }),
    player("audioPlayer1", "Audio player 1"),
    player("audioPlayer2", "Audio player 2"),
    defineField({
      name: "videoFiles",
      hidden: true,
      title: "Videos",
      description: "The films near the end of the page, in this order.",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "videoFile" })],
    }),
    pictures("gallery2", "Picture strip 2"),

    // Look: colours and the animated sound visual.
    defineField({
      name: "colorFromPhoto",
      title: "Pick the colour from the card photo",
      description:
        "On: each time the site is built, the case gets the colour theme closest to its card photo. Off: it keeps the colour theme below. A grey photo also keeps the colour theme below.",
      type: "boolean",
      group: "look",
      initialValue: true,
    }),
    defineField({ name: "color", title: "Colour theme", type: "reference", to: [{ type: "colorTheme" }], group: "look" }),
    defineField({
      name: "visual",
      title: "Sound visual shape",
      type: "number",
      group: "look",
      options: { list: [1, 2, 3, 4].map((n) => ({ title: `Shape ${n}`, value: n })), layout: "radio", direction: "horizontal" },
      initialValue: 1,
    }),
    defineField({
      name: "visualizationJson",
      title: "Sound wave data",
      description: "Technical data for the animated visual. Leave it as it is.",
      type: "text",
      rows: 2,
      group: "look",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "internalName", media: "thumbnail", position: "position", published: "published" },
    prepare: ({ title, media, position, published }) => ({
      title: `${position ?? "–"}. ${title ?? "New case"}`,
      subtitle: published === false ? "Hidden from the site" : undefined,
      media,
    }),
  },
});
