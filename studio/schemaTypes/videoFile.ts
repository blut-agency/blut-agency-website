import { defineField, defineType } from "sanity";
import { MEDIA } from "./caseStudy";

/** A video in blut's media folder, with the still shown before it plays. */
export const videoFile = defineType({
  name: "videoFile",
  title: "Video",
  type: "object",
  fields: [
    defineField({ name: "url", title: "Video file", type: "string", description: MEDIA, validation: (r) => r.required() }),
    defineField({ name: "poster", title: "Still image file", type: "string", description: "Shown before the video plays, e.g. /media/hyundai-film.jpg" }),
  ],
  preview: { select: { title: "url" } },
});
