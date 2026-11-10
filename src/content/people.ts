import { getTeam } from "@/lib/team";
/*
  Team pages (/team/<slug>): one page per contact person, written for search,
  with the role, what it covers, selected work and an FAQ.

  Everything here is drawn from what the site already says (roles, the Work
  board copy, the Strategy services). There are no personal biography facts
  yet: `bio` is empty until Michael and Karl send theirs, and nothing is shown
  for it until then. Don't invent career history, clients or awards here.
*/

export type Person = {
  slug: string;
  name: string;
  firstName: string;
  role: string;
  /** Photo file in /public/images (with -p-500/-800/-1080 sizes). */
  file: string;
  email: string;
  phone?: string;
  /** Page <title> and description: name, role, agency, city. */
  seoTitle: string;
  seoDescription: string;
  /** Search terms the copy covers, for the keywords meta tag. */
  keywords: string[];
  hero: { line: string; background: string; lineColor: string; dark?: boolean };
  /** Short paragraphs under the portrait. */
  intro: string[];
  /** Personal bio from the person themselves; empty until they send it. */
  bio: string[];
  expertise: {
    heading: string;
    line: string;
    intro: string;
    image: string;
    alt: string;
    items: { name: string; text: string }[];
  };
  /** Work spots by client name (src/content/work.ts) and/or case slugs. */
  work: { heading: string; spots?: string[]; cases?: string[] };
  faq: { name: string; text: string }[];
};

/** The team page banners' colours (pages from team.json, Sanity). */
const HERO: Record<string, { background: string; lineColor: string; dark?: boolean }> = {
  michael: { background: "#7a3bff", lineColor: "#02b7fd" },
  karl: { background: "#e7f639", lineColor: "#977e72", dark: true },
};

export const PEOPLE: Person[] = getTeam().flatMap((m) => {
  const page = m.page;
  if (!page) return [];
  const hero = HERO[m.key] ?? { background: "#7a3bff", lineColor: "#02b7fd" };
  return [
    {
      slug: page.slug,
      name: m.name,
      firstName: m.firstName,
      role: m.role,
      file: m.file,
      email: m.email,
      ...(m.phone ? { phone: m.phone } : {}),
      seoTitle: page.seo.title,
      seoDescription: page.seo.description,
      keywords: page.seo.keywords,
      hero: { line: page.heroLine, ...hero },
      intro: page.intro,
      bio: page.bio,
      expertise: page.expertise,
      work: page.work,
      faq: page.faq,
    },
  ];
});

export function getPerson(slug: string): Person | undefined {
  return PEOPLE.find((p) => p.slug === slug);
}
