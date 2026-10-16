import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import GridFooter from "@/components/GridFooter";
import LogoBand from "@/components/LogoBand";
import GradientBanner from "@/components/GradientBanner";
import RevealText from "@/components/RevealText";
import { getCaseStudies } from "@/lib/content";
import CaseList, { type CaseRow } from "./CaseList";
import { disciplinesFrom, readableOn } from "./disciplines";
import "./cases.css";

export const metadata: Metadata = {
  title: "Case Studies | blut",
  description:
    "Take a more in-depth look at how strategy and music production come together with a selection of some of our most exciting work.",
};

/*
  Only cases with a written page are listed. Rockstar, Postbank and Germont
  stay in cms-content.json (and at /project/<slug>) until their copy exists.
*/
const HIDDEN_CASES = new Set(["feel-the-vibe", "all-purpose-sound", "reinventing-a-classic"]);

/** Spacer row as drawn in Figma (Spacer v02): side lines plus a centre line. */
function Spacer() {
  return (
    <div className="gl-spacer is-dark cs-spacer" aria-hidden="true">
      <div className="gl-col" />
    </div>
  );
}

/*
  Cases page in the grid-landing layout (Figma "Cases", 137:501): banner, nav,
  lime band, spacer, discipline filter, one dark row per case (gradient panel
  third + photo two thirds), spacer, orange band, "Sounds good?", footer.
  Styles: ./cases.css, everything scoped to .cs-page.
*/
export default function CaseStudiesPage() {
  const cases: CaseRow[] = getCaseStudies()
    .filter((cs) => !HIDDEN_CASES.has(cs.slug))
    .sort((a, b) => a.position - b.position)
    .map((cs) => ({
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
    }));

  return (
    <div className="main-wrapper gl-page cs-page">
      <div className="cs-banner gl-banner">
        <GradientBanner form="cases-hero" background="#dfe5ac" line="var(--_color---accent-color-1)">
          <RevealText as="h1" className="heading-style-h1" text="Case Studies" />
          <p className="copy-medium">
            Take a more in-depth look at how strategy and music production come together with a selection of some of
            our most exciting work.
          </p>
        </GradientBanner>
      </div>
      <Header variant="start-top" />
      <LogoBand theme="lime" />
      <Spacer />

      <CaseList cases={cases} />

      <Spacer />
      <LogoBand theme="orange" reverse />

      <section className="gl-row is-dark cs-cta">
        <div className="gl-col cs-cta-inner">
          <RevealText as="h2" className="heading-style-h1" text="Sounds good?" />
          <div className="cta-link-component gl-cta">
            <Link aria-label="Get in touch" href="mailto:contact@blut.agency" className="cta-link w-inline-block">
              <div className="cta-link-line" />
              <div className="cta-link-text">Get in touch</div>
            </Link>
          </div>
        </div>
      </section>

      <GridFooter />
    </div>
  );
}
