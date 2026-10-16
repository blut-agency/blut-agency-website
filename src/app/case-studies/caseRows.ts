import type { CaseStudy } from "@/lib/content";
import { disciplinesFrom, readableOn, type Discipline } from "./disciplines";

/** One case row as the Cases page (and Home's "Selected cases") renders it. */
export type CaseRow = {
  slug: string;
  client: string;
  campaign: string;
  /** Optional result line under the title (Home's "Selected cases" only). */
  result?: string;
  thumbnail: string;
  panel: string;
  line: string;
  text: "#000" | "#fff";
  useVisual: boolean[];
  visualizationJson: string;
  disciplines: Discipline[];
};

/** CMS case study -> row data: teaser client/campaign, thumbnail, theme colours, "What we did" tags. */
export function toCaseRow(cs: CaseStudy): CaseRow {
  return {
    slug: cs.slug,
    client: cs.teaserClient,
    campaign: cs.teaserCampaign,
    thumbnail: cs.thumbnail,
    panel: cs.color?.secondary ?? "#000",
    line: cs.color?.main ?? "#fff",
    text: readableOn(cs.color?.secondary ?? "#000"),
    useVisual: cs.useVisual,
    visualizationJson: cs.visualizationJson,
    disciplines: disciplinesFrom(cs.whatWeDidHtml),
  };
}
