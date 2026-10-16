import type { Metadata } from "next";
import Header from "@/components/Header";
import GridFooter from "@/components/GridFooter";
import LogoBand from "@/components/LogoBand";
import GradientBanner from "@/components/GradientBanner";
import RevealText from "@/components/RevealText";
import { getLocations, type Location } from "@/lib/content";
import TeamGrid, { type Member } from "./TeamGrid";
import { OFFICE_VISUAL_START_LARGE, OFFICE_VISUAL_START_THIN, OFFICE_VISUAL_END } from "./officeVisuals";
import "./about.css";

export const metadata: Metadata = {
  title: "About Us – Meet the Team Behind blut’s Sonic Vision",
  description:
    "Meet blut – a next-gen, full-service music agency redefining how brands use sound. Strategy, creativity, and measurable impact from a collective of sonic experts.",
};

/*
  Team in the current order (names, roles, emails and photos from the previous
  About page). Positions follow Nic's Figma (142:1113): Michael, Karl, Timo
  and Elliot sit where they're drawn. Robert has no square in the Figma, so
  he takes the empty top-right corner (and the first square on phones).
*/
const TEAM: Member[] = [
  {
    name: "Robert Hosp",
    role: "Strategy & Client Development Lead",
    email: "robert.hosp@blut.agency",
    photo: "Robert",
    desk: [1, 8],
    phone: [1, 1],
  },
  {
    name: "Michael Robb",
    role: "Head of Audio Production",
    email: "michael.robb@blut.agency",
    photo: "Michael",
    desk: [2, 2],
    phone: [1, 3],
  },
  {
    name: "Elliot Blunck",
    role: "Head of Video & Social Content",
    email: "elliot.blunck@blut.agency",
    photo: "Elliot",
    desk: [4, 4],
    phone: [1, 5],
  },
  {
    name: "Karl Jawara",
    role: "Creative Product & Campaign Lead",
    email: "karl.jawara@blut.agency",
    photo: "Karl",
    desk: [1, 5],
    phone: [4, 2],
  },
  {
    name: "Timo Blunck",
    role: "CEO & Founder",
    email: "timo.blunck@blut.agency",
    photo: "Timo",
    desk: [3, 7],
    phone: [4, 4],
  },
];

/** The Figma shows Elliot in the centre panel, so he's shown first. */
const INITIAL_MEMBER = 2;

function Spacer() {
  return (
    <div className="gl-spacer ab-spacer" aria-hidden="true">
      <div className="gl-col" />
    </div>
  );
}

/** Office visual + its sound, the same markup as before (embeds.js drives it). */
function OfficeCell({ office }: { office: Location }) {
  return (
    <div role="listitem" className="ab-office">
      <div className="offices-media-wrapper ab-office-media">
        <div className="offices-media-slot">
          <div className="offices-visual-wrapper">
            <div
              data-visual-start-on-play="true"
              data-visual-form={`office-${office.slug}`}
              data-visual-speed="10"
              data-visual-auto="false"
              data-visual-player={`office-${office.slug}`}
              className="visual-canvas"
            >
              <div className="visual-2-size">
                <div
                  data-visual-sound="base"
                  className="form"
                  dangerouslySetInnerHTML={{ __html: OFFICE_VISUAL_START_LARGE }}
                />
              </div>
              <div className="visual-2-size">
                <div
                  data-visual-sound="mid"
                  className="form is-thin-line"
                  dangerouslySetInnerHTML={{ __html: OFFICE_VISUAL_START_THIN }}
                />
              </div>
              <div className="visual-2-size">
                <div className="form is-end-scene" dangerouslySetInnerHTML={{ __html: OFFICE_VISUAL_END }} />
              </div>
              <textarea
                readOnly
                data-visual-json={`office-${office.slug}`}
                className="visualization-json"
                defaultValue={office.visualizationJson}
              />
            </div>
            <div className="visual-background-noise" />
          </div>
          <div className="audio-preview-embed hide w-embed w-iframe">
            <iframe
              id={`office-${office.slug}`}
              title={`Play sound from ${office.name}`}
              src={`https://player.vimeo.com/video/${office.vimeoId}?api=1&controls=0&loop=1&background=0&dnt=1`}
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
        </div>
      </div>
      <div className="ab-office-copy">
        <h3 className="ab-office-title">{office.name}</h3>
        <div className="ab-office-address w-richtext" dangerouslySetInnerHTML={{ __html: office.contentHtml }} />
      </div>
    </div>
  );
}

/*
  About page in the grid-landing layout: banner, nav, mission statement row,
  team grid (Nic's Figma 142:1113), offices (three cells), contact row, band,
  footer. Only existing copy. Styles: ./about.css, scoped to .ab-page.
*/
export default function AboutPage() {
  const locations = getLocations();

  return (
    <div className="main-wrapper gl-page ab-page">
      {/* The About colours from before: red with the moving blue line. */}
      <div className="gl-banner ab-banner">
        <GradientBanner
          form="about-hero"
          background="var(--_color---accent-color-3)"
          line="var(--_color---accent-color-1)"
        >
          <RevealText as="h1" className="heading-style-h1" text="We are blut." />
          <p className="copy-medium">
            A next generation creative agency for the modern era. We believe there’s a better way to integrate music
            into brand communication.
          </p>
        </GradientBanner>
      </div>
      <Header variant="start-top" />

      {/* Mission: a dark statement row, like the closing row on Cases. */}
      <section className="gl-row is-dark ab-mission" aria-labelledby="mission-label">
        <div className="gl-col ab-mission-inner">
          <h2 id="mission-label" className="fx-label">
            Mission Statement
          </h2>
          <RevealText
            as="p"
            className="heading-style-h1"
            text={["Born out of Creativity.", "Rooted in Insight.", "Embedded in Music Culture."]}
          />
        </div>
      </section>

      <Spacer />
      <section className="gl-row ab-team" aria-labelledby="team-label">
        <h2 id="team-label" className="ab-sr-only">
          Team
        </h2>
        <div className="gl-col">
          <TeamGrid members={TEAM} initial={INITIAL_MEMBER} />
        </div>
      </section>
      <Spacer />

      {/* Offices: one row, a cell per city, hairlines between them. */}
      <section className="gl-row is-dark ab-offices" aria-labelledby="offices-label">
        <div className="gl-col ab-offices-head">
          <h2 id="offices-label" className="fx-label">
            Offices
          </h2>
        </div>
        <div role="list" className="gl-col ab-offices-grid">
          {locations.map((office) => (
            <OfficeCell key={office.slug} office={office} />
          ))}
        </div>
      </section>

      <div className="gl-row ab-contact">
        <div className="gl-col ab-contact-inner">
          <div className="cta-link-component gl-cta">
            <a aria-label="Want to get to know us better? Get in touch!" href="#footer" className="cta-link w-inline-block">
              <div className="cta-link-line" />
              <div className="cta-link-text">Want to get to know us better? Get in touch!</div>
            </a>
          </div>
        </div>
      </div>

      <LogoBand theme="sky" />
      <GridFooter />
    </div>
  );
}
