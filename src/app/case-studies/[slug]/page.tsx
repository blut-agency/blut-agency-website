import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCaseStudies, getCaseStudyBySlug } from "@/lib/content";

const SPINNER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" class="spinner spinner">
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.2"></circle>
  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none"></path>
</svg>`;

const BUTTON_FORM = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 220 105" fill="none" data-visual-form-rotate="80%" data-visual-form-move-x="-20%" data-visual-form-move-y="-10%" class="button-form">
  <path d="M46.1254 75.4987C20.0059 66.0511 2.35522 57.9396 4.83797 36.508C7.32072 15.0763 44.8821 21.0566 63.0105 12.297C92.3359 -1.8728 147.508 8.51107 168.616 13.1284C189.725 17.7456 212.528 20.1457 214.747 75.4854C216.3 114.217 172.282 98.801 155.891 88.2146C139.501 77.6281 127.73 75.1786 108.334 72.9316C79.03 69.5369 77.0438 86.6822 46.1254 75.4987Z" stroke="currentColor" class="button-form-path"></path>
</svg>`;

const BUTTON_FORM_HIGHLIGHT = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 220 105" fill="none" data-visual-form-rotate="80%" data-visual-form-move-x="-20%" data-visual-form-move-y="-10%" class="button-form is-thin-line">
  <path d="M46.1254 75.4987C20.0059 66.0511 2.35522 57.9396 4.83797 36.508C7.32072 15.0763 44.8821 21.0566 63.0105 12.297C92.3359 -1.8728 147.508 8.51107 168.616 13.1284C189.725 17.7456 212.528 20.1457 214.747 75.4854C216.3 114.217 172.282 98.801 155.891 88.2146C139.501 77.6281 127.73 75.1786 108.334 72.9316C79.03 69.5369 77.0438 86.6822 46.1254 75.4987Z" stroke="currentColor" class="button-form-path is-highlight"></path>
</svg>`;

function vimeoSrc(id: string, extra = "api=1&controls=0&loop=1&background=0&dnt=1") {
  return `https://player.vimeo.com/video/${id}?${extra}`;
}

function PlayerSpinnerButtons({ size }: { size: "copy-medium" | "heading-style-h2" }) {
  return (
    <div className="player-toggle-button">
      <div className={`player-loading-spinner ${size}`}>
        <div
          className="player-loading-spinner-inner"
          style={{ display: "contents" }}
          dangerouslySetInnerHTML={{ __html: SPINNER_SVG }}
        />
      </div>
      <button data-player="play-button" className="play-toggle">
        <div className={`play-toggle-text ${size}`}>Play</div>
      </button>
      <button data-player="pause-button" className="play-toggle is-pause-button">
        <div className={`play-toggle-text ${size}`}>Pause</div>
      </button>
    </div>
  );
}

export function generateStaticParams() {
  return getCaseStudies().map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return {};
  return {
    title: `${cs.title} | blut | Case Study`,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const nextCase = getCaseStudyBySlug(cs.nextCaseStudySlug);

  return (
    <>
      <Header variant="start-top" />
      <div className="main-wrapper">
        <section className="project-stage-wrapper">
          <div className="project-stage-content-wrapper">
            <div className="meta-list-component">
              <div className="meta-list w-richtext" dangerouslySetInnerHTML={{ __html: cs.clientListHtml }} />
            </div>
            <div
              data-wf--spacer--variant="sm"
              className="spacer-component w-variant-1ed5893b-149c-09fd-1a9e-43daba4600bc"
            />
            <h1 className="heading-style-h1">{cs.title}</h1>
          </div>
          <div
            className="project-stage-visual-wrapper"
            style={cs.color ? { backgroundImage: `linear-gradient(135deg, ${cs.color.main}, ${cs.color.secondary})` } : undefined}
          />
        </section>

        <section className="section-project-meta">
          <div className="page-padding">
            <div className="container-large align-left">
              <div className="spacer-l-start spacer-l-end">
                <div className="project-meta-list">
                  <div className="project-meta-list-item">
                    <div>What we did</div>
                    <div className="text-color-grey">
                      <div className="meta-list-component">
                        <div className="meta-list w-richtext" dangerouslySetInnerHTML={{ __html: cs.whatWeDidHtml }} />
                      </div>
                    </div>
                  </div>
                  {cs.collaboratorsHtml && (
                    <div className="project-meta-list-item">
                      <div>Collaborators</div>
                      <div className="text-color-grey">
                        <div className="meta-list-component">
                          <div
                            className="meta-list w-richtext"
                            dangerouslySetInnerHTML={{ __html: cs.collaboratorsHtml }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {cs.quote && (
          <section className="section-project-quote">
            <div className="_2-column-grid">
              <div className="grid-item is-media">
                {cs.quoteImage && <img src={cs.quoteImage} loading="lazy" alt="" className="fit-cover-absolute" />}
              </div>
              <div className="grid-item">
                <div
                  className="grid-item-background-color"
                  style={cs.color ? { backgroundImage: `linear-gradient(135deg, ${cs.color.main}, ${cs.color.secondary})` } : undefined}
                />
                <div className="item-inner is-case-study">
                  <div className="item-bottom is-quote">
                    <div className="container-tiny align-left">
                      <p className="heading-style-h2 text-color-black">{cs.quote}</p>
                      <div
                        data-wf--spacer--variant="md"
                        className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                      />
                      <div className="heading-style-h2 text-color-bright">{cs.quoteName}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {cs.introTextHtml && (
          <section className="section-project-intro">
            <div className="page-padding">
              <div className="container-medium">
                <div className="spacer-xxl-start spacer-xxl-end">
                  <div
                    className="rich-text-custom h2-is-h1-size w-richtext"
                    dangerouslySetInnerHTML={{ __html: cs.introTextHtml }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {cs.videoUnderQuoteVimeoId && (
          <section className="section-project-video-after-quote">
            <div className="video-16-9 w-embed w-iframe">
              <iframe
                id={`${cs.slug}-video-quote`}
                title=""
                src={vimeoSrc(cs.videoUnderQuoteVimeoId)}
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              />
            </div>
            <button
              data-player="play-button-big"
              data-player-target={`${cs.slug}-video-quote`}
              aria-label="play and pause button"
              className="play-toggle-big"
            >
              <div data-player="play-text" className="text-block">
                Play
              </div>
            </button>
            <div className="project-video-controls">
              <div data-player-file={`${cs.slug}-video-quote`} className="audioplayer-controls">
                <div data-player="progress-bar" className="progress-bar">
                  <div className="progress-bar-line" />
                  <div data-player="progress-fill" className="progress-bar-fill" />
                </div>
                <div className="progress-time">
                  <div data-player="current-time" className="current-time">
                    0:00
                  </div>
                  <div data-player="duration" className="duration">
                    0:00
                  </div>
                </div>
                <PlayerSpinnerButtons size="copy-medium" />
              </div>
            </div>
          </section>
        )}

        {cs.gallery1.length > 0 && (
          <section className="section-project-gallery">
            <div className="marquee-component">
              {[0, 1].map((row) => (
                <div className="w-dyn-list" key={row}>
                  <div data-marquee="horizontal" role="list" className="marquee-list w-dyn-items">
                    {cs.gallery1.map((src, i) => (
                      <div role="listitem" className="marquee-item w-dyn-item" key={i}>
                        <img loading="lazy" src={src} alt="" className="marquee-image" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {cs.textAfterGalleryHtml && (
          <section className="section-project-text">
            <div className="page-padding">
              <div className="container-medium">
                <div className="spacer-xxl-start spacer-xxl-end">
                  <div
                    className="rich-text-custom h2-is-h1-size w-richtext"
                    dangerouslySetInnerHTML={{ __html: cs.textAfterGalleryHtml }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {cs.gifVideoVimeoId && (
          <section className="section-project-gif-video">
            <div className="page-padding">
              <div className="container-small">
                <div className="spacer-xl-start spacer-xl-end">
                  <div className="video-16-9 w-embed w-iframe">
                    <iframe
                      id="gif-video"
                      title=""
                      src={vimeoSrc(cs.gifVideoVimeoId, "autoplay=1&loop=1&controls=0&dnt=1&muted=1")}
                      frameBorder="0"
                      allow="autoplay"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                  {cs.gifVideoHashtags && (
                    <div className="spacer-l-start">
                      <div className="heading-style-h2">{cs.gifVideoHashtags}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {cs.audioPlayer1.vimeoId && (
          <section className="section-project-audio-player-1">
            <div className="_2-column-grid">
              <div className="grid-item is-media">
                <div className="audio-preview-embed hide w-embed w-iframe">
                  <iframe
                    id={`${cs.slug}-audio-1`}
                    title=""
                    src={vimeoSrc(cs.audioPlayer1.vimeoId)}
                    frameBorder="0"
                    allow="autoplay"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <div className="audio-preview-visual-wrapper" />
              </div>
              <div className="grid-item is-player">
                <div
                  className="grid-item-background-color"
                  style={cs.color ? { backgroundImage: `linear-gradient(135deg, ${cs.color.main}, ${cs.color.secondary})` } : undefined}
                />
                <div className="text-color-grey">
                  <div className="item-inner is-case-study">
                    <div className="item-top is-case-study">
                      <div className="heading-style-h2">{cs.audioPlayer1.title}</div>
                      <div
                        data-wf--spacer--variant="l"
                        className="spacer-component w-variant-8c123a48-ff1f-5886-993b-c2bccb3f4e38"
                      />
                      <h2 className="copy-medium">{cs.audioPlayer1.subline}</h2>
                    </div>
                    <div className="item-bottom">
                      <div data-player-file={`${cs.slug}-audio-1`} className="audioplayer-controls">
                        <div data-player="progress-bar" className="progress-bar">
                          <div className="progress-bar-line" />
                          <div data-player="progress-fill" className="progress-bar-fill" />
                        </div>
                        <div className="progress-time">
                          <div data-player="current-time" className="current-time">
                            0:00
                          </div>
                          <div data-player="duration" className="duration">
                            0:00
                          </div>
                        </div>
                        <PlayerSpinnerButtons size="heading-style-h2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {cs.audioPlayer2.vimeoId && (
          <section className="section-project-audio-player-2">
            <div className="_2-column-grid">
              <div className="grid-item is-player">
                <div
                  className="grid-item-background-color"
                  style={cs.color ? { backgroundImage: `linear-gradient(135deg, ${cs.color.main}, ${cs.color.secondary})` } : undefined}
                />
                <div className="text-color-grey">
                  <div className="item-inner is-case-study">
                    <div className="item-top is-case-study">
                      <div className="heading-style-h2">{cs.audioPlayer2.title}</div>
                      <div
                        data-wf--spacer--variant="l"
                        className="spacer-component w-variant-8c123a48-ff1f-5886-993b-c2bccb3f4e38"
                      />
                      <h2 className="copy-medium">{cs.audioPlayer2.subline}</h2>
                    </div>
                    <div className="item-bottom">
                      <div data-player-file={`${cs.slug}-audio-2`} className="audioplayer-controls">
                        <div data-player="progress-bar" className="progress-bar">
                          <div className="progress-bar-line" />
                          <div data-player="progress-fill" className="progress-bar-fill" />
                        </div>
                        <div className="progress-time">
                          <div data-player="current-time" className="current-time">
                            0:00
                          </div>
                          <div data-player="duration" className="duration">
                            0:00
                          </div>
                        </div>
                        <PlayerSpinnerButtons size="heading-style-h2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-item is-media">
                <div className="audio-preview-embed hide w-embed w-iframe">
                  <iframe
                    id={`${cs.slug}-audio-2`}
                    title=""
                    src={vimeoSrc(cs.audioPlayer2.vimeoId)}
                    frameBorder="0"
                    allow="autoplay"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <div className="audio-preview-visual-wrapper is-player-2" />
              </div>
            </div>
          </section>
        )}

        {cs.textAfterAudioPlayerHtml && (
          <section className="section-project-cta-text">
            <div className="page-padding">
              <div className="container-medium">
                <div className="spacer-xxl-start spacer-xxl-end">
                  <div
                    className="rich-text-custom h2-is-h1-size w-richtext"
                    dangerouslySetInnerHTML={{ __html: cs.textAfterAudioPlayerHtml }}
                  />
                  <div
                    data-wf--spacer--variant="l"
                    className="spacer-component w-variant-8c123a48-ff1f-5886-993b-c2bccb3f4e38"
                  />
                  <div className="button-component">
                    <Link data-visual-speed="15" data-visual-form="button" href="/services" className="button w-inline-block">
                      <span
                        className="button-form"
                        style={{ display: "contents" }}
                        dangerouslySetInnerHTML={{ __html: BUTTON_FORM }}
                      />
                      <span
                        className="button-form is-thin-line"
                        style={{ display: "contents" }}
                        dangerouslySetInnerHTML={{ __html: BUTTON_FORM_HIGHLIGHT }}
                      />
                      <div className="button-hover-background" />
                      <div className="button-text crop-line-height">Want to know more about how we work?</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {[cs.video1VimeoId, cs.video2VimeoId, cs.video3VimeoId].map(
          (vimeoId, i) =>
            vimeoId && (
              <section className={`section-project-video-${i + 1}`} key={i}>
                {i > 0 && (
                  <div
                    data-wf--spacer--variant="md"
                    className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                  />
                )}
                <div className="video-16-9 w-embed w-iframe">
                  <iframe
                    id={`${cs.slug}-video-${i + 1}`}
                    title=""
                    src={vimeoSrc(vimeoId)}
                    frameBorder="0"
                    allow="autoplay"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <button
                  data-player="play-button-big"
                  data-player-target={`${cs.slug}-video-${i + 1}`}
                  aria-label="play and pause button"
                  className="play-toggle-big"
                >
                  <div data-player="play-text" className="text-block">
                    Play
                  </div>
                </button>
                <div className="project-video-controls">
                  <div data-player-file={`${cs.slug}-video-${i + 1}`} className="audioplayer-controls">
                    <div data-player="progress-bar" className="progress-bar">
                      <div className="progress-bar-line" />
                      <div data-player="progress-fill" className="progress-bar-fill" />
                    </div>
                    <div className="progress-time">
                      <div data-player="current-time" className="current-time">
                        0:00
                      </div>
                      <div data-player="duration" className="duration">
                        0:00
                      </div>
                    </div>
                    <PlayerSpinnerButtons size="copy-medium" />
                  </div>
                </div>
              </section>
            )
        )}

        {cs.awards.length > 0 && (
          <section className="section-project-awrads">
            <div className="page-padding">
              <div className="spacer-xl-start spacer-xl-end">
                <h2 className="copy-medium">Awarded at</h2>
                <div
                  data-wf--spacer--variant="l"
                  className="spacer-component w-variant-8c123a48-ff1f-5886-993b-c2bccb3f4e38"
                />
                <div className="w-dyn-list">
                  <div role="list" className="awrads-list w-dyn-items">
                    {cs.awards.map((award) => (
                      <div role="listitem" className="w-dyn-item" key={award.slug}>
                        {award.image && <img src={award.image} loading="lazy" alt={award.name} className="awards-image" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {cs.gallery2.length > 0 && (
          <section className="section-project-gallery-2">
            <div className="marquee-component">
              {[0, 1].map((row) => (
                <div className="w-dyn-list" key={row}>
                  <div data-marquee="horizontal" role="list" className="marquee-list w-dyn-items">
                    {cs.gallery2.map((src, i) => (
                      <div role="listitem" className="marquee-item w-dyn-item" key={i}>
                        <img loading="lazy" src={src} alt="" className="marquee-image" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {nextCase && (
          <section className="section-project-next-case">
            <div className="page-padding">
              <div className="container-large align-left">
                <div className="spacer-xxl-start spacer-xl-end">
                  <h2 className="heading-style-h1">Next Case Study:</h2>
                </div>
              </div>
            </div>
            <div className="w-dyn-list">
              <div role="list" className="w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <div className="page-teaser-wide-component">
                    <div
                      className="project-stage-visual-wrapper"
                      style={nextCase.color ? { backgroundImage: `linear-gradient(135deg, ${nextCase.color.main}, ${nextCase.color.secondary})` } : undefined}
                    />
                    <div className="z-index-1">
                      <div
                        data-wf--box-inner-text--variant="is-next-case-study-teaser"
                        className="item-inner w-variant-d9f4f337-c70e-b4e9-7a9a-312292f48761"
                      >
                        <div className="item-top w-variant-d9f4f337-c70e-b4e9-7a9a-312292f48761">
                          <div className="copy-small">
                            <div className="meta-list-component">
                              <div
                                className="meta-list w-richtext"
                                dangerouslySetInnerHTML={{ __html: nextCase.clientListHtml }}
                              />
                            </div>
                          </div>
                          <div
                            data-wf--spacer--variant="md"
                            className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                          />
                          <h2 className="heading-style-h1">{nextCase.title}</h2>
                        </div>
                        <div className="item-bottom">
                          <div
                            data-wf--cta-link--variant="dark-text"
                            className="cta-link-component w-variant-dee7867e-1b44-c2d3-0b3d-782590fc4f34"
                          >
                            <Link
                              aria-hidden="true"
                              aria-label="Read Case"
                              href={`/case-studies/${nextCase.slug}`}
                              className="cta-link-full-cover w-inline-block"
                            />
                            <Link
                              aria-label="Read Case"
                              href={`/case-studies/${nextCase.slug}`}
                              className="cta-link w-inline-block"
                            >
                              <div className="cta-link-line w-variant-dee7867e-1b44-c2d3-0b3d-782590fc4f34" />
                              <div className="cta-link-text">Read More</div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
}
