import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CaseStudyVisual, { visualVariant } from "@/components/CaseStudyVisual";
import PageTeaser from "@/components/PageTeaser";
import GradientBanner from "@/components/GradientBanner";
import { getCaseStudies } from "@/lib/content";
import RevealText from "@/components/RevealText";

// Morph durations the live case study index uses, keyed by visual variant.
const TEASER_SPEED: Record<number, number> = { 1: 8, 2: 10, 3: 10 };

export const metadata: Metadata = {
  title: "Case Studies | blut",
  description:
    "Take a more in-depth look at how strategy and music production come together with a selection of some of our most exciting work.",
};

export default function CaseStudiesPage() {
  const caseStudies = getCaseStudies();

  return (
    <>
      <Header variant="start-top" />
      <div className="main-wrapper">
        <div className="nav-distance" />
        <GradientBanner form="cases-hero" background="var(--_color---accent-color-1)" line="var(--_color---accent-color-3)">
          <div className="container-small">
            <RevealText as="h1" className="heading-style-h1" text="Case Studies" />
          </div>
          <div data-wf--spacer--variant="sm" className="spacer-component w-variant-1ed5893b-149c-09fd-1a9e-43daba4600bc"></div>
          <div className="container-small">
            <p className="copy-medium">
              Take a more in-depth look at how strategy and music production come together with a selection of some
              of our most exciting work.
            </p>
          </div>
        </GradientBanner>
        {/*
          Every case as one card (board: "All cases should be arranged like
          this"): client and campaign name with "Read more" on the left, the
          thumbnail on the right. Hovering shows the case's gradient behind the
          text and zooms the photo.
        */}
        <div role="list">
          {caseStudies.map((cs) => (
            <section role="listitem" className="section-case-studies-teaser case-card cta-panel" key={cs.slug}>
              <div className="case-card-text">
                <div
                  className="case-study-teaser-visual"
                  style={cs.color ? { backgroundColor: cs.color.secondary, color: cs.color.main } : undefined}
                >
                  <CaseStudyVisual
                    slug={cs.slug}
                    variant={visualVariant(cs.useVisual)}
                    speed={TEASER_SPEED[visualVariant(cs.useVisual)]}
                    visualizationJson={cs.visualizationJson}
                  />
                </div>
                <div className="teaser-standard-background is-dark" />
                <div className="case-card-inner">
                  <h2 className="heading-style-h2">
                    {cs.teaserClient}
                    <br />
                    {cs.teaserCampaign}
                  </h2>
                  <div data-wf--cta-link--variant="bright-text" className="cta-link-component">
                    <Link aria-label={`Read more: ${cs.teaserClient}`} href={`/project/${cs.slug}`} className="cta-link w-inline-block">
                      <div className="cta-link-line" />
                      <div className="cta-link-text">Read more</div>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="case-card-media">
                <img src={cs.thumbnail} alt="" loading="lazy" className="fit-cover-absolute" />
              </div>
              {/* The whole card links to the case; the visible CTA sits in the text half. */}
              <Link
                aria-hidden="true"
                tabIndex={-1}
                href={`/project/${cs.slug}`}
                className="cta-link-full-cover w-inline-block"
              />
            </section>
          ))}
        </div>
        <PageTeaser heading="Sounds good?" href="mailto:contact@blut.agency" ctaLabel="Get in touch" ariaLabel="Get in touch" />
        <Footer />
      </div>
    </>
  );
}
