import { getCasesSettings, type CaseStudy } from "@/lib/content";
import { caseTags } from "@/components/CaseCard";

/*
  blut's three offers (call with Michael and Timo, 30 Oct 2026): the menu,
  the Home tiles and the Cases filter all use them.

  A case's offers come from its own "What we did" list (cms-content.json),
  so nothing new is invented here. CASE_OFFERS adds offers a case's list
  doesn't name, e.g. Post once a case has post work to show.
*/

export const OFFERS = ["Production", "Strategy", "Post"] as const;
export type Offer = (typeof OFFERS)[number];

/** URL and attribute form of an offer or service tag ("Sonic Strategy" → "sonic-strategy"). */
export const tagSlug = (tag: string) => tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const FROM_SERVICE: Record<string, Offer> = {
  "Sonic Strategy": "Strategy",
  "Sonic Branding": "Strategy",
  "Content Production": "Production",
  "Artist Partnership": "Production",
};

const CASE_OFFERS: Record<string, Offer[]> = {};

export function caseOffers(cs: CaseStudy): Offer[] {
  const found = new Set<Offer>(CASE_OFFERS[cs.slug] ?? []);
  for (const tag of caseTags(cs)) {
    const offer = FROM_SERVICE[tag];
    if (offer) found.add(offer);
  }
  return OFFERS.filter((o) => found.has(o));
}

/** The case pinned to the top of /case-studies (Sanity: Cases settings). */
export const PINNED_CASE = getCasesSettings().pinned;

/** Cases under "Featured cases" on Home, in order (Sanity: Cases settings). */
export const FEATURED_CASES = getCasesSettings().featured;
