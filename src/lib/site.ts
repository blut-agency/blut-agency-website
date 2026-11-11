import site from "@/content/site.json";
import type { Cta } from "@/lib/pages";

/*
  Texts every page shares: the menu, the contact block, the footer, the
  welcome card, the small repeated words and the 404 page.
  From Sanity ("Site settings") via site.json. Kept apart from pages.json so
  the menu, a client component, doesn't ship every page's text.
*/

export interface SiteSettings {
  menu: Cta[];
  /** The contact block's heading; a line break splits it. */
  contactHeading: string;
  contactEmail: string;
  mailLabel: string;
  /** Footer, first column: one entry per line group; line breaks stay. */
  footerContact: string[];
  footerLegal: Cta[];
  footerSocial: Cta[];
  /** The first-visit card (WelcomeRecap). */
  welcome: { title: string; text: string; button: string; video: string; teaser: string; poster: string; videoTitle: string };
  /** Words the site repeats in many places. */
  labels: {
    readMore: string;
    playVideo: string;
    seeCase: string;
    filterAll: string;
    caseClient: string;
    caseWhatWeDid: string;
    caseCollaborators: string;
    caseChapterLink: Cta;
    nextCase: string;
  };
  /** The 404 page. */
  notFound: { heading: string; text: string; button: string };
}

export function getSite(): SiteSettings {
  return site as SiteSettings;
}
