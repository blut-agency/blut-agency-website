import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealText from "@/components/RevealText";

export const metadata: Metadata = {
  title: "Our Services – Sonic Branding, Music Strategy & Measurement | blut",
  description:
    "Explore blut’s full-service offering – from sonic brand strategy and music-driven content production to performance measurement. We craft sound identities and prove their impact.",
};

const PILLARS = [
  {
    label: "Sonic Strategy",
    heading: "Your brand needs a Sonic Identity – but which one?",
    text: "We analyze your brand, its cultural context, the sounds of the market, and the habits of your target audience to define your perfect sonic identity.",
    anchor: "sonic-strategy",
  },
  {
    label: "Content Production",
    heading: "How do we bring your sonic identity to life?",
    text: "From strategy to real life. Informed by our analytical insights, we craft all kinds of assets shaped by music culture - from sound and film to events, merch, digital content, and immersive experiences.",
    anchor: "content-production",
  },
  {
    label: "Performance & Measurement",
    heading: "Not just music - measurable impact.",
    text: "We provide reporting, market research and data analytics to empirically prove the efficacy of our sonic strategies.",
    anchor: "performance",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header variant="start-top" />
      <div className="main-wrapper">
        <div className="nav-distance"></div>
        <section className="section-services-intro">
          <div className="page-padding">
            <div className="container-large">
              <div className="container-medium align-left">
                <div
                  data-wf--spacer--variant="xxl"
                  className="spacer-component w-variant-f176b2ee-826a-f858-3f7a-82a98e21da6b"
                ></div>
                <div className="text-component">
                  <RevealText as="h1" className="heading-style-h1" text="So, what do we do?" />
                  <div className="spacer-slot">
                    <div
                      data-wf--spacer--variant="xl"
                      className="spacer-component w-variant-2cf01a4e-9649-6aa7-d409-1feb17978d26"
                    ></div>
                  </div>
                  <div className="rich-text-custom w-richtext">
                    <p>
                      Analysing, crafting and optimizing music strategies is what we do best - it’s just how we
                      understand our business. Each service is a piece of the puzzle - see the full toolkit on the{" "}
                      <Link href="/spt">Sonic Performance Tracker</Link> page.
                    </p>
                  </div>
                </div>
                <div
                  data-wf--spacer--variant="xxl"
                  className="spacer-component w-variant-f176b2ee-826a-f858-3f7a-82a98e21da6b"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-services">
          <div className="page-padding">
            <div className="container-large">
              <div className="spacer-l-start spacer-l-end">
                {PILLARS.map((pillar) => (
                  <div key={pillar.anchor} className="spacer-l-start spacer-l-end z-index-1">
                    <h2 className="copy-medium">{pillar.label}</h2>
                    <div
                      data-wf--spacer--variant="sm"
                      className="spacer-component w-variant-1ed5893b-149c-09fd-1a9e-43daba4600bc"
                    ></div>
                    <h3 className="heading-style-h2">{pillar.heading}</h3>
                    <div
                      data-wf--spacer--variant="sm"
                      className="spacer-component w-variant-1ed5893b-149c-09fd-1a9e-43daba4600bc"
                    ></div>
                    <div className="rich-text-custom w-richtext">
                      <p>{pillar.text}</p>
                    </div>
                    <div
                      data-wf--spacer--variant="md"
                      className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                    ></div>
                    <div
                      data-wf--cta-link--variant="dark-text"
                      className="cta-link-component w-variant-dee7867e-1b44-c2d3-0b3d-782590fc4f34"
                    >
                      <Link
                        aria-hidden="true"
                        aria-label="See it on the Sonic Performance Tracker"
                        href={`/spt#${pillar.anchor}`}
                        className="cta-link-full-cover w-inline-block"
                      />
                      <Link
                        aria-label="See it on the Sonic Performance Tracker"
                        href={`/spt#${pillar.anchor}`}
                        className="cta-link w-inline-block"
                      >
                        <div className="cta-link-line w-variant-dee7867e-1b44-c2d3-0b3d-782590fc4f34" />
                        <div className="cta-link-text">Learn more</div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-services-cases-teaser">
          <div className="page-teaser-wide-component">
            <div className="page-teaser-wide-background-color is-accent-2"></div>
            <div className="container-large">
              <div
                data-wf--box-inner-text--variant="is-next-case-study-teaser"
                className="item-inner w-variant-d9f4f337-c70e-b4e9-7a9a-312292f48761"
              >
                <div className="item-top w-variant-d9f4f337-c70e-b4e9-7a9a-312292f48761">
                  <div className="copy-small">
                    <div className="meta-list-component">
                      <div className="meta-list w-richtext">
                        <p>Want the full toolkit, in one place?</p>
                      </div>
                    </div>
                  </div>
                  <div
                    data-wf--spacer--variant="md"
                    className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                  ></div>
                  <RevealText className="heading-style-h1" text="The Sonic Performance Tracker" />
                </div>
                <div className="item-bottom">
                  <div
                    data-wf--cta-link--variant="dark-text"
                    className="cta-link-component w-variant-dee7867e-1b44-c2d3-0b3d-782590fc4f34"
                  >
                    <Link
                      aria-hidden="true"
                      aria-label="Go to the Sonic Performance Tracker"
                      href="/spt"
                      className="cta-link-full-cover w-inline-block"
                    />
                    <Link
                      aria-label="Go to the Sonic Performance Tracker"
                      href="/spt"
                      className="cta-link w-inline-block"
                    >
                      <div className="cta-link-line w-variant-dee7867e-1b44-c2d3-0b3d-782590fc4f34"></div>
                      <div className="cta-link-text">See the SPT</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
