import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCaseStudies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Case Studies | blut",
};

export default function CaseStudiesPage() {
  const caseStudies = getCaseStudies();

  return (
    <>
      <Header variant="start-top" />
      <div className="main-wrapper">
        <div className="nav-distance" />
        <section className="section-case-studies-intro">
          <div className="page-padding">
            <div className="container-large align-left">
              <div className="container-medium align-left">
                <div
                  data-wf--spacer--variant="xxl"
                  className="spacer-component w-variant-f176b2ee-826a-f858-3f7a-82a98e21da6b"
                />
                <div className="text-component">
                  <h1 className="heading-style-h1">See us in action.</h1>
                  <div className="spacer-slot">
                    <div
                      data-wf--spacer--variant="xl"
                      className="spacer-component w-variant-2cf01a4e-9649-6aa7-d409-1feb17978d26"
                    />
                  </div>
                  <div className="rich-text-custom w-richtext">
                    <p>Words can only say so much. Check out our work and see what we can do.</p>
                  </div>
                </div>
                <div
                  data-wf--spacer--variant="xxl"
                  className="spacer-component w-variant-f176b2ee-826a-f858-3f7a-82a98e21da6b"
                />
              </div>
            </div>
          </div>
        </section>
        <div className="w-dyn-list">
          <div role="list" className="w-dyn-items">
            {caseStudies.map((cs) => (
              <div role="listitem" className="w-dyn-item" key={cs.slug}>
                <section className="section-case-studies-teaser">
                  <div
                    className="case-study-teaser-visual"
                    style={cs.color ? { backgroundImage: `linear-gradient(135deg, ${cs.color.main}, ${cs.color.secondary})` } : undefined}
                  />
                  <div className="teaser-standard-background is-dark" />
                  <div className="page-teaser-wide-component">
                    <div className="page-padding">
                      <div className="project-teaser-divider" />
                      <div
                        data-wf--box-inner-text--variant="is-her-case-study-teaser"
                        className="item-inner w-variant-d7424809-4d85-67af-9c2b-41f37302e9c1"
                      >
                        <div className="item-top w-variant-d7424809-4d85-67af-9c2b-41f37302e9c1">
                          <div className="copy-small">
                            <div className="meta-list-component">
                              <div
                                className="meta-list w-richtext"
                                dangerouslySetInnerHTML={{ __html: cs.clientListHtml }}
                              />
                            </div>
                          </div>
                          <div
                            data-wf--spacer--variant="md"
                            className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                          />
                          <h2 className="heading-style-h1">{cs.title}</h2>
                        </div>
                        <div className="item-bottom w-variant-d7424809-4d85-67af-9c2b-41f37302e9c1">
                          <div data-wf--cta-link--variant="bright-text" className="cta-link-component">
                            <Link
                              aria-hidden="true"
                              aria-label="Read more"
                              href={`/case-studies/${cs.slug}`}
                              className="cta-link-full-cover w-inline-block"
                            />
                            <Link
                              aria-label="Read more"
                              href={`/case-studies/${cs.slug}`}
                              className="cta-link w-inline-block"
                            >
                              <div className="cta-link-line" />
                              <div className="cta-link-text">Read more</div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ))}
          </div>
          {caseStudies.length === 0 && (
            <div className="w-dyn-empty">
              <div>No items found.</div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
