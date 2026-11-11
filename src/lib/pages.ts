import type { Metadata } from "next";
import pages from "@/content/pages.json";
import { share } from "@/lib/share";
import type { WorkSpotData } from "@/components/WorkSpot";

/*
  The words, pictures and links of each page. They come from Sanity: the
  build's sync (scripts/sanity-sync.mjs) writes them into pages.json. The
  JSON in the repo is the last synced copy, so the site also builds without
  Sanity. Layout, colours and motion stay in the page code.
*/

export interface Seo {
  /** Browser tab title; the site default when empty. */
  title: string;
  /** Link preview title. */
  shareTitle: string;
  description: string;
  /** Link preview text; the description when empty. */
  shareDescription?: string;
}

export interface Cta {
  label: string;
  href: string;
}

export type OfferName = "Production" | "Strategy" | "Post";

export interface HomePage {
  stageLine: string;
  stageLinePlaceholder?: boolean;
  soundLabel: string;
  /** The sound label on touch screens and phones ("Tap for sound"). */
  soundLabelTouch?: string;
  pauseLabel: string;
  offersHeading: string;
  offersText: string;
  offersTextPlaceholder?: boolean;
  offers: {
    page: OfferName;
    text: string;
    placeholder?: boolean;
    linkLabel: string;
    image: string;
    alt: string;
    preview?: string;
  }[];
  casesHeading: string;
  casesLink: Cta;
  whyHeading: string;
  whyText: string;
  whyLink: Cta;
  seo: Seo;
}

export interface Hero {
  /** Line breaks split the heading into lines. */
  heading: string;
  line: string;
  placeholder?: boolean;
}

export interface CallResponse {
  question: string;
  answer: string;
  placeholder?: boolean;
}

export interface LeadBox {
  heading: string;
  text: string;
  link: Cta;
}

export type Spot = WorkSpotData & { layout: "wide" | "row" | "row-flipped" };

export interface Service {
  heading: string;
  line: string;
  intro: string;
  image: string;
  alt: string;
  items: { name: string; text: string }[];
  link?: Cta;
}

export interface FilmsPage {
  hero: Hero;
  intro: CallResponse;
  spots: Spot[];
  lead: LeadBox;
  seo: Seo;
}

export interface StrategyPage {
  hero: Hero;
  intro: string;
  film: Spot;
  services: Service[];
  lead: LeadBox;
  seo: Seo;
}

export interface CasesPage {
  hero: Hero;
  lead: LeadBox;
  seo: Seo;
}

export interface AboutPage {
  hero: Hero;
  teamIntro: string;
  seo: Seo;
}

export interface LegalPage {
  /** The page's text as HTML. */
  body: string;
  seo: Seo;
}


interface Pages {
  homePage: HomePage;
  productionPage: FilmsPage;
  postPage: FilmsPage;
  strategyPage: StrategyPage;
  casesPage: CasesPage;
  aboutPage: AboutPage;
  imprintPage: LegalPage;
  privacyPage: LegalPage;
}

const content = pages as unknown as Pages;

export function getPage<K extends keyof Pages>(id: K): Pages[K] {
  return content[id];
}

/** A banner heading with line breaks → one string per line (one string stays one string). */
export function heroHeading(hero: Hero): string | string[] {
  const lines = hero.heading.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.length > 1 ? lines : hero.heading;
}

/** A page's tab title, Google snippet and link preview from its Search fields. */
export function pageMetadata(seo: Seo, path: string, image?: Parameters<typeof share>[0]["image"]): Metadata {
  return {
    ...(seo.title ? { title: seo.title } : {}),
    description: seo.description,
    ...share({ title: seo.shareTitle || seo.title, description: seo.shareDescription || seo.description, path, image }),
  };
}
