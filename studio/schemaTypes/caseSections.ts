import { defineArrayMember, defineField, defineType } from "sanity";
import { MEDIA } from "./caseStudy";

/*
  The case builder's sections. A case page shows them in the order of the
  case's "Page sections" list; editors add, remove and drag them. Each one
  matches a part of the current case layout, so nothing new is designed here.
  The site's matching code is src/lib/caseSections.ts.
*/

const text = (s?: string) => (s ?? "").replace(/\s+/g, " ").trim();

export const caseChapter = defineType({
  name: "caseChapter",
  title: "Text chapter",
  type: "object",
  fields: [
    defineField({
      name: "stage",
      title: "Stage name",
      description: "The big heading, e.g. The brief. An asterisk (*) marks placeholder text.",
      type: "string",
    }),
    defineField({ name: "line", title: "Question line", description: "The line under the stage name.", type: "string" }),
    defineField({ name: "body", title: "Text", type: "richText" }),
    defineField({
      name: "cta",
      title: "Show the “how we work” link",
      description: "Adds “Want to know more about how we work?” under the text.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { stage: "stage", line: "line" },
    prepare: ({ stage, line }) => ({ title: `Chapter: ${text(stage) || "–"}`, subtitle: text(line) }),
  },
});

export const caseQuote = defineType({
  name: "caseQuote",
  title: "Quote",
  type: "object",
  fields: [
    defineField({ name: "quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Quote by", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "image" }),
  ],
  preview: {
    select: { quote: "quote", name: "name", media: "photo" },
    prepare: ({ quote, name, media }) => ({ title: `Quote: ${text(quote)}`, subtitle: text(name), media }),
  },
});

export const caseVideos = defineType({
  name: "caseVideos",
  title: "Videos",
  type: "object",
  fields: [
    defineField({
      name: "videos",
      description: "One or more films, shown one under the other. Each opens the video player.",
      type: "array",
      of: [defineArrayMember({ type: "videoFile" })],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { videos: "videos" },
    prepare: ({ videos }) => ({ title: `Videos (${videos?.length ?? 0})`, subtitle: (videos ?? []).map((v: { url?: string }) => v.url).join(", ") }),
  },
});

export const caseGallery = defineType({
  name: "caseGallery",
  title: "Picture strip",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Pictures",
      description: "A full-width strip that scrolls sideways.",
      type: "array",
      of: [defineArrayMember({ type: "image" })],
      options: { layout: "grid" },
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { images: "images", media: "images.0" },
    prepare: ({ images, media }) => ({ title: `Picture strip (${images?.length ?? 0})`, media }),
  },
});

export const caseLoop = defineType({
  name: "caseLoop",
  title: "Short loop",
  type: "object",
  fields: [
    defineField({ name: "url", title: "Loop file", type: "string", description: `Short silent video. ${MEDIA}`, validation: (r) => r.required() }),
    defineField({ name: "hashtags", type: "string", description: "Shown under the loop, e.g. #sound #brand" }),
  ],
  preview: { select: { url: "url", hashtags: "hashtags" }, prepare: ({ url, hashtags }) => ({ title: "Short loop", subtitle: text(hashtags) || url }) },
});

export const caseAudio = defineType({
  name: "caseAudio",
  title: "Audio player",
  type: "object",
  fields: [
    defineField({ name: "title", type: "text", rows: 2 }),
    defineField({ name: "subline", type: "string" }),
    defineField({ name: "url", title: "Audio file", type: "string", description: "e.g. /media/hyundai-audio.m4a", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", url: "url" }, prepare: ({ title, url }) => ({ title: `Audio: ${text(title) || "–"}`, subtitle: url }) },
});

export const caseAwards = defineType({
  name: "caseAwards",
  title: "Awards",
  type: "object",
  description: "Shows the awards picked under Facts. Nothing shows when there are none.",
  fields: [defineField({ name: "heading", type: "string", initialValue: "Awarded at", description: "Leave empty for “Awarded at”." })],
  preview: { select: { heading: "heading" }, prepare: ({ heading }) => ({ title: `Awards: ${text(heading) || "Awarded at"}` }) },
});

export const CASE_SECTION_TYPES = [caseChapter, caseQuote, caseVideos, caseGallery, caseLoop, caseAudio, caseAwards];
