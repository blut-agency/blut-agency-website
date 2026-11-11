/*
  The case builder: a case page is a list of sections that editors add,
  remove and reorder in the studio. The banner (with its facts), the
  "next case" teaser, the contact block and the footer stay fixed.

  Cases without a section list (the JSON in the repo, or a case saved before
  the builder) get one from their old fixed fields, in the old fixed order,
  so they render exactly as before. The studio import uses the same function.

  This file has no site imports, so the studio's import script can use it too.
*/

/** A video file with its still (same shape as CaseStudyVideoFile in content.ts). */
export interface SectionVideo {
  url: string;
  poster: string;
  label?: string;
}

/** The old fixed case fields this file reads (a subset of CaseStudy in content.ts). */
export interface LegacyCase {
  teaserClient: string;
  introTextHtml: string;
  quote: string;
  quoteName: string;
  quoteImage: string;
  videoUnderQuote?: SectionVideo;
  gallery1: string[];
  textAfterGalleryHtml: string;
  loopUrl?: string;
  gifVideoHashtags: string;
  audioPlayer1: { url?: string; title: string; subline: string };
  audioPlayer2: { url?: string; title: string; subline: string };
  textAfterAudioPlayerHtml: string;
  videoFiles?: SectionVideo[];
  gallery2: string[];
  sections?: CaseSection[];
}

/** A chapter: stage name, the question line under it, and the text. */
export interface ChapterSection {
  type: "caseChapter";
  stage: string;
  line?: string;
  /** HTML. */
  body?: string;
  /** Show the "Want to know more about how we work?" link under the text. */
  cta?: boolean;
}
export interface QuoteSection {
  type: "caseQuote";
  quote: string;
  name?: string;
  photo?: string;
}
export interface VideosSection {
  type: "caseVideos";
  videos: SectionVideo[];
}
export interface GallerySection {
  type: "caseGallery";
  images: string[];
}
export interface LoopSection {
  type: "caseLoop";
  url: string;
  hashtags?: string;
}
export interface AudioSection {
  type: "caseAudio";
  title?: string;
  subline?: string;
  url: string;
}
export interface AwardsSection {
  type: "caseAwards";
  heading?: string;
}

export type CaseSection = ChapterSection | QuoteSection | VideosSection | GallerySection | LoopSection | AudioSection | AwardsSection;

/** The placeholder stage names (asterisk: AI-written, to be replaced). */
export const STAGES = ["The brief", "The making", "The result"];

/** An old text field's first h2 becomes the chapter's line, the rest its body. */
export function splitChapter(html: string): { line: string; body: string } {
  const m = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const line = (m?.[1] ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
  // Webflow's placeholder alt text would be read out; the pictures are decorative.
  const body = (m ? html.replace(m[0], "") : html).replace(/alt="__wf_reserved_inherit"/g, 'alt=""');
  return { line, body };
}

/** The old fixed layout as a section list. */
export function legacySections(cs: LegacyCase): CaseSection[] {
  const out: CaseSection[] = [];
  const chapter = (stage: string, html: string, cta = false) => {
    if (!html) return;
    const { line, body } = splitChapter(html);
    out.push({ type: "caseChapter", stage, line, body, ...(cta ? { cta } : {}) });
  };
  const film = (file: SectionVideo, label: string) => ({ ...file, label: file.label ?? label });

  chapter(STAGES[0], cs.introTextHtml);
  if (cs.quote) out.push({ type: "caseQuote", quote: cs.quote, name: cs.quoteName, photo: cs.quoteImage });
  if (cs.videoUnderQuote) out.push({ type: "caseVideos", videos: [film(cs.videoUnderQuote, `${cs.teaserClient} film`)] });
  if (cs.gallery1.length) out.push({ type: "caseGallery", images: cs.gallery1 });
  chapter(STAGES[1], cs.textAfterGalleryHtml);
  if (cs.loopUrl) out.push({ type: "caseLoop", url: cs.loopUrl, hashtags: cs.gifVideoHashtags });
  for (const a of [cs.audioPlayer1, cs.audioPlayer2]) {
    if (a.url) out.push({ type: "caseAudio", title: a.title, subline: a.subline, url: a.url });
  }
  chapter(STAGES[2], cs.textAfterAudioPlayerHtml, true);
  const videos = cs.videoFiles ?? [];
  if (videos.length) out.push({ type: "caseVideos", videos: videos.map((v, i) => film(v, `${cs.teaserClient} film ${i + 1}`)) });
  out.push({ type: "caseAwards" });
  if (cs.gallery2.length) out.push({ type: "caseGallery", images: cs.gallery2 });
  return out;
}

/** The case's sections: its own list, or the old layout. */
export function caseSections(cs: LegacyCase): CaseSection[] {
  return cs.sections ?? legacySections(cs);
}
