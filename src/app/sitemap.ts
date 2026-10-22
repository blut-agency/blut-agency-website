import type { MetadataRoute } from "next";
import { getCaseStudies } from "@/lib/content";
import { PEOPLE } from "@/content/people";

const SITE = "https://www.blut.agency";

/** /sitemap.xml: every page, so search engines find the team and case pages too. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/strategy", "/case-studies", "/about"].map((path) => ({
    url: `${SITE}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const team = PEOPLE.map((p) => ({ url: `${SITE}/team/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.6 }));
  const cases = getCaseStudies().map((cs) => ({ url: `${SITE}/project/${cs.slug}`, changeFrequency: "yearly" as const, priority: 0.7 }));
  const legal = ["/imprint", "/privacy-policy"].map((path) => ({ url: `${SITE}${path}`, priority: 0.1 }));
  return [...pages, ...team, ...cases, ...legal];
}
