import type { CaseStudy } from "@/lib/content";
import { caseTags } from "@/components/CaseCard";
import { workItem, type WorkItem } from "@/content/work";

/*
  blut's three offers (call with Michael and Timo, 30 Oct 2026): the menu,
  the Home tiles and the Cases filter all use them.

  A case's offers come from its own "What we did" list (cms-content.json),
  so nothing new is invented here. CASE_OFFERS adds offers a case's list
  doesn't name, e.g. Post once a case has post work to show.
*/

export const OFFERS = ["Production", "Strategy", "Post"] as const;
export type Offer = (typeof OFFERS)[number];

export const offerSlug = (o: Offer) => o.toLowerCase();

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

/** The case pinned to the top of /case-studies. */
export const PINNED_CASE = "hyundai-are-you-in";

/** Cases under "Featured cases" on Home, in order (Hyundai further down, as agreed). */
export const FEATURED_CASES = ["volkswagen-bringing-it-all-back-home", "devils-advocate-brand-launch", "hyundai-are-you-in"];

/*
  The Post page: sound design and mixing from the Work spots until there is
  enough video post to show. Their copy stays as it is on Production.
*/
export const POST_ITEMS: WorkItem[] = [
  { ...workItem("Crazy Wolf"), layout: "wide" },
  { ...workItem("Gore-Tex"), layout: "row" },
  { ...workItem("McDonald’s"), layout: "row-flipped" },
  { ...workItem("Adidas"), layout: "row" },
];
