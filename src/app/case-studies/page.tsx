import type { Metadata } from "next";
import { share } from "@/lib/share";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import CaseCard, { caseTags } from "@/components/CaseCard";
import CaseFilter from "@/components/CaseFilter";
import { OFFERS, PINNED_CASE, caseOffers, tagSlug } from "@/content/offers";
import { ContactBlock, CtaLink, Lead, PageHero } from "@/components/Blocks";
import { getCaseStudies } from "@/lib/content";
import { highlightThemes } from "@/lib/imageTheme";

export const metadata: Metadata = {
  title: "Case Studies | blut",
  description:
    "Take a more in-depth look at how strategy and music production come together with a selection of some of our most exciting work.",
  ...share({
    title: "Case Studies",
    description: "Take a more in-depth look at how strategy and music production come together with a selection of some of our most exciting work.",
    path: "/case-studies",
    image: { url: "/images/open-graph-image-1.png", width: 1800, height: 945, alt: "DJ Seinfeld and sogumm recording in the Hyundai Inster" },
  }),
};

/*
  Case index in the new design (Work v02 building blocks): banner, every case
  as a full-width card in one stacked list (photo two thirds, text one third), a pointer to the strategy page and
  Michael as the contact. Each card keeps its case's own CMS colour, so the
  hover highlight matches the case page it links to.

  Filter buttons sit above the list: the offers (Production, Strategy, Post;
  one shows once a case carries it), then one per service tag on the cards,
  the most used first. The pinned case leads the list under a "Featured" label.
*/
export default async function CaseStudiesPage() {
  const all = getCaseStudies();
  // The pinned case first, the rest in their CMS order.
  const caseStudies = [...all.filter((cs) => cs.slug === PINNED_CASE), ...all.filter((cs) => cs.slug !== PINNED_CASE)];
  const offers = caseStudies.map(caseOffers);
  const tags = caseStudies.map(caseTags);
  const count = (tag: string) => tags.filter((list) => list.includes(tag)).length;
  const options = [
    ...OFFERS.filter((o) => offers.some((list) => list.includes(o))).map((o) => ({ slug: tagSlug(o), label: o })),
    ...[...new Set(tags.flat())]
      .sort((a, b) => count(b) - count(a) || a.localeCompare(b))
      .map((tag) => ({ slug: tagSlug(tag), label: tag })),
  ];
  const themes = await highlightThemes(caseStudies.map((cs) => ({ image: cs.thumbnail, color: cs.color })));

  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="cases-hero"
        heading="Case Studies"
        line="Take a more in-depth look at how strategy and music production come together with a selection of some of our most exciting work."
        background="var(--_color---accent-color-1)"
        lineColor="var(--_color---accent-color-3)"
      />
      <Header variant="start-top" />

      <section className="bk-section is-dark bk-cases-section">
        <CaseFilter options={options}>
          <ul role="list" className="lp-wrap bk-case-list">
            {caseStudies.map((cs, i) => (
              <li key={cs.slug} data-tags={[...offers[i], ...tags[i]].map(tagSlug).join(" ")} className={cs.slug === PINNED_CASE ? "is-pinned" : undefined}>
                {cs.slug === PINNED_CASE && <p className="bk-pinned-label">Featured</p>}
                <CaseCard cs={cs} theme={themes[i]} formPrefix="cases" />
              </li>
            ))}
          </ul>
        </CaseFilter>
      </section>

      <section className="bk-section">
        <Lead boxed heading="It’s not just music, it’s everything around it." text="Our music production and data-driven sonic strategies work hand-in-hand to create memorable campaigns that genuinely connect with audiences.">
          <CtaLink href="/strategy" label="Get to know our process" />
        </Lead>
      </section>

      <ContactBlock person="michael" />
      <LandingFooter band={{ background: "var(--_color---accent-color-1)", line: "var(--_color---accent-color-3)" }} />
    </div>
  );
}
