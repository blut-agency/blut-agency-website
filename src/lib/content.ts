import cms from "@/content/cms-content.json";

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
  title: string;
  subline: string;
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
  gallery2: string[];
  awards: CaseStudyAward[];
  nextCaseStudySlug: string;
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

interface CmsContent {
  caseStudies: CaseStudy[];
  locations: Location[];
  colors: Color[];
  awards: Award[];
  homeSound: HomeSound | null;
}

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
