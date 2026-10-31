import type { Metadata } from "next";
import type { ReactNode } from "react";
import { share } from "@/lib/share";
import AiDraftNote from "@/components/AiDraftNote";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import CaseCard, { listItems } from "@/components/CaseCard";
import { ContactBlock, CtaLink, PageHero } from "@/components/Blocks";
import { themeFromColors } from "@/lib/imageTheme";
import { getCaseStudies, getCaseStudyBySlug, type CaseStudy, type CaseStudyVideoFile } from "@/lib/content";
import CaseStudyVisual, { visualVariant } from "@/components/CaseStudyVisual";
import { PlayerSpinnerButtons, vimeoSrc } from "@/components/MediaFrame";
import RevealText from "@/components/RevealText";
import CaseVideo from "@/components/CaseVideo";

/*
  Case page (the editorial layout tested on /case-lab, Oct 2026): the case's
  banner with its facts, then the CMS text sections as three chapters of the
  process, each headed by a stage name over the CMS question (two-tone
  heading), with the quote, picture strip, GIF loop, audio, videos and awards
  between them. Every block is left out when its content is missing. The
  stage names are AI-written placeholders, marked with an asterisk.
*/

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

const STAGES = ["The brief*", "The making*", "The result*"];

/** The CMS section's h2 as the heading, the rest as body HTML. */
function chapter(html: string) {
  const m = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  const heading = (m?.[1] ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
  // Webflow's placeholder alt text would be read out; the pictures are decorative.
  const rest = (m ? html.replace(m[0], "") : html).replace(/alt="__wf_reserved_inherit"/g, 'alt=""');
  return { heading, body: rest };
}

function Chapter({
  stage,
  html,
  aiDraft = false,
  note = false,
  children,
}: {
  stage: string;
  html: string;
  /** The case's copy is AI-written: shown in red. */
  aiDraft?: boolean;
  /** Show the AI note above this chapter (the first one). */
  note?: boolean;
  children?: ReactNode;
}) {
  const { heading, body } = chapter(html);
  return (
    <section className={`bk-section${aiDraft ? " ai-draft" : ""}`}>
      {note && (
        <div className="lp-wrap">
          <AiDraftNote />
        </div>
      )}
      <div className="lp-wrap bk-lab-chapter">
        <div className="bk-lab-chapter-head">
          <RevealText as="h2" className="lp-heading" text={stage} />
          {/* AI copy: the asterisk goes into the text, so it stays on the last word's line. */}
          {heading && <RevealText as="p" className="bk-lab-chapter-line" text={aiDraft ? `${heading}*` : heading} after={stage} />}
        </div>
        <div className="bk-lab-chapter-body">
          <div className="bk-lab-prose" dangerouslySetInnerHTML={{ __html: body }} />
          {children}
        </div>
      </div>
    </section>
  );
}

/** The case page's full-width picture strip (two rows scrolling sideways), the same markup as /project. */
function Gallery({ images }: { images: string[] }) {
  return (
    <section className="bk-section section-project-gallery">
      <div className="marquee-component">
        {[0, 1].map((row) => (
          <div className="w-dyn-list" key={row}>
            <div data-marquee="horizontal" role="list" className="marquee-list w-dyn-items">
              {images.map((src, i) => (
                <div role="listitem" className="marquee-item w-dyn-item" key={i}>
                  <img loading="lazy" src={src} alt="" className="marquee-image" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** A case video in the Production spot layout; it opens the spots' lightbox (CaseVideo). */
function Video({
  vimeoId,
  file,
  label,
  poster,
  accent,
}: {
  vimeoId?: string;
  /** A self-hosted video instead of Vimeo. */
  file?: CaseStudyVideoFile;
  label: string;
  poster: string;
  accent?: { background: string; text: string };
}) {
  return (
    <div className="lp-wrap bk-lab-video">
      <CaseVideo label={label} vimeoId={vimeoId} videoUrl={file?.url} poster={file?.poster ?? poster} accent={accent} />
    </div>
  );
}

/** Audio: the case's moving shape on its colours beside the title and the player bar. */
function Audio({ cs, n }: { cs: CaseStudy; n: 1 | 2 }) {
  const a = n === 1 ? cs.audioPlayer1 : cs.audioPlayer2;
  const id = `${cs.slug}-audio-${n}`;
  return (
    <section className={`bk-section is-dark${cs.aiDraftCopy ? " ai-draft" : ""}`}>
      <div className="lp-wrap bk-lab-audio">
        <div className="bk-lab-audio-visual" style={cs.color ? { backgroundColor: cs.color.secondary, color: cs.color.main } : undefined}>
          <div className="audio-preview-embed hide w-embed w-iframe">
            {a.url ? (
              <audio id={id} src={a.url} preload="metadata" />
            ) : (
              <iframe id={id} title="" src={vimeoSrc(a.vimeoId)} frameBorder="0" allow="autoplay" allowFullScreen />
            )}
          </div>
          <CaseStudyVisual slug={cs.slug} variant={visualVariant(cs.useVisual)} speed={audioSpeed(cs.slug)} startOnPlay auto={false} playerSlug={id} />
        </div>
        <div className="bk-lab-audio-text">
          <h2 className="lp-heading bk-lab-audio-title">{a.title}</h2>
          {a.subline && <p className="bk-lab-chapter-line">{a.subline}</p>}
          <div data-player-file={id} className="audioplayer-controls bk-lab-audio-bar">
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
      </div>
    </section>
  );
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const nextCase = getCaseStudyBySlug(cs.nextCaseStudySlug);
  const theme = cs.color ? themeFromColors(cs.color) : null;
  const nextTheme = nextCase?.color ? themeFromColors(nextCase.color) : null;
  // The quote sits on the main colour: dark text on a light one, white on a dark one.
  const quoteOnDark = cs.color ? !themeFromColors({ ...cs.color, secondary: cs.color.main })?.lightBackground : false;
  const facts = [
    { label: "Client", items: listItems(cs.clientListHtml) },
    { label: "What we did", items: listItems(cs.whatWeDidHtml) },
    { label: "Collaborators", items: listItems(cs.collaboratorsHtml ?? "") },
  ].filter((f) => f.items.length > 0);
  // The play pill takes the case's colour on hover, as a spot's does on Production.
  const playAccent = theme
    ? { background: theme.background, text: theme.lightBackground ? "var(--_color---copy-dark)" : "var(--_color---copy-bright)" }
    : undefined;
  const hashtags = cs.gifVideoHashtags.split(/\s(?=#)/).filter(Boolean);
  const videos = [
    ...[cs.video1VimeoId, cs.video2VimeoId, cs.video3VimeoId].filter(Boolean).map((vimeoId) => ({ vimeoId, file: undefined })),
    ...(cs.videoFiles ?? []).map((file) => ({ vimeoId: undefined, file })),
  ];

  return (
    <>
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
      <div className="main-wrapper lp-page bk-page bk-legacy bk-lab">
        {/* The facts sit at the foot of the case's banner, in its text colour. */}
        <PageHero
          form={cs.slug}
          heading={cs.title}
          background={cs.color?.secondary ?? "var(--_color---accent-color-2)"}
          lineColor={cs.color?.main ?? "var(--_color---accent-color-1)"}
          dark={theme?.lightBackground ?? true}
          variant={visualVariant(cs.useVisual)}
          speed={stageSpeed(cs.slug)}
          visualizationJson={cs.visualizationJson}
        >
          {facts.length > 0 && (
            <dl className="lp-wrap bk-lab-facts">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  {f.items.map((item) => (
                    <dd key={item}>{item}</dd>
                  ))}
                </div>
              ))}
            </dl>
          )}
        </PageHero>
        <Header variant="start-top" />

        {cs.introTextHtml && <Chapter stage={STAGES[0]} html={cs.introTextHtml} aiDraft={cs.aiDraftCopy} note={cs.aiDraftCopy} />}

        {cs.quote && (
          <section className="bk-section bk-lab-quote-section" style={cs.color ? { backgroundColor: cs.color.main } : undefined}>
            <figure className={`lp-wrap bk-lab-quote${quoteOnDark ? " is-on-dark" : ""}`}>
              {cs.quoteImage && (
                <div className="bk-lab-quote-photo">
                  <img src={cs.quoteImage} alt="" loading="lazy" />
                </div>
              )}
              <div className="bk-lab-quote-text">
                <blockquote>{cs.quote}</blockquote>
                <figcaption>{cs.quoteName.replace(/^[–-]\s*/, "")}</figcaption>
              </div>
            </figure>
          </section>
        )}

        {cs.videoUnderQuoteVimeoId && (
          <section className="bk-section">
            <Video vimeoId={cs.videoUnderQuoteVimeoId} label={`${cs.teaserClient} film`} poster={cs.thumbnail} accent={playAccent} />
          </section>
        )}

        {cs.gallery1.length > 0 && <Gallery images={cs.gallery1} />}

        {cs.textAfterGalleryHtml && <Chapter stage={STAGES[1]} html={cs.textAfterGalleryHtml} aiDraft={cs.aiDraftCopy} />}

        {cs.gifVideoVimeoId && (
          <section className="bk-section is-dark">
            <div className="lp-wrap bk-lab-loop">
              <div className="video-16-9 w-embed w-iframe">
                <iframe
                  title={`${cs.teaserCampaign}, silent loop`}
                  src={vimeoSrc(cs.gifVideoVimeoId, "autoplay=1&loop=1&controls=0&dnt=1&muted=1")}
                  frameBorder="0"
                  allow="autoplay"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                />
              </div>
              {hashtags.length > 0 && (
                <ul role="list" className="bk-lab-tags">
                  {hashtags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {(cs.audioPlayer1.vimeoId || cs.audioPlayer1.url) && <Audio cs={cs} n={1} />}
        {(cs.audioPlayer2.vimeoId || cs.audioPlayer2.url) && <Audio cs={cs} n={2} />}

        {cs.textAfterAudioPlayerHtml && (
          <Chapter stage={STAGES[2]} html={cs.textAfterAudioPlayerHtml} aiDraft={cs.aiDraftCopy}>
            <CtaLink href="/strategy" label="Want to know more about how we work?" />
          </Chapter>
        )}

        {videos.length > 0 && (
          <section className="bk-section bk-lab-videos">
            {videos.map(({ vimeoId, file }, i) => (
              <Video
                key={vimeoId ?? file?.url}
                vimeoId={vimeoId}
                file={file}
                label={`${cs.teaserClient} film ${i + 1}`}
                poster={cs.thumbnail}
                accent={playAccent}
              />
            ))}
          </section>
        )}

        {cs.awards.length > 0 && (
          <section className="bk-section">
            <div className="lp-wrap bk-lab-awards">
              <h2 className="lp-heading">Awarded at</h2>
              <ul role="list">
                {cs.awards.map((award) => (
                  <li key={award.slug}>{award.image ? <img src={award.image} alt={award.name} loading="lazy" /> : award.name}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {cs.gallery2.length > 0 && <Gallery images={cs.gallery2} />}

        {nextCase && (
          <section className="bk-section bk-next">
            <div className="lp-wrap bk-next-grid">
              <h2 className="lp-heading">Next case study:</h2>
              <CaseCard cs={nextCase} theme={nextTheme} formPrefix="next" />
            </div>
          </section>
        )}

        <ContactBlock />
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
