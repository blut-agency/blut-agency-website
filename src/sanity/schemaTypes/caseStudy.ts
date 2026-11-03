import { defineArrayMember, defineField, defineType } from "sanity";

/*
  One case (/project/<slug>). Field for field the old Webflow CMS case, which
  src/content/cms-content.json still holds as the fallback. Grouped into tabs
  so editors see the card, the facts, the story and the media apart.
*/

const vimeoId = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "string",
    group: "media",
    description: description ?? "The number at the end of the Vimeo link, e.g. 1090760210.",
    validation: (r) => r.regex(/^\d+$/, { name: "Vimeo ID" }),
  });

const tagList = (name: string, title: string, description: string, group: string) =>
  defineField({ name, title, description, type: "array", group, of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } });

const player = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    group: "media",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "vimeoId", title: "Vimeo ID", type: "string" }),
      defineField({ name: "url", title: "Or an mp3 path on the site", type: "string", description: "e.g. /audio/cases/postbank-podcast-intro.mp3" }),
      defineField({ name: "title", type: "text", rows: 2 }),
      defineField({ name: "subline", type: "string" }),
    ],
  });

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case",
  type: "document",
  groups: [
    { name: "card", title: "Card", default: true },
    { name: "facts", title: "Facts" },
    { name: "story", title: "Story" },
    { name: "media", title: "Media" },
    { name: "look", title: "Look" },
  ],
  orderings: [{ title: "Position", name: "position", by: [{ field: "position", direction: "asc" }] }],
  fields: [
    // Card: what the Cases list and Home show.
    defineField({ name: "internalName", title: "Name in the studio", type: "string", group: "card", validation: (r) => r.required() }),
    defineField({ name: "title", title: "Page title", type: "string", group: "card", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      description: "The part after /project/. Changing it breaks old links.",
      type: "slug",
      group: "card",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "position", title: "Position in the list", type: "number", group: "card", validation: (r) => r.required().integer().min(1) }),
    defineField({ name: "showOnHomepage", title: "Show on Home", type: "boolean", group: "card", initialValue: false }),
    defineField({ name: "teaserClient", title: "Card: client line", type: "string", group: "card" }),
    defineField({ name: "teaserCampaign", title: "Card: campaign line", type: "string", group: "card" }),
    defineField({ name: "thumbnail", title: "Card: photo", type: "image", group: "card", options: { hotspot: true } }),
    defineField({ name: "previewVimeoId", title: "Card: hover loop (Vimeo ID)", type: "string", group: "card", description: "Short silent loop that plays when the card is hovered." }),
    defineField({ name: "previewUrl", title: "Card: hover loop (video path on the site)", type: "string", group: "card", description: "Used instead of a Vimeo loop, e.g. /videos/previews/vw-beats.mp4" }),

    // Facts: the banner lists. "What we did" also drives the filter pills.
    tagList("clients", "Client", "One entry per name.", "facts"),
    tagList("whatWeDid", "What we did", "Service tags. These become the filter pills on the Cases page. Sonic Strategy and Sonic Branding count as Strategy; Content Production and Artist Partnership as Production.", "facts"),
    tagList("collaborators", "Collaborators", "Agencies and partners.", "facts"),
    defineField({ name: "awards", type: "array", group: "facts", of: [defineArrayMember({ type: "reference", to: [{ type: "award" }] })] }),

    // Story: the three chapters and the quote between them.
    defineField({ name: "introText", title: "Chapter 1: the brief", type: "richText", group: "story" }),
    defineField({ name: "quote", type: "text", rows: 3, group: "story" }),
    defineField({ name: "quoteName", title: "Quote by", type: "string", group: "story" }),
    defineField({ name: "quoteImage", title: "Quote photo", type: "image", group: "story", options: { hotspot: true } }),
    defineField({ name: "textAfterGallery", title: "Chapter 2: the making", type: "richText", group: "story" }),
    defineField({ name: "textAfterAudioPlayer", title: "Chapter 3: the result", type: "richText", group: "story" }),
    defineField({ name: "aiDraftCopy", title: "Text is an AI draft", description: "Marks the copy as placeholder text on the page.", type: "boolean", group: "story", initialValue: false }),
    defineField({ name: "nextCaseStudy", title: "Next case", type: "reference", to: [{ type: "caseStudy" }], group: "story" }),

    // Media.
    vimeoId("videoUnderQuoteVimeoId", "Video under the quote (Vimeo ID)"),
    defineField({ name: "gallery1", title: "Picture strip 1", type: "array", group: "media", of: [defineArrayMember({ type: "image" })], options: { layout: "grid" } }),
    vimeoId("gifVideoVimeoId", "GIF loop (Vimeo ID)"),
    defineField({ name: "gifVideoHashtags", title: "GIF loop hashtags", type: "string", group: "media" }),
    player("audioPlayer1", "Audio player 1"),
    player("audioPlayer2", "Audio player 2"),
    vimeoId("video1VimeoId", "Video 1 (Vimeo ID)"),
    vimeoId("video2VimeoId", "Video 2 (Vimeo ID)"),
    vimeoId("video3VimeoId", "Video 3 (Vimeo ID)"),
    defineField({
      name: "videoFiles",
      title: "Video files on the site",
      description: "Shown after the Vimeo videos. Paths to files in the site's public folder.",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "url", title: "Video path", type: "string", validation: (r) => r.required() }),
            defineField({ name: "poster", title: "Poster image path", type: "string" }),
          ],
          preview: { select: { title: "url" } },
        }),
      ],
    }),
    defineField({ name: "gallery2", title: "Picture strip 2", type: "array", group: "media", of: [defineArrayMember({ type: "image" })], options: { layout: "grid" } }),

    // Look: colours and the animated sound visual.
    defineField({ name: "color", title: "Colour theme", type: "reference", to: [{ type: "colorTheme" }], group: "look" }),
    defineField({
      name: "visual",
      title: "Visual shape",
      type: "number",
      group: "look",
      options: { list: [1, 2, 3, 4].map((n) => ({ title: `Shape ${n}`, value: n })), layout: "radio", direction: "horizontal" },
      initialValue: 1,
    }),
    defineField({
      name: "visualizationJson",
      title: "Sound wave data",
      description: "Technical data for the animated visual. Leave as it is.",
      type: "text",
      rows: 2,
      group: "look",
    }),
  ],
  preview: {
    select: { title: "internalName", subtitle: "teaserCampaign", media: "thumbnail", position: "position" },
    prepare: ({ title, subtitle, media, position }) => ({ title: `${position ?? "–"}. ${title}`, subtitle, media }),
  },
});
