import { createClient } from "next-sanity";
import { toHTML, type PortableTextComponents } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";
import type { Award, CaseStudy, CasesSettings, Color } from "@/lib/content";
import { apiVersion, dataset, projectId } from "./env";

/*
  Reads cases from Sanity and turns them into the same shape as the old
  Webflow export, so the pages need no changes: lists become <ul><li> HTML,
  rich text becomes the h2/p HTML the case pages render.
*/

// Made on first use: without a project ID the site never calls Sanity.
let client: ReturnType<typeof createClient> | null = null;
const sanity = () => (client ??= createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" }));

/** Seconds a fetched result stays fresh. */
const REVALIDATE = 60;

const IMAGE = `asset->url`;
const RICH = `[]{..., _type == "image" => { "url": asset->url }}`;

const QUERY = `{
  "caseStudies": *[_type == "caseStudy" && defined(slug.current)] | order(position asc) {
    "slug": slug.current, internalName, title, position, showOnHomepage,
    clients, whatWeDid, collaborators,
    "color": color->{ "main": main, "secondary": secondary, "slug": slug.current },
    visual, visualizationJson,
    "quoteImage": quoteImage.${IMAGE}, quote, quoteName, videoUnderQuoteVimeoId,
    "introText": introText${RICH},
    "gallery1": gallery1[].${IMAGE},
    "textAfterGallery": textAfterGallery${RICH},
    gifVideoVimeoId, gifVideoHashtags, audioPlayer1, audioPlayer2,
    "textAfterAudioPlayer": textAfterAudioPlayer${RICH},
    video1VimeoId, video2VimeoId, video3VimeoId, videoFiles[]{ url, poster },
    aiDraftCopy, previewUrl, previewVimeoId,
    "gallery2": gallery2[].${IMAGE},
    "awards": awards[]->{ name, "slug": slug.current, "image": image.${IMAGE} },
    "nextCaseStudySlug": nextCaseStudy->slug.current,
    teaserClient, teaserCampaign, "thumbnail": thumbnail.${IMAGE}
  },
  "colors": *[_type == "colorTheme"] | order(coalesce(order, 999) asc, name asc) { name, "slug": slug.current, main, secondary },
  "awards": *[_type == "award"] | order(name asc) { name, "slug": slug.current, "image": image.${IMAGE} },
  "settings": *[_id == "casesPage"][0]{ "pinnedCase": pinnedCase->slug.current, "featuredCases": featuredCases[]->slug.current }
}`;

type RawPlayer = { vimeoId?: string; url?: string; title?: string; subline?: string } | null;

type RawCase = Omit<
  CaseStudy,
  | "clientListHtml" | "whatWeDidHtml" | "collaboratorsHtml" | "useVisual" | "introTextHtml" | "textAfterGalleryHtml"
  | "textAfterAudioPlayerHtml" | "audioPlayer1" | "audioPlayer2" | "awards" | "gallery1" | "gallery2"
> & {
  clients?: string[];
  whatWeDid?: string[];
  collaborators?: string[];
  visual?: number;
  introText?: PortableTextBlock[];
  textAfterGallery?: PortableTextBlock[];
  textAfterAudioPlayer?: PortableTextBlock[];
  audioPlayer1?: RawPlayer;
  audioPlayer2?: RawPlayer;
  gallery1?: (string | null)[] | null;
  gallery2?: (string | null)[] | null;
  awards?: (Award | null)[] | null;
};

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const list = (items?: string[] | null) => (items?.length ? `<ul>${items.map((i) => `<li>${escape(i)}</li>`).join("")}</ul>` : "");

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { url?: string } }) => (value.url ? `<figure class="w-richtext-figure-type-image w-richtext-align-fullwidth"><div><img alt="" src="${value.url}" loading="lazy"></div></figure>` : ""),
  },
  marks: {
    link: ({ children, value }) => `<a href="${escape(value?.href ?? "")}" target="_blank">${children}</a>`,
  },
};

const rich = (blocks?: PortableTextBlock[] | null) => (blocks?.length ? toHTML(blocks, { components }) : "");

const player = (p: RawPlayer) => ({ vimeoId: p?.vimeoId ?? "", url: p?.url || undefined, title: p?.title ?? "", subline: p?.subline ?? "" });

const urls = (images?: (string | null)[] | null) => (images ?? []).filter((u): u is string => Boolean(u));

function toCaseStudy(raw: RawCase): CaseStudy {
  const { clients, whatWeDid, collaborators, visual, introText, textAfterGallery, textAfterAudioPlayer, ...rest } = raw;
  return {
    ...rest,
    internalName: raw.internalName ?? "",
    title: raw.title ?? "",
    position: raw.position ?? 99,
    showOnHomepage: Boolean(raw.showOnHomepage),
    clientListHtml: list(clients),
    whatWeDidHtml: list(whatWeDid),
    collaboratorsHtml: list(collaborators),
    useVisual: [1, 2, 3, 4].map((n) => n === (visual ?? 1)),
    visualizationJson: raw.visualizationJson ?? "",
    quoteImage: raw.quoteImage ?? "",
    quote: raw.quote ?? "",
    quoteName: raw.quoteName ?? "",
    videoUnderQuoteVimeoId: raw.videoUnderQuoteVimeoId ?? "",
    introTextHtml: rich(introText),
    gallery1: urls(raw.gallery1),
    textAfterGalleryHtml: rich(textAfterGallery),
    gifVideoVimeoId: raw.gifVideoVimeoId ?? "",
    gifVideoHashtags: raw.gifVideoHashtags ?? "",
    audioPlayer1: player(raw.audioPlayer1 ?? null),
    audioPlayer2: player(raw.audioPlayer2 ?? null),
    textAfterAudioPlayerHtml: rich(textAfterAudioPlayer),
    video1VimeoId: raw.video1VimeoId ?? "",
    video2VimeoId: raw.video2VimeoId ?? "",
    video3VimeoId: raw.video3VimeoId ?? "",
    videoFiles: raw.videoFiles?.length ? raw.videoFiles : undefined,
    aiDraftCopy: raw.aiDraftCopy || undefined,
    previewUrl: raw.previewUrl || undefined,
    previewVimeoId: raw.previewVimeoId || undefined,
    gallery2: urls(raw.gallery2),
    awards: (raw.awards ?? []).filter((a): a is Award => Boolean(a)),
    nextCaseStudySlug: raw.nextCaseStudySlug ?? "",
    teaserClient: raw.teaserClient ?? "",
    teaserCampaign: raw.teaserCampaign ?? "",
    thumbnail: raw.thumbnail ?? "",
  };
}

export async function getSanityContent(): Promise<{
  caseStudies: CaseStudy[];
  colors: Color[];
  awards: Award[];
  settings: CasesSettings | null;
}> {
  const data = await sanity().fetch<{
    caseStudies: RawCase[];
    colors: Color[];
    awards: Award[];
    settings: { pinnedCase?: string | null; featuredCases?: (string | null)[] | null } | null;
  }>(QUERY, {}, { next: { revalidate: REVALIDATE, tags: ["sanity"] } });
  return {
    caseStudies: data.caseStudies.map(toCaseStudy),
    colors: data.colors,
    awards: data.awards,
    settings: data.settings
      ? {
          pinnedCase: data.settings.pinnedCase ?? "",
          featuredCases: (data.settings.featuredCases ?? []).filter((s): s is string => Boolean(s)),
        }
      : null,
  };
}
