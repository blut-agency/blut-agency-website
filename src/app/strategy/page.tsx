import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import GridFooter from "@/components/GridFooter";
import LogoBand from "@/components/LogoBand";
import GradientBanner from "@/components/GradientBanner";
import MediaFrame from "@/components/MediaFrame";
import CaseStudyVisual from "@/components/CaseStudyVisual";
import RevealText from "@/components/RevealText";
import Accordion, { type AccordionItem } from "./Accordion";
import "./strategy.css";

export const metadata: Metadata = {
  title: "Strategy – Find Out What Your Sound Is Really Saying | blut",
  description:
    "We assess your existing sonic ecosystem across campaigns, channels, partnerships and experiences, then build an action plan to get your brand on the right path.",
};

type Section = {
  id: string;
  label: string;
  question: string;
  intro: string;
  items: AccordionItem[];
  /** Existing case study that shows this section in practice. */
  caseHref: string;
};

// Elliot's order. All copy is the existing Strategy page copy.
const SECTIONS: Section[] = [
  {
    id: "sonic-strategy",
    label: "Sonic Strategy",
    question: "Your brand needs a Sonic Identity – but which one?",
    intro:
      "We analyze your brand, its cultural context, the sounds of the market, and the habits of your target audience to define your perfect sonic identity. These are our tools:",
    items: [
      {
        title: "Sonic Sweetspot",
        body: "With our Sonic Sweetspot service, we provide a robust brand and competitor analysis that identifies the distinctive musical space a brand can claim for itself within the market.",
      },
      {
        title: "Sonic Trend Radar",
        body: "Our Sonic Trend Radar service gathers information on emerging sonic trends relevant to your brand, and suggests creative ways in which you can capitalize on their cultural impact.",
      },
      {
        title: "ArtistMatch",
        body: "Our ArtistMatch service uses both data-based research alongside qualitative factors to ensure the artist partnerships we recommend are not only creatively inspired but feel authentic and make strategic sense.",
      },
    ],
    caseHref: "/project/devils-advocate-brand-launch",
  },
  {
    id: "content-production",
    label: "Content Production",
    question: "How do we bring your sonic identity to life?",
    intro:
      "From strategy to real life. Informed by our analytical insights, we craft all kinds of assets shaped by music culture - from sound and film to events, merch, digital content, and immersive experiences - to power your communication across every touchpoint.",
    items: [
      {
        title: "Sonic Branding & Identity",
        body: "We don’t create jingles. We build sonic identities that become cultural signatures. Your sound is not decoration. It’s your brand’s heartbeat — recognizable, emotional, unforgettable.",
      },
      {
        title: "Content & Campaign Production",
        body: "We design campaigns, social content, films, and brand experiences that don’t just grab attention — they earn emotional loyalty. Every piece of content starts with your sonic DNA and turns it into real-world resonance.",
      },
      {
        title: "Cultural Activation & Experiences",
        body: "We orchestrate artist collaborations, branded playlists, cultural partnerships, and live experiences that make your brand part of the conversation — not an outsider shouting from the sidelines.",
      },
    ],
    caseHref: "/project/hyundai-are-you-in",
  },
  {
    id: "performance",
    label: "Performance & Measurement",
    question: "Not just music - measurable impact.",
    intro:
      "Keen insights and extraordinary craft are only part of the story. None of it means anything if we can’t measure the impact of our actions. We provide reporting, market research and data analytics to empirically prove the efficacy of our sonic strategies.",
    items: [
      {
        title: "Direct Response Tracking",
        body: "We measure what matters immediately: engagement rates, shares, searches, and audience reactions across platforms. No assumptions. Just clear signals that your sound is being heard — and felt.",
      },
      {
        title: "Cultural Resonance Analysis",
        body: "We track how your activations resonate emotionally and culturally — across demographics, subcultures, and digital spaces. Because cultural relevance isn’t built on views. It’s built on meaning.",
      },
      {
        title: "Strategic Impact Scoring",
        body: "Our Cultural Relevance Score and Strategy Score reveal how music drives brand loyalty, emotional equity, and market leadership. Finally, creativity you can manage — and monetize.",
      },
    ],
    caseHref: "/project/wdr---re-arranging-perceptions",
  },
];

/*
  Media cell colours: Figma's "Visual / Gradient" stand-in (orange with a pale
  grey line), animated like the banners.
  TODO(Elliot GIFs): swap the CaseStudyVisual in each .st-faq-head for the
  GIF Elliot sends (one per section); the label and question stay on top.
*/
const HEAD_BG = "#ff6004";
const HEAD_LINE = "#e2e2e2";

function CtaLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="cta-link-component gl-cta">
      <Link aria-label={label} href={href} className="cta-link w-inline-block">
        <div className="cta-link-line" />
        <div className="cta-link-text">{label}</div>
      </Link>
    </div>
  );
}

function Spacer() {
  return (
    <div className="gl-spacer st-spacer" aria-hidden="true">
      <div className="gl-col" />
    </div>
  );
}

/**
 * One FAQ block (Figma 140:1021): copy + accordion in one half, the textured
 * header cell (section name + question) in the other. Flipped every other
 * section, so the blocks alternate left / right.
 */
function FaqSection({ s, flipped }: { s: Section; flipped: boolean }) {
  return (
    <section id={s.id} className={`gl-row st-faq${flipped ? " is-flipped" : ""}`} aria-labelledby={`${s.id}-label`}>
      <div className="gl-col st-faq-grid">
        <div className="st-faq-copy">
          <p className="st-faq-intro">{s.intro}</p>
          <Accordion items={s.items} />
          <div className="st-faq-cta">
            <CtaLink href={s.caseHref} label="See it in action" />
          </div>
        </div>
        <div className="st-faq-head" style={{ backgroundColor: HEAD_BG }}>
          <div className="case-study-teaser-visual st-faq-visual" style={{ color: HEAD_LINE }} aria-hidden="true">
            <CaseStudyVisual slug={`strategy-${s.id}`} variant={3} speed={10} />
          </div>
          <h2 id={`${s.id}-label`} className="st-faq-label">
            {s.label}
          </h2>
          <p className="st-faq-question">{s.question}</p>
        </div>
      </div>
    </section>
  );
}

/*
  Strategy page in the grid-landing layout: banner, nav, Sonic Sweetspot
  video, three FAQ blocks (Figma 140:1021, alternating), one "Contact us!",
  closing row, band, footer. Styles: ./strategy.css, scoped to .st-page.
*/
export default function StrategyPage() {
  return (
    <div className="main-wrapper gl-page st-page">
      {/* Dark, so it doesn't clash with the orange behind the video below. */}
      <div className="gl-banner st-banner">
        <GradientBanner
          form="strategy-hero"
          background="var(--_color---background-dark-1)"
          line="var(--_color---accent-color-3)"
        >
          <RevealText as="h1" className="heading-style-h1" text="Find out what your sound is really saying." />
          <p className="copy-medium">
            We assess your existing sonic ecosystem across campaigns, channels, partnerships and experiences to
            identify what’s working, what’s missing and where value is being lost. Then we construct an action plan to
            get your brand on the right path.
          </p>
        </GradientBanner>
      </div>
      <Header variant="start-top" />

      <Spacer />
      {/* Sonic Sweetspot video, inside the 1280 column. */}
      <section className="gl-row st-video">
        <div className="gl-col">
          <MediaFrame
            id="spt-sales-video"
            poster="/images/spt/sales-video-poster.jpg"
            alt="Sonic Performance Tracker sales video"
          />
        </div>
      </section>

      {SECTIONS.map((s, i) => (
        <div key={s.id}>
          <Spacer />
          <FaqSection s={s} flipped={i % 2 === 1} />
        </div>
      ))}

      {/* Once, after the last section (it used to repeat in all three). */}
      <div className="gl-row st-contact">
        <div className="gl-col st-contact-inner">
          <CtaLink href="#footer" label="That’s what you need? Contact us!" />
        </div>
      </div>

      <Spacer />
      <section className="gl-row st-closing">
        <div className="gl-col gl-split">
          <div className="gl-cell">
            <RevealText as="h2" className="heading-style-h1" text="Want to see strategy at work?" />
          </div>
          <div className="gl-cell gl-copy">
            <div className="rich-text-custom w-richtext">
              <p>
                Our music production and data-driven sonic strategies work hand-in-hand to create memorable campaigns
                that genuinely connect with audiences.
              </p>
            </div>
            <CtaLink href="/case-studies" label="View our case studies" />
          </div>
        </div>
      </section>
      <Spacer />

      <LogoBand theme="lime" />
      <GridFooter />
    </div>
  );
}
