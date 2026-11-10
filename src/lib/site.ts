import site from "@/content/site.json";
import type { Cta } from "@/lib/pages";

/*
  Texts every page shares: the menu, the contact block and the footer.
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
}

export function getSite(): SiteSettings {
  return site as SiteSettings;
}
