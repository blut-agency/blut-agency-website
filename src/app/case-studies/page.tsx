import type { Metadata } from "next";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import CaseCard from "@/components/CaseCard";
import { ContactBlock, CtaLink, Lead, PageHero } from "@/components/Blocks";
import { getCaseStudies } from "@/lib/content";
import { highlightThemes } from "@/lib/imageTheme";

export const metadata: Metadata = {
  title: "Case Studies | blut",
  description:
    "Take a more in-depth look at how strategy and music production come together with a selection of some of our most exciting work.",
};

/*
  Case index in the new design (Work v02 building blocks): banner, every case
  as a full-width card in one stacked list (photo two thirds, text one third), a pointer to the strategy page and
  Michael as the contact. Each card keeps its case's own CMS colour, so the
  hover highlight matches the case page it links to.
*/
export default async function CaseStudiesPage() {
  const caseStudies = getCaseStudies();
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

      <section className="bk-section is-dark">
        <ul role="list" className="lp-wrap bk-case-list">
          {caseStudies.map((cs, i) => (
            <li key={cs.slug}>
              <CaseCard cs={cs} theme={themes[i]} formPrefix="cases" />
            </li>
          ))}
        </ul>
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
