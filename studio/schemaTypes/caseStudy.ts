import { defineArrayMember, defineField, defineType } from "sanity";

/*
  One case (/project/<slug>). The tabs follow the case page from top to
  bottom: the card on the Cases list, the banner facts, the story chapters,
  then pictures, sound and video.

  Videos and audio stay files that blut hosts itself (GDPR), so the fields
  hold a path on the site or a Vimeo number, not an upload.
*/

const vimeoId = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    group: "media",
    description: "The number at the end of the Vimeo link, e.g. 1090760210.",
    validation: (r) => r.regex(/^\d+$/, { name: "Vimeo number" }),
  });

const nameList = (name: string, title: string, description: string, group: string) =>
  defineField({ name, title, description, type: "array", group, of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } });

const player = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    group: "media",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "title", type: "text", rows: 2 }),
      defineField({ name: "subline", type: "string" }),
      defineField({ name: "url", title: "Audio file path", type: "string", description: "e.g. /audio/cases/postbank-podcast-intro.mp3" }),
      defineField({ name: "vimeoId", title: "Or a Vimeo number", type: "string" }),
    ],
  });

const pictures = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    group: "media",
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
    { name: "story", title: "Story" },
    { name: "media", title: "Pictures, sound, video" },
    { name: "look", title: "Look" },
  ],
  orderings: [{ title: "Position", name: "position", by: [{ field: "position", direction: "asc" }] }],
  fields: [
    // Card: what the Cases list and Home show.
    defineField({
      name: "internalName",
      title: "Client – project",
      description: "e.g. Hyundai – Are You In. Used in the studio and in search results.",
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
    defineField({
      name: "previewUrl",
      title: "Card: hover loop (video file path)",
      type: "string",
      group: "card",
      description: "Short silent loop that plays on hover, e.g. /videos/previews/vw-beats.mp4",
    }),
    defineField({ name: "previewVimeoId", title: "Card: hover loop (or a Vimeo number)", type: "string", group: "card" }),
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

    // Story: the three chapters and the quote.
    defineField({ name: "introText", title: "Chapter 1: the brief", type: "richText", group: "story" }),
    defineField({ name: "quote", type: "text", rows: 3, group: "story" }),
    defineField({ name: "quoteName", title: "Quote by", type: "string", group: "story" }),
    defineField({ name: "quoteImage", title: "Quote photo", type: "image", group: "story" }),
    defineField({ name: "textAfterGallery", title: "Chapter 2: the making", type: "richText", group: "story" }),
    defineField({ name: "textAfterAudioPlayer", title: "Chapter 3: the result", type: "richText", group: "story" }),
    defineField({
      name: "aiDraftCopy",
      title: "Text is a placeholder",
      description: "Marks the text with an asterisk until the team writes the real copy.",
      type: "boolean",
      group: "story",
      initialValue: false,
    }),
    defineField({ name: "nextCaseStudy", title: "Next case", type: "reference", to: [{ type: "caseStudy" }], group: "story" }),

    // Pictures, sound and video, in page order.
    vimeoId("videoUnderQuoteVimeoId", "Video under the quote (Vimeo number)"),
    pictures("gallery1", "Picture strip 1"),
    vimeoId("gifVideoVimeoId", "Short loop (Vimeo number)"),
    defineField({ name: "gifVideoHashtags", title: "Short loop hashtags", type: "string", group: "media" }),
    player("audioPlayer1", "Audio player 1"),
    player("audioPlayer2", "Audio player 2"),
    vimeoId("video1VimeoId", "Video 1 (Vimeo number)"),
    vimeoId("video2VimeoId", "Video 2 (Vimeo number)"),
    vimeoId("video3VimeoId", "Video 3 (Vimeo number)"),
    defineField({
      name: "videoFiles",
      title: "Video files",
      description: "Videos hosted on the site, shown after the Vimeo ones.",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "url", title: "Video file path", type: "string", description: "e.g. /videos/cases/postbank-soundlogo.mp4", validation: (r) => r.required() }),
            defineField({ name: "poster", title: "Still image path", type: "string" }),
          ],
          preview: { select: { title: "url" } },
        }),
      ],
    }),
    pictures("gallery2", "Picture strip 2"),

    // Look: colours and the animated sound visual.
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
    select: { title: "internalName", media: "thumbnail", position: "position" },
    prepare: ({ title, media, position }) => ({ title: `${position ?? "–"}. ${title ?? "New case"}`, media }),
  },
});
