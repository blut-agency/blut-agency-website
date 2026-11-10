import cms from "@/content/cms-content.json";
import type { CaseSection } from "./caseSections";

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
  /** Audio file. */
  url?: string;
  title: string;
  subline: string;
}

/** Video file with its poster still. */
export interface CaseStudyVideoFile {
  url: string;
  poster: string;
  /** Name for screen readers and the lightbox. */
  label?: string;
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
  videoUnderQuote?: CaseStudyVideoFile;
  introTextHtml: string;
  gallery1: string[];
  textAfterGalleryHtml: string;
  /** Short silent loop on the case page. */
  loopUrl?: string;
  gifVideoHashtags: string;
  audioPlayer1: CaseStudyMedia;
  audioPlayer2: CaseStudyMedia;
  textAfterAudioPlayerHtml: string;
  videoFiles?: CaseStudyVideoFile[];
  /** The case builder's section list (studio). Without it the page uses the fields above in the old order. */
  sections?: CaseSection[];
  /** The page's copy is AI-written placeholder text: shown in red with a note. */
  aiDraftCopy?: boolean;
  /** Short silent hover loop on the case's card. */
  previewUrl?: string;
  gallery2: string[];
  awards: CaseStudyAward[];
  nextCaseStudySlug: string;
  /** Cases index card: client line, campaign line and thumbnail photo. */
  teaserClient: string;
  teaserCampaign: string;
  thumbnail: string;
  /** The thumbnail's focus point (CSS object-position) where the centre crop cuts a face. */
  thumbnailPosition?: string;
}

export interface Location {
  name: string;
  slug: string;
  contentHtml: string;
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
  url: string;
  visualizationJson: string;
}

/** The case pinned on /case-studies and the featured cases on Home, in order. */
export interface CasesSettings {
  pinned: string;
  featured: string[];
}

interface CmsContent {
  caseStudies: CaseStudy[];
  locations: Location[];
  colors: Color[];
  awards: Award[];
  homeSound: HomeSound | null;
  casesSettings: CasesSettings;
}

/*
  The content comes from Sanity: scripts/sanity-sync.mjs writes it into
  cms-content.json before each build. The JSON in the repo is the last synced
  copy, so the site also builds without Sanity.
*/
const content = cms as unknown as CmsContent;

export function getCaseStudies(): CaseStudy[] {
  return content.caseStudies;
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return content.caseStudies.find((c) => c.slug === slug);
}

export function getHomepageCaseStudies(): CaseStudy[] {
  return content.caseStudies.filter((c) => c.showOnHomepage);
}

export function getLocations(): Location[] {
  return content.locations;
}

export function getColors(): Color[] {
  return content.colors;
}

export function getAwards(): Award[] {
  return content.awards;
}

export function getHomeSound(): HomeSound | null {
  return content.homeSound;
}

export function getCasesSettings(): CasesSettings {
  return content.casesSettings;
}
