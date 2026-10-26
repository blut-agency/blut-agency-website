import type { Metadata } from "next";
import { share } from "@/lib/share";
import AiDraftNote from "@/components/AiDraftNote";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import CaseCard, { listItems } from "@/components/CaseCard";
import { ContactBlock, PageHero } from "@/components/Blocks";
import { themeFromColors } from "@/lib/imageTheme";
import { getCaseStudies, getCaseStudyBySlug, type CaseStudyVideoFile } from "@/lib/content";
import CaseStudyVisual, { visualVariant } from "@/components/CaseStudyVisual";
import { PlayerSpinnerButtons, vimeoSrc } from "@/components/MediaFrame";
import Button from "@/components/Button";
import RevealText from "@/components/RevealText";

// Morph durations the live project pages use, per case study.
// The "next case study" teaser at the foot of the page reuses the audio speed.
const STAGE_SPEED: Record<string, number> = {
  "hyundai-are-you-in": 10,
  "devils-advocate-brand-launch": 10,
  "wdr---re-arranging-perceptions": 10,
  "volkswagen-bringing-it-all-back-home": 10,
  "invention-is-instrumental": 17,
};
const AUDIO_SPEED: Record<string, number> = {
  "hyundai-are-you-in": 8,
  "devils-advocate-brand-launch": 7,
  "wdr---re-arranging-perceptions": 8,
  "volkswagen-bringing-it-all-back-home": 7,
  "invention-is-instrumental": 17,
};
const stageSpeed = (slug: string) => STAGE_SPEED[slug] ?? 10;
const audioSpeed = (slug: string) => AUDIO_SPEED[slug] ?? 8;

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
  // Mirrors the live site's description pattern:
  // "<quote> <name> | Full-Service Music Agency | Strategy & Identity | <track> | Project Case Study"
  const track = cs.audioPlayer1.title.replace(/\s+/g, " ").trim();
  const description = cs.quote
    ? `${cs.quote} ${cs.quoteName} | Full-Service Music Agency | Strategy & Identity | ${track} | Project Case Study`
    : `${cs.teaserClient}: ${cs.teaserCampaign}. A blut case study in music, sound and sonic strategy.`;
  return {
    title: `${cs.title} | blut | Case Study | Music Strategy`,
    description,
    ...share({
      title: `${cs.teaserClient} – ${cs.title}`,
      description: cs.quote ? `${cs.quote} ${cs.quoteName}` : description,
      path: `/project/${cs.slug}`,
      image: { url: cs.thumbnail, alt: `${cs.teaserClient} – ${cs.teaserCampaign}` },
    }),
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
  const theme = cs.color ? themeFromColors(cs.color) : null;
  const nextTheme = nextCase?.color ? themeFromColors(nextCase.color) : null;
  const services = listItems(cs.whatWeDidHtml);
  const collaborators = listItems(cs.collaboratorsHtml ?? "");

  return (
    <>
      {/*
        Every player on a case study page is tinted with that case's secondary
        colour — the play/pause text, the timecodes and the progress bar. All
        the player slugs on this page start with the case slug, so one prefix
        selector covers the quote video, both audio players and the videos.
      */}
      {cs.color && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
[data-player-file^="${cs.slug}"] { color: ${cs.color.secondary}; }
[data-player-file^="${cs.slug}"] .progress-bar-line,
[data-player-file^="${cs.slug}"] [data-player="progress-fill"] { background-color: ${cs.color.secondary}; }`,
          }}
        />
      )}
      <div className="main-wrapper lp-page bk-page bk-legacy">
        {/* The case's own colours, its moving shape and title; the nav sits under it. */}
        <PageHero
          form={cs.slug}
          heading={cs.title}
          line={listItems(cs.clientListHtml).join(" · ")}
          background={cs.color?.secondary ?? "var(--_color---accent-color-2)"}
          lineColor={cs.color?.main ?? "var(--_color---accent-color-1)"}
          dark={theme?.lightBackground ?? true}
          variant={visualVariant(cs.useVisual)}
          speed={stageSpeed(cs.slug)}
          visualizationJson={cs.visualizationJson}
        />
        <Header variant="start-top" />

        {(services.length > 0 || collaborators.length > 0) && (
          <section className="bk-meta">
            <div className="lp-wrap bk-meta-grid">
              {services.length > 0 && (
                <div>
                  <p className="bk-meta-label">What we did</p>
                  <ul className="lp-case-tags">
                    {services.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {collaborators.length > 0 && (
                <div>
                  <p className="bk-meta-label">Collaborators</p>
                  <ul className="lp-case-tags">
                    {collaborators.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {cs.quote && (
          <section className="section-project-quote">
            <div className="_2-column-grid">
              <div className="grid-item is-media">
                {cs.quoteImage && <img src={cs.quoteImage} loading="lazy" alt="" className="fit-cover-absolute" />}
              </div>
              <div className="grid-item">
                <div
                  className="grid-item-background-color"
                  style={cs.color ? { backgroundColor: cs.color.main } : undefined}
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
          <section className={`section-project-intro${cs.aiDraftCopy ? " ai-draft" : ""}`}>
            <div className="page-padding">
              <div className="container-medium">
                <div className="spacer-xxl-start spacer-xxl-end">
                  {cs.aiDraftCopy && <AiDraftNote />}
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
          <section
            className="section-project-gif-video"
            style={cs.color ? { backgroundColor: cs.color.main } : undefined}
          >
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

        {(cs.audioPlayer1.vimeoId || cs.audioPlayer1.url) && (
          <section className={`section-project-audio-player-1${cs.aiDraftCopy ? " ai-draft" : ""}`}>
            <div className="_2-column-grid">
              <div className="grid-item is-media">
                <div className="audio-preview-embed hide w-embed w-iframe">
                  {cs.audioPlayer1.url ? (
                    <audio id={`${cs.slug}-audio-1`} src={cs.audioPlayer1.url} preload="metadata" />
                  ) : (
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
                  )}
                </div>
                <div
                  className="audio-preview-visual-wrapper"
                  style={cs.color ? { backgroundColor: cs.color.secondary, color: cs.color.main } : undefined}
                >
                  <CaseStudyVisual
                    slug={cs.slug}
                    variant={visualVariant(cs.useVisual)}
                    speed={audioSpeed(cs.slug)}
                    startOnPlay
                    auto={false}
                    playerSlug={`${cs.slug}-audio-1`}
                  />
                </div>
              </div>
              <div className="grid-item is-player">
                <div className="grid-item-background-color" />
                <div className="text-color-grey">
                  <div className="item-inner is-case-study">
                    <div className="item-top is-case-study">
                      <div className="heading-style-h2" style={cs.color ? { color: cs.color.secondary } : undefined}>{cs.audioPlayer1.title}</div>
                      <div
                        data-wf--spacer--variant="l"
                        className="spacer-component w-variant-8c123a48-ff1f-5886-993b-c2bccb3f4e38"
                      />
                      <h2 className="copy-medium" style={cs.color ? { color: cs.color.secondary } : undefined}>
                        {cs.audioPlayer1.subline}
                      </h2>
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

        {(cs.audioPlayer2.vimeoId || cs.audioPlayer2.url) && (
          <section className={`section-project-audio-player-2${cs.aiDraftCopy ? " ai-draft" : ""}`}>
            <div className="_2-column-grid">
              <div className="grid-item is-player">
                <div className="grid-item-background-color" />
                <div className="text-color-grey">
                  <div className="item-inner is-case-study">
                    <div className="item-top is-case-study">
                      <div className="heading-style-h2" style={cs.color ? { color: cs.color.secondary } : undefined}>{cs.audioPlayer2.title}</div>
                      <div
                        data-wf--spacer--variant="l"
                        className="spacer-component w-variant-8c123a48-ff1f-5886-993b-c2bccb3f4e38"
                      />
                      <h2 className="copy-medium" style={cs.color ? { color: cs.color.secondary } : undefined}>
                        {cs.audioPlayer2.subline}
                      </h2>
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
                  {cs.audioPlayer2.url ? (
                    <audio id={`${cs.slug}-audio-2`} src={cs.audioPlayer2.url} preload="metadata" />
                  ) : (
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
                  )}
                </div>
                <div
                  className="audio-preview-visual-wrapper is-player-2"
                  style={cs.color ? { backgroundColor: cs.color.secondary, color: cs.color.main } : undefined}
                >
                  <CaseStudyVisual
                    slug={cs.slug}
                    variant={visualVariant(cs.useVisual)}
                    speed={audioSpeed(cs.slug)}
                    startOnPlay
                    auto={false}
                    playerSlug={`${cs.slug}-audio-2`}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {cs.textAfterAudioPlayerHtml && (
          <section className={`section-project-cta-text${cs.aiDraftCopy ? " ai-draft" : ""}`}>
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
                  <Button
                    href="/strategy"
                    icon="arrow-right"
                    accent={
                      theme
                        ? {
                            background: theme.background,
                            text: theme.lightBackground ? "var(--_color---copy-dark)" : "var(--_color---copy-bright)",
                          }
                        : undefined
                    }
                  >
                    Want to know more about how we work?
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {[
          ...[cs.video1VimeoId, cs.video2VimeoId, cs.video3VimeoId]
            .filter(Boolean)
            .map((vimeoId) => ({ vimeoId, file: undefined as CaseStudyVideoFile | undefined })),
          ...(cs.videoFiles ?? []).map((file) => ({ vimeoId: "", file })),
        ].map(
          ({ vimeoId, file }, i) => (
              <section className={`section-project-video-${i + 1}`} key={i}>
                {i > 0 && (
                  <div
                    data-wf--spacer--variant="md"
                    className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                  />
                )}
                <div className="video-16-9 w-embed w-iframe">
                  {file ? (
                    <video
                      id={`${cs.slug}-video-${i + 1}`}
                      src={file.url}
                      poster={file.poster}
                      preload="none"
                      playsInline
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
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
                  )}
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
          <section
            className="section-project-awrads"
            style={cs.color ? { backgroundColor: cs.color.secondary } : undefined}
          >
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
          <section className="bk-section bk-next">
            <div className="lp-wrap bk-next-grid">
              <h2 className="lp-heading">Next case study:</h2>
              <CaseCard cs={nextCase} theme={nextTheme} formPrefix="next" />
            </div>
          </section>
        )}

        <ContactBlock person="michael" />
        <LandingFooter
          band={{
            background: cs.color?.secondary ?? "var(--_color---accent-color-2)",
            line: cs.color?.main ?? "var(--_color---accent-color-1)",
            light: theme?.lightBackground ?? true,
          }}
        />
      </div>
    </>
  );
}
