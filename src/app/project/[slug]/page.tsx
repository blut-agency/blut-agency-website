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
import { getCaseStudies, getCaseStudyBySlug, getNextCaseStudy, type CaseStudy, type CaseStudyVideoFile } from "@/lib/content";
import CaseStudyVisual, { visualVariant } from "@/components/CaseStudyVisual";
import { PlayerSpinnerButtons } from "@/components/MediaFrame";
import RevealText from "@/components/RevealText";
import { caseSections, type CaseSection } from "@/lib/caseSections";
import CaseVideo from "@/components/CaseVideo";
import { getSite } from "@/lib/site";

/*
  Case page (the editorial layout tested on /case-lab, Oct 2026): the case's
  banner with its facts, then the case's sections in the order the studio's
  case builder sets (chapters, quote, videos, picture strips, loop, audio,
  awards; see lib/caseSections.ts), then the next case, contact and footer.
  A chapter is headed by a stage name over its question line (two-tone
  heading). The placeholder stage names are marked with an asterisk.
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
/** Shared words: fact labels, the chapter link, "Next case study:" (Sanity: Shared texts). */
const LABELS = getSite().labels;

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
  const sections = cs.sections;
  const q = sections ? sections.find((x) => x.type === "caseQuote") : { quote: cs.quote, name: cs.quoteName };
  const quote = q?.quote ?? "";
  const quoteName = q?.name ?? "";
  const audio = sections ? sections.find((x) => x.type === "caseAudio") : cs.audioPlayer1;
  const track = (audio?.title ?? "").replace(/\s+/g, " ").trim();
  const description = quote
    ? `${quote} ${quoteName} | Full-Service Music Agency | Strategy & Identity | ${track} | Project Case Study`
    : `${cs.teaserClient}: ${cs.teaserCampaign}. A blut case study in music, sound and sonic strategy.`;
  return {
    title: `${cs.title} | blut | Case Study | Music Strategy`,
    description,
    ...share({
      title: `${cs.teaserClient} – ${cs.title}`,
      description: quote ? `${quote} ${quoteName}` : description,
      path: `/project/${cs.slug}`,
      image: { url: cs.thumbnail, alt: `${cs.teaserClient} – ${cs.teaserCampaign}` },
    }),
  };
}

function Chapter({
  stage,
  heading,
  body,
  aiDraft = false,
  note = false,
  children,
}: {
  stage: string;
  heading?: string;
  /** HTML. */
  body?: string;
  /** The case's copy is AI-written: shown in red. */
  aiDraft?: boolean;
  /** Show the AI note above this chapter (the first one). */
  note?: boolean;
  children?: ReactNode;
}) {
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
          {heading && <RevealText as="p" className="bk-lab-chapter-line" text={heading} after={stage} />}
        </div>
        <div className="bk-lab-chapter-body">
          <div className="bk-lab-prose" dangerouslySetInnerHTML={{ __html: body ?? "" }} />
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
  file,
  label,
  accent,
}: {
  file: CaseStudyVideoFile;
  label: string;
  accent?: { background: string; text: string };
}) {
  return (
    <div className="lp-wrap bk-lab-video">
      <CaseVideo label={label} videoUrl={file.url} poster={file.poster} accent={accent} />
    </div>
  );
}

/** Audio: the case's moving shape on its colours beside the title and the player bar. */
function Audio({ cs, a, n }: { cs: CaseStudy; a: { title?: string; subline?: string; url: string }; n: number }) {
  const id = `${cs.slug}-audio-${n}`;
  return (
    <section className={`bk-section is-dark${cs.aiDraftCopy ? " ai-draft" : ""}`}>
      <div className="lp-wrap bk-lab-audio">
        <div className="bk-lab-audio-visual" style={cs.color ? { backgroundColor: cs.color.secondary, color: cs.color.main } : undefined}>
          <div className="audio-preview-embed hide w-embed w-iframe">
            <audio id={id} src={a.url} preload="metadata" />
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

  const nextCase = getNextCaseStudy(cs);
  const theme = cs.color ? themeFromColors(cs.color) : null;
  const nextTheme = nextCase?.color ? themeFromColors(nextCase.color) : null;
  // The quote sits on the case's ground colour (its styleguide pair's background;
  // a line colour is never a ground): dark text on a light one, white on a dark one.
  const quoteOnDark = theme ? !theme.lightBackground : false;
  const facts = [
    { label: LABELS.caseClient, items: listItems(cs.clientListHtml) },
    { label: LABELS.caseWhatWeDid, items: listItems(cs.whatWeDidHtml) },
    { label: LABELS.caseCollaborators, items: listItems(cs.collaboratorsHtml ?? "") },
  ].filter((f) => f.items.length > 0);
  // The play pill takes the case's colour on hover, as a spot's does on Production.
  const playAccent = theme
    ? { background: theme.background, text: theme.lightBackground ? "var(--_color---copy-dark)" : "var(--_color---copy-bright)" }
    : undefined;
  const sections = caseSections(cs);
  const firstChapter = sections.findIndex((x) => x.type === "caseChapter");
  // Audio players are numbered in page order (their ids link player bar and audio).
  const audioNumber = new Map<number, number>();
  sections.forEach((x, i) => {
    if (x.type === "caseAudio" && x.url) audioNumber.set(i, audioNumber.size + 1);
  });

  /** One builder section; empty ones render nothing. */
  const renderSection = (section: CaseSection, i: number): ReactNode => {
    switch (section.type) {
      case "caseChapter":
        if (!section.line && !section.body && !section.stage) return null;
        return (
          <Chapter key={i} stage={section.stage} heading={section.line} body={section.body} aiDraft={cs.aiDraftCopy} note={cs.aiDraftCopy && i === firstChapter}>
            {section.cta && <CtaLink href={LABELS.caseChapterLink.href} label={LABELS.caseChapterLink.label} />}
          </Chapter>
        );
      case "caseQuote":
        if (!section.quote) return null;
        return (
          <section key={i} className="bk-section bk-lab-quote-section" style={cs.color ? { backgroundColor: cs.color.secondary } : undefined}>
            <figure className={`lp-wrap bk-lab-quote${quoteOnDark ? " is-on-dark" : ""}`}>
              {section.photo && (
                <div className="bk-lab-quote-photo">
                  <img src={section.photo} alt="" loading="lazy" />
                </div>
              )}
              <div className="bk-lab-quote-text">
                <blockquote>{section.quote}</blockquote>
                <figcaption>{(section.name ?? "").replace(/^[–-]\s*/, "")}</figcaption>
              </div>
            </figure>
          </section>
        );
      case "caseVideos": {
        const videos = (section.videos ?? []).filter((v) => v?.url);
        if (!videos.length) return null;
        return (
          <section key={i} className="bk-section bk-lab-videos">
            {videos.map((file, n) => (
              <Video key={file.url} file={file} label={file.label || `${cs.teaserClient} film${videos.length > 1 ? ` ${n + 1}` : ""}`} accent={playAccent} />
            ))}
          </section>
        );
      }
      case "caseGallery":
        return section.images?.length ? <Gallery key={i} images={section.images} /> : null;
      case "caseLoop": {
        if (!section.url) return null;
        const hashtags = (section.hashtags ?? "").split(/\s(?=#)/).filter(Boolean);
        return (
          <section key={i} className="bk-section is-dark">
            <div className="lp-wrap bk-lab-loop">
              <div className="video-16-9">
                <video
                  src={section.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
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
        );
      }
      case "caseAudio":
        if (!section.url) return null;
        return <Audio key={i} cs={cs} a={section} n={audioNumber.get(i)!} />;
      case "caseAwards":
        if (!cs.awards.length) return null;
        return (
          <section key={i} className="bk-section">
            <div className="lp-wrap bk-lab-awards">
              <h2 className="lp-heading">{section.heading || "Awarded at"}</h2>
              <ul role="list">
                {cs.awards.map((award) => (
                  <li key={award.slug}>{award.image ? <img src={award.image} alt={award.name} loading="lazy" /> : award.name}</li>
                ))}
              </ul>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

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
          background={cs.color?.secondary ?? "#e7f639"}
          lineColor={cs.color?.main ?? "#977e72"}
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

        {sections.map((section, i) => renderSection(section, i))}

        {nextCase && (
          <section className="bk-section bk-next">
            <div className="lp-wrap bk-next-grid">
              <h2 className="lp-heading">{LABELS.nextCase}</h2>
              <CaseCard cs={nextCase} theme={nextTheme} formPrefix="next" />
            </div>
          </section>
        )}

        <ContactBlock pattern={cs.color ? { background: cs.color.secondary, line: cs.color.main } : undefined} />
        <LandingFooter
          band={{
            background: cs.color?.secondary ?? "#e7f639",
            line: cs.color?.main ?? "#977e72",
            light: theme?.lightBackground ?? true,
          }}
        />
      </div>
    </>
  );
}
