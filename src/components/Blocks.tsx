import Link from "next/link";
import AiDraftNote from "@/components/AiDraftNote";
import type { ReactNode } from "react";
import CaseStudyVisual from "@/components/CaseStudyVisual";
import Drawer from "@/components/Drawer";
import RevealText from "@/components/RevealText";

/*
  The page building blocks from Figma "Work v02", shared by every page in the
  new design. Styles: src/app/blocks.css (on top of landing.css). Wrap the
  page in <div className="main-wrapper lp-page"> for the tokens.
*/

/**
 * Parallax for headline + text layouts: both move with the scroll, the big
 * headline slower than the smaller text beside or below it.
 */
export const TEXT_PARALLAX = { heading: 0.3, text: 0.9 } as const;

/** A word this long doesn't fit a phone at the normal headline size. */
const hasLongWord = (text: string) => /[^\s]{11,}/.test(text);

/** "Label ↗" link: an underline draws in under the label on hover and the
 * arrow nudges up and right. Free-standing, the arrow follows the label;
 * inside a box the link spans the row and the arrow sits at its right end
 * (landing.css), on the label's line either way. */
export function CtaLink({ href, label }: { href: string; label: string }) {
  const external = /^(mailto:|https?:)/.test(href);
  const inner = (
    <>
      <span className="lp-cta-text">{label}</span>
      {/* Cropped to the drawn arrow, so 0.7em is about the cap height. */}
      <svg
        className="lp-cta-arrow"
        aria-hidden="true"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 13 13 1M3 1h10v10" />
      </svg>
    </>
  );
  return (
    <div className="cta-row">
      {external ? (
        <a href={href} className="lp-cta">
          {inner}
        </a>
      ) : (
        <Link href={href} className="lp-cta">
          {inner}
        </Link>
      )}
    </div>
  );
}

/**
 * Coloured banner with the moving line (720px on desktop, Figma 223:2416):
 * the headline large across the full width at the top, the short line at the
 * bottom in the right two thirds. Put the Header right after it so the nav
 * sits under it and then sticks.
 */
export function PageHero({
  heading,
  line,
  form,
  background = "var(--_color---accent-color-3)",
  lineColor = "var(--_color---accent-color-1)",
  dark = false,
  variant = 3,
  speed = 10,
  visualizationJson,
  lineAiDraft = false,
  children,
}: {
  /** One string, or one string per line. */
  heading: string | string[];
  line?: string;
  /** Unique per page: embeds.js animates the visual by it. */
  form: string;
  background?: string;
  lineColor?: string;
  /** Dark text, for light backgrounds. */
  dark?: boolean;
  /** The moving shape (a case page passes its own). */
  variant?: 1 | 2 | 3;
  speed?: number;
  visualizationJson?: string;
  /** The line is AI-written placeholder copy: shown in red with a note. */
  lineAiDraft?: boolean;
  /** Extra content at the foot of the banner (e.g. a case's facts). */
  children?: ReactNode;
}) {
  return (
    <section className={`bk-hero${dark ? " is-dark-text" : ""}`} style={{ background }}>
      <div className="bk-hero-visual" aria-hidden="true" style={{ color: lineColor }}>
        <CaseStudyVisual slug={form} variant={variant} speed={speed} visualizationJson={visualizationJson} />
      </div>
      <div className="lp-wrap bk-hero-top">
        <RevealText
          as="h1"
          className={`lp-heading bk-hero-heading${hasLongWord([heading].flat().join(" ")) ? " is-long-word" : ""}`}
          text={heading}
        />
      </div>
      {line && (
        <div className="lp-wrap bk-lead">
          <div className="bk-lead-text">
            {lineAiDraft && <AiDraftNote>AI-generated placeholder line (in red), replace before launch.</AiDraftNote>}
            <p className="lp-copy">{lineAiDraft ? <span className="ai-draft">{line}</span> : line}</p>
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

/** Big headline over two of three columns, the short line under it in the other two (flipped: headline right, line left; side: line in the last third, beside it). */
export function Lead({
  heading,
  text,
  flipped = false,
  boxed = false,
  side = false,
  as = "h2",
  longWord = false,
  parallax = true,
  children,
}: {
  heading: string;
  /** Headline and text drift at different speeds (TEXT_PARALLAX); off where it feels too floaty. */
  parallax?: boolean;
  /** Shrink on phones even without an 11+ letter word. */
  longWord?: boolean;
  text?: string;
  flipped?: boolean;
  /** The line sits in a grey box. */
  boxed?: boolean;
  /** The line sits in the last third, beside the headline's last line. */
  side?: boolean;
  as?: "h1" | "h2";
  children?: ReactNode;
}) {
  return (
    <div className={`lp-wrap bk-lead${flipped ? " is-flipped" : ""}${side ? " is-side" : ""}`}>
      <RevealText
        as={as}
        className={`lp-heading bk-lead-heading${longWord || hasLongWord(heading) ? " is-long-word" : ""}`}
        text={heading}
        parallax={parallax ? TEXT_PARALLAX.heading : undefined}
      />
      {(text || children) && (
        <div className={`bk-lead-text${boxed ? " lp-panel" : ""}`} data-parallax={parallax ? TEXT_PARALLAX.text : undefined}>
          {text && <p className="lp-copy">{text}</p>}
          {children}
        </div>
      )}
    </div>
  );
}

const PEOPLE = {
  karl: { name: "Karl Jawara", role: "Creative Product & Campaign Lead", file: "Karl", mail: "karl.jawara@blut.agency", page: "/team/karl-jawara" },
  michael: { name: "Michael Robb", role: "Head of Audio Production", file: "Michael", mail: "michael.robb@blut.agency", page: "/team/michael-robb" },
  // Address follows the team's first.last pattern; not yet confirmed by Elliot.
  elliot: { name: "Elliot Blunck", role: "Head of Video & Social Content", file: "Elliot", mail: "elliot.blunck@blut.agency", page: "" },
} as const;

/** Black closing block: "Sound good? Get in touch!" across two thirds, the person to contact in the last third (Figma 235:1469). */
export function ContactBlock({ person }: { person: keyof typeof PEOPLE }) {
  const p = PEOPLE[person];
  return (
    <section className="bk-section is-dark bk-contact">
      <div className="lp-wrap bk-contact-grid">
        <div className="bk-contact-heading">
          <p className="lp-heading">Sound good?</p>
          <p className="lp-heading">Get in touch!</p>
        </div>
        <div className="bk-contact-person">
          <div className="bk-contact-photo">
            <img
              src={`/images/${p.file}.jpg`}
              srcSet={`/images/${p.file}-p-500.jpg 500w, /images/${p.file}-p-800.jpg 800w, /images/${p.file}-p-1080.jpg 1080w, /images/${p.file}.jpg 1200w`}
              sizes="(max-width: 767px) 100vw, 30vw"
              alt={p.name}
              loading="lazy"
            />
          </div>
          <div>
            {/* Name not linked for now: the team pages are being rethought (Nic, Oct 2026). */}
            <p className="lp-copy bk-contact-name">{p.name}</p>
            <p className="lp-copy bk-contact-role">{p.role}</p>
            <CtaLink href={`mailto:${p.mail}`} label="Mail" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A service (Strategy, Figma 250:1130): headline with its subline under it
 * at the same size in grey, then a row with the intro above the tools
 * (FAQ-style drawers) in two thirds and a static photo in the last third; the
 * CTA sits on the photo, which links there as a whole. Drawers: see Drawer.tsx. `flipped` mirrors the drawer row, for the
 * left-right-left arrangement down a page.
 */
export function ServiceDrawers({
  heading,
  line,
  image,
  alt,
  intro,
  items,
  cta,
  flipped = false,
}: {
  /** Mirrored drawer row: drawers on the right, photo on the left. */
  flipped?: boolean;
  heading: string;
  line: string;
  image: string;
  alt: string;
  intro: string;
  items: { name: string; text: string }[];
  cta?: { href: string; label: string };
}) {
  return (
    <>
      <div className="lp-wrap bk-service-top">
        <RevealText
          as="h2"
          className={`lp-heading${hasLongWord(heading) ? " is-long-word" : ""}`}
          text={heading}
        />
        <RevealText as="p" className="bk-service-line" text={line} after={heading} />
      </div>
      <div className={`lp-wrap bk-service${flipped ? " is-flipped" : ""}`}>
        <div className="bk-service-body">
          <p className="bk-service-intro">{intro}</p>
          <div className="bk-drawers">
            {items.map((item) => (
              <Drawer key={item.name} name={item.name} text={item.text} />
            ))}
          </div>
        </div>
        <div className={`bk-service-media${cta ? " lp-hover has-cta" : ""}`}>
          <img src={image} alt={alt} loading="lazy" />
          {cta && (
            <>
              <Link href={cta.href} className="lp-cover" aria-hidden="true" tabIndex={-1} />
              <CtaLink href={cta.href} label={cta.label} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
