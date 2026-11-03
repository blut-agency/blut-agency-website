import { cache } from "react";
import cms from "@/content/cms-content.json";
import { getSanityContent } from "@/sanity/fetch";
import { projectId } from "@/sanity/env";

export interface CaseStudyAward {
  name: string;
  slug: string;
  image: string;
}

export interface CaseStudyColor {
  main: string;
  secondary: string;
  slug: string;
}

export interface CaseStudyMedia {
  vimeoId: string;
  /** Self-hosted audio file (mp3), used when there is no Vimeo ID. */
  url?: string;
  title: string;
  subline: string;
}

/** Self-hosted video file with its poster still, used when there is no Vimeo ID. */
export interface CaseStudyVideoFile {
  url: string;
  poster: string;
}

export interface CaseStudy {
  slug: string;
  internalName: string;
  title: string;
  position: number;
  showOnHomepage: boolean;
  clientListHtml: string;
  whatWeDidHtml: string;
  collaboratorsHtml: string;
  color: CaseStudyColor | null;
  useVisual: boolean[];
  visualizationJson: string;
  quoteImage: string;
  quote: string;
  quoteName: string;
  videoUnderQuoteVimeoId: string;
  introTextHtml: string;
  gallery1: string[];
  textAfterGalleryHtml: string;
  gifVideoVimeoId: string;
  gifVideoHashtags: string;
  audioPlayer1: CaseStudyMedia;
  audioPlayer2: CaseStudyMedia;
  textAfterAudioPlayerHtml: string;
  video1VimeoId: string;
  video2VimeoId: string;
  video3VimeoId: string;
  /** Self-hosted videos, shown after the Vimeo ones in the same layout. */
  videoFiles?: CaseStudyVideoFile[];
  /** The page's copy is AI-written placeholder text: shown in red with a note. */
  aiDraftCopy?: boolean;
  /** Short silent hover loop on the case's card: a video file, or a Vimeo ID. */
  previewUrl?: string;
  previewVimeoId?: string;
  gallery2: string[];
  awards: CaseStudyAward[];
  nextCaseStudySlug: string;
  /** Cases index card: client line, campaign line and thumbnail photo. */
  teaserClient: string;
  teaserCampaign: string;
  thumbnail: string;
}

export interface Location {
  name: string;
  slug: string;
  contentHtml: string;
  vimeoId: string;
  visualizationJson: string;
}

export interface Color {
  name: string;
  slug: string;
  main: string;
  secondary: string;
}

export interface Award {
  name: string;
  slug: string;
  image: string;
}

export interface HomeSound {
  vimeoId: string;
  visualizationJson: string;
}

export interface CmsContent {
  caseStudies: CaseStudy[];
  locations: Location[];
  colors: Color[];
  awards: Award[];
  homeSound: HomeSound | null;
}

export interface CasesSettings {
  /** Slug of the case pinned to the top of /case-studies. */
  pinnedCase: string;
  /** Slugs of the cases under "Featured cases" on Home, in order. */
  featuredCases: string[];
}


const json = cms as unknown as CmsContent;

/*
  Where content comes from: Sanity (the studio) when a project ID is set,
  otherwise src/content/cms-content.json, the old Webflow export.
  Cases, colour themes, awards and the cases settings live in Sanity.
  Locations and the home sound stay in the JSON file.
  Sanity content is cached and refreshed at most once a minute, so a
  published change shows on the site within about a minute.
*/
const load = cache(async (): Promise<{ content: CmsContent; settings: CasesSettings | null }> => {
  if (!projectId) return { content: json, settings: null };
  const sanity = await getSanityContent();
  return {
    content: { ...json, caseStudies: sanity.caseStudies, colors: sanity.colors, awards: sanity.awards },
    settings: sanity.settings,
  };
});

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return (await load()).content.caseStudies;
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
  return (await getCaseStudies()).find((c) => c.slug === slug);
}

export async function getHomepageCaseStudies(): Promise<CaseStudy[]> {
  return (await getCaseStudies()).filter((c) => c.showOnHomepage);
}

export async function getColors(): Promise<Color[]> {
  return (await load()).content.colors;
}

export async function getAwards(): Promise<Award[]> {
  return (await load()).content.awards;
}

/** Pinned and featured cases: from Sanity's "Cases settings", else the given defaults. */
export async function getCasesSettings(defaults: CasesSettings): Promise<CasesSettings> {
  const settings = (await load()).settings;
  return {
    pinnedCase: settings?.pinnedCase || defaults.pinnedCase,
    featuredCases: settings?.featuredCases?.length ? settings.featuredCases : defaults.featuredCases,
  };
}

export function getLocations(): Location[] {
  return json.locations;
}

export function getHomeSound(): HomeSound | null {
  return json.homeSound;
}
