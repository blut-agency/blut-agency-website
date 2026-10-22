import Link from "next/link";
import type { ReactNode } from "react";
import CaseStudyVisual from "@/components/CaseStudyVisual";
import CtaArrow from "@/components/CtaArrow";
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

/** "— Label" link (the line stretches on hover) with the corner arrow. */
export function CtaLink({ href, label }: { href: string; label: string }) {
  const external = /^(mailto:|https?:)/.test(href);
  const inner = (
    <>
      <span className="lp-cta-line" aria-hidden="true" />
      <span className="lp-cta-text">{label}</span>
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
      <CtaArrow />
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
            <p className="lp-copy">{line}</p>
          </div>
        </div>
      )}
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
            <p className="lp-copy">
              <Link href={p.page} className="bk-contact-name">
                {p.name}
              </Link>
            </p>
            <p className="lp-copy bk-contact-role">{p.role}</p>
            <CtaLink href={`mailto:${p.mail}`} label="Mail" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A service (Strategy, Figma 250:1130): headline across two thirds with its
 * line stepped in beneath it, the intro in muted grey in the last third; then
 * the tools as FAQ-style drawers in two thirds and a static photo in the last
 * third. Drawers: see Drawer.tsx.
 */
export function ServiceDrawers({
  heading,
  line,
  image,
  alt,
  intro,
  items,
  cta,
}: {
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
        <div className="bk-service-lead">
          <RevealText
            as="h2"
            className={`lp-heading${hasLongWord(heading) ? " is-long-word" : ""}`}
            text={heading}
          />
          <p className="lp-copy bk-service-line">{line}</p>
        </div>
        <p className="bk-service-intro">{intro}</p>
      </div>
      <div className="lp-wrap bk-service">
        <div className="bk-service-body">
          <div className="bk-drawers">
            {items.map((item) => (
              <Drawer key={item.name} name={item.name} text={item.text} />
            ))}
          </div>
          {cta && <CtaLink href={cta.href} label={cta.label} />}
        </div>
        <div className="bk-service-media">
          <img src={image} alt={alt} loading="lazy" />
        </div>
      </div>
    </>
  );
}
