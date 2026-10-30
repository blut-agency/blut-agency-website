import type { Metadata } from "next";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import LogoBand from "@/components/LogoBand";
import CaseCard from "@/components/CaseCard";
import WorkSpot from "@/components/WorkSpot";
import HomeRow from "@/components/HomeRow";
import Drawer from "@/components/Drawer";
import ReplayReveal from "./ReplayReveal";
import TeamOrbit from "@/components/TeamOrbit";
import Button from "@/components/Button";
import Icon, { ICON_NAMES } from "@/components/Icon";
import { ContactBlock, CtaLink, Lead, PageHero, ServiceDrawers } from "@/components/Blocks";
import { WORK_ITEMS } from "@/content/work";
import { PEOPLE } from "@/content/people";
import { getCaseStudies, getColors } from "@/lib/content";
import { highlightThemes, themesForImages } from "@/lib/imageTheme";
import "./sheet.css";

export const metadata: Metadata = {
  title: "Component sheet | blut",
  robots: { index: false, follow: false },
};

/*
  Scratch page (not linked, not in the sitemap, noindex): every token and
  building block the site uses, rendered with real content, each under a
  small label naming it and where it's used. Built only from the shared
  components, so it always shows what the pages show.
*/

const COLORS = [
  ["accent-color-1", "var(--_color---accent-color-1)"],
  ["accent-color-2", "var(--_color---accent-color-2)"],
  ["accent-color-3", "var(--_color---accent-color-3)"],
  ["accent-color-4", "var(--_color---accent-color-4)"],
  ["copy-dark", "var(--_color---copy-dark)"],
  ["copy-bright", "var(--_color---copy-bright)"],
  ["panel-light", "var(--lp-panel-light)"],
  ["panel-dark", "var(--lp-panel-dark)"],
  ["text-secondary", "var(--lp-text-secondary)"],
  ["muted", "var(--lp-muted)"],
  ["divider-grey", "var(--_color---divider-grey)"],
];

const TYPE = [
  ["--lp-hero", "Hero headline", "128 / 96 / 48"],
  ["--lp-heading", "Headline", "96 / 64 / 48"],
  ["--lp-client", "Client chip", "48 / 32 / 16"],
  ["--lp-copy", "Copy", "32 / 24 / 24"],
  ["--lp-text", "Small text", "16"],
];

const SPACING = [4, 8, 16, 24, 32, 48, 64, 96, 128, 160];

const TOKENS = [
  ["--lp-gap", "column gap", "48 / 32 / 24"],
  ["--lp-pad", "box padding", "32 / 24 / 24"],
  ["--lp-stack", "headline → content", "96 / 64 / 64"],
  ["--lp-space", "section padding", "160 / 128 / 96"],
  ["--lp-band", "logo band height", "80 / 64 / 48"],
];

function Label({ name, used }: { name: string; used?: string }) {
  return (
    <div className="lp-wrap cs-label">
      <span className="cs-label-name">{name}</span>
      {used && <span className="cs-label-used">{used}</span>}
    </div>
  );
}

function Group({ title }: { title: string }) {
  return (
    <div className="cs-group">
      <div className="lp-wrap">
        <p className="cs-group-title">{title}</p>
      </div>
    </div>
  );
}


const STATES = [
  ["Default", ""],
  ["Hover", "is-hover"],
  ["Pressed", "is-pressed"],
  ["Focus", "is-focus"],
  ["Disabled", "is-disabled"],
] as const;

/** Every state of both variants in one shape, then the sizes, with and without label. */
function ButtonSet({ shape }: { shape: "rect" | "pill" }) {
  return (
    <div className="lp-wrap cs-buttons">
      <div className="cs-btn-grid">
        <span />
        {STATES.map(([name]) => (
          <span key={name} className="cs-meta">
            {name}
          </span>
        ))}
        {(["solid", "outline"] as const).map((variant) => (
          <div key={variant} className="cs-btn-row">
            <span className="cs-meta">{variant}</span>
            {STATES.map(([name, cls]) => (
              <div key={name}>
                <Button variant={variant} shape={shape} icon="arrow-right" className={cls} disabled={cls === "is-disabled"}>
                  Get in touch
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="cs-btn-sizes">
        {(["sm", "md", "lg"] as const).map((size) => (
          <div key={size} className="cs-btn-size">
            <span className="cs-meta">{{ sm: "small · 32", md: "medium · 48", lg: "large · 64" }[size]}</span>
            <div className="cs-btn-line">
              <Button shape={shape} size={size}>
                Label
              </Button>
              <Button shape={shape} size={size} icon="arrow-right">
                Label
              </Button>
              <Button shape={shape} size={size} icon="play" iconFirst variant="outline">
                Play video
              </Button>
              <Button shape={shape} size={size} icon="add" aria-label="Add" />
              <Button shape={shape} size={size} icon="close" variant="outline" aria-label="Close" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ComponentSheetPage() {
  const cases = getCaseStudies();
  const caseThemes = await highlightThemes(cases.map((cs) => ({ image: cs.thumbnail, color: cs.color })));
  const spots = [WORK_ITEMS[0], WORK_ITEMS[1], WORK_ITEMS[2]];
  const spotThemes = await themesForImages(spots.map((item) => item.spot.image));
  const homeRow = {
    copy: "What do Nina Chuba, The Backstreet Boys and a secret lab in the Alps have in common?",
    href: "/production",
    cta: "See us in action",
    image: "/images/home/teaser-story.jpg",
    alt: "",
  };
  const [homeTheme] = await themesForImages([homeRow.image]);
  const michael = PEOPLE[0];

  return (
    <div className="main-wrapper lp-page bk-page cs-page">
      <Header variant="start-top" />

      <section className="bk-section">
        <div className="lp-wrap">
          <h1 className="lp-heading">Component sheet</h1>
          <p className="lp-copy cs-intro">Every token and block the site uses, with real content. Scratch page: not linked, not indexed.</p>
        </div>
      </section>

      {/* ---------- Tokens ---------- */}
      <Group title="Tokens" />
      <section className="bk-section cs-tight">
        <Label name="Colours" used="Webflow variables and .lp-page tokens" />
        <div className="lp-wrap cs-swatches">
          {COLORS.map(([name, value]) => (
            <div key={name} className="cs-swatch">
              <div className="cs-swatch-chip" style={{ background: value }} />
              <span>{name}</span>
            </div>
          ))}
        </div>

        <Label name="CMS colour themes" used="Case pages, hover highlights (secondary = background, main = line)" />
        <div className="lp-wrap cs-swatches">
          {getColors().map((c) => (
            <div key={c.slug} className="cs-swatch">
              <div className="cs-swatch-chip cs-theme" style={{ background: c.secondary }}>
                <span style={{ background: c.main }} />
              </div>
              <span>{c.name}</span>
            </div>
          ))}
        </div>

        <Label name="Type scale" used="desktop / tablet / phone, px" />
        <div className="lp-wrap cs-type">
          {TYPE.map(([token, name, sizes]) => (
            <div key={token} className="cs-type-row">
              <span className="cs-meta">
                {token}
                <br />
                {sizes}
              </span>
              <span style={{ fontSize: `var(${token})`, lineHeight: 1.05 }}>{name}</span>
            </div>
          ))}
        </div>

        <Label name="Spacing scale" used="every size comes from this, px" />
        <div className="lp-wrap cs-spacing">
          {SPACING.map((n) => (
            <div key={n} className="cs-space">
              <div style={{ width: n, height: n }} />
              <span>{n}</span>
            </div>
          ))}
        </div>

        <Label name="Layout tokens" used="desktop / tablet / phone, px" />
        <div className="lp-wrap cs-tokens">
          {TOKENS.map(([token, name, sizes]) => (
            <div key={token} className="cs-token">
              <div className="cs-token-bar" style={{ width: `var(${token})` }} />
              <span className="cs-meta">
                {token} · {name} · {sizes}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Type and small parts ---------- */}
      <Group title="Text and small parts" />
      <section className="bk-section cs-tight">
        <Label name="RevealText (.lp-heading)" used="Every headline: letters fade and rise in once" />
        <div className="lp-wrap">
          <ReplayReveal text="Why do you need blut?" />
        </div>

        <Label name=".lp-copy in .lp-panel" used="Grey boxes beside headlines" />
        <div className="lp-wrap cs-narrow">
          <div className="lp-panel">
            <p className="lp-copy">We’re a full-service, music-led creative agency, from strategy to music production.</p>
            <CtaLink href="/about" label="Get to know us" />
          </div>
        </div>

        <Label name="CtaLink" used="“— Label” link; line stretches and arrow appears on hover" />
        <div className="lp-wrap">
          <CtaLink href="/production" label="See our production work" />
        </div>

        <Label name="Service pills (.lp-case-tags)" used="Case cards, Work cards" />
        <div className="lp-wrap">
          <ul className="lp-case-tags">
            <li>Sonic Strategy</li>
            <li>Artist Partnership</li>
            <li>Music Production</li>
          </ul>
        </div>
      </section>

      {/* ---------- Buttons ---------- */}
      <Group title="Buttons" />
      <section className="bk-section cs-tight">
        <Label name="Button · rect" used="solid and outline, every state; sizes with label, icon and icon only" />
        <ButtonSet shape="rect" />
        <Label name="Button · pill" used="same set, rounded; icon-only pills are circles" />
        <ButtonSet shape="pill" />
      </section>
      <section className="bk-section is-dark cs-tight">
        <Label name="Button on black" used="colours invert inside .bk-section.is-dark" />
        <ButtonSet shape="rect" />
        <ButtonSet shape="pill" />
      </section>
      <section className="bk-section cs-tight">
        <Label name="Icon" used="IBM Carbon (Apache 2.0): square line ends; play and pause drawn to match" />
        <div className="lp-wrap cs-icons">
          {ICON_NAMES.map((name) => (
            <div key={name} className="cs-icon">
              <Icon name={name} size={32} />
              <span className="cs-meta">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Page heads ---------- */}
      <Group title="Page heads" />
      <Label name="Header" used="Every page, under the banner, then sticky" />
      <Header variant="start-top" />
      <Label name="PageHero" used="Work, Strategy, Cases, About, team and case pages" />
      <PageHero form="sheet-hero" heading="Work" line="A 360 degree Approach to Sonic Storytelling" />

      {/* ---------- Headline layouts ---------- */}
      <Group title="Headline layouts (Lead)" />
      <section className="bk-section cs-tight">
        <Label name="Lead" used="Headline over two thirds, line under it" />
        <Lead parallax={false} heading="It’s not just music." text="We specialize in assessing brands and creating bespoke sonic strategies." />
        <Label name="Lead boxed" used="Line in a grey box, with a CtaLink" />
        <Lead parallax={false} boxed heading="It’s everything around it." text="Our music production and data-driven sonic strategies work hand-in-hand.">
          <CtaLink href="/strategy" label="Get to know our process" />
        </Lead>
        <Label name="Lead flipped" used="Headline right, line left" />
        <Lead parallax={false} flipped heading="Sometimes the artist" text="is in the spotlight." />
      </section>
      <section className="bk-section is-dark cs-tight">
        <Label name="Lead side (dark section)" used="Work: above the spots" />
        <Lead side parallax={false} heading="What do Nina Chuba, The Backstreet Boys and a secret lab in the Alps have in common?" text="It’s blut, of course." />
      </section>

      {/* ---------- Teasers ---------- */}
      <Group title="Teasers (hover for the highlight)" />
      <section className="bk-section is-dark cs-tight">
        <Label name="HomeRow (.bk-spot.is-split)" used="Home: three rows, sides alternating" />
        <div className="lp-wrap">
          <HomeRow row={homeRow} theme={homeTheme} />
        </div>

        <Label name="WorkSpot wide" used="Work: full-width spots" />
        <div className="lp-wrap">
          <WorkSpot spot={spots[0].spot} theme={spotThemes[0]} variant="wide" formId="sheet-spot-0" />
        </div>

        <Label name="WorkSpot row" used="Work: photo two thirds, text one third" />
        <div className="lp-wrap">
          <WorkSpot spot={spots[1].spot} theme={spotThemes[1]} variant="row" formId="sheet-spot-1" />
        </div>

        <Label name="WorkSpot row flipped" used="Work: text left, client chip on the right" />
        <div className="lp-wrap">
          <WorkSpot spot={spots[2].spot} theme={spotThemes[2]} variant="row" flipped formId="sheet-spot-2" />
        </div>

        <Label name="CaseCard in .bk-case-list" used="Case Studies: stacked list" />
        <ul role="list" className="lp-wrap bk-case-list">
          <li>
            <CaseCard cs={cases[0]} theme={caseThemes[0]} formPrefix="sheet-list" />
          </li>
        </ul>

        <Label name="CaseCard in .lp-case-grid" used="Team pages: three staggered columns" />
        <div className="lp-wrap">
          <ul role="list" className="lp-case-grid">
            {cases.slice(1, 4).map((cs, i) => (
              <li key={cs.slug}>
                <CaseCard cs={cs} theme={caseThemes[i + 1]} formPrefix="sheet-grid" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Content blocks ---------- */}
      <Group title="Content blocks" />
      <section className="bk-section cs-tight">
        <Label name="ServiceDrawers" used="Strategy (three services), team pages (expertise)" />
        <ServiceDrawers
          heading={michael.expertise.heading}
          line={michael.expertise.line}
          intro={michael.expertise.intro}
          image={michael.expertise.image}
          alt={michael.expertise.alt}
          items={michael.expertise.items}
          cta={{ href: "/strategy", label: "Get to know our process" }}
        />

        <Label name="Drawer (FAQ)" used="Team pages; one open per group" />
        <div className="lp-wrap bk-drawers cs-narrow">
          {michael.faq.slice(0, 3).map((q) => (
            <Drawer key={q.name} name={q.name} text={q.text} />
          ))}
        </div>

        <Label name="TeamOrbit" used="About" />
        <div className="lp-wrap">
          <TeamOrbit intro="A next generation creative agency for the modern era." />
        </div>
      </section>

      {/* ---------- Page ends ---------- */}
      <Group title="Page ends" />
      <Label name="ContactBlock" used="Bottom of Work, Strategy, Cases, team pages" />
      <ContactBlock person="michael" />

      <Label name="LogoBand themes" used="Above the footer, in the page banner’s colours" />
      <LogoBand theme="brown-yellow" />
      <LogoBand theme="blue-violet" reverse />
      <LogoBand theme="red-pink" />

      <Label name="LandingFooter (with band)" used="Every page" />
      <LandingFooter band={{ background: "var(--_color---accent-color-3)", line: "var(--_color---accent-color-1)" }} />
    </div>
  );
}
