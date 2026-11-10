import type { Metadata } from "next";
import { getPage, heroHeading, pageMetadata } from "@/lib/pages";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import RevealText from "@/components/RevealText";
import WorkSpot from "@/components/WorkSpot";
import { themesForImages } from "@/lib/imageTheme";
import { ContactBlock, CtaLink, Lead, PageHero, ServiceDrawers } from "@/components/Blocks";

const page = getPage("strategyPage");

export const metadata: Metadata = pageMetadata(page.seo, "/strategy", { url: "/images/spt/sales-video-poster.jpg", alt: "The Sonic Performance Tracker" });

/*
  Strategy in the new design (Work v02 building blocks). The three services in
  the board's order: Sonic Strategy, Content Production, Performance &
  Measurement, each as ServiceDrawers (Figma 250:1130): name, question and
  intro on top, the three tools as drawers beside a static photo. Copy is the
  old page's, unchanged.
*/

/** The services' anchors, which links elsewhere point to; a new service gets one from its heading. */
const SECTION_IDS = ["sonic-strategy", "content-production", "performance"];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default async function StrategyPage() {
  const [salesTheme] = await themesForImages([page.film.image]);
  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="strategy-hero"
        heading={heroHeading(page.hero)}
        lineAiDraft={page.hero.placeholder}
        line={page.hero.line}
        background="var(--_color---accent-color-1)"
        lineColor="var(--_color---accent-color-3)"
        dark
      />
      <Header variant="start-top" />

      {/* The Sonic Performance Tracker sales video, full width (board node 85:2362),
          as the Work page's wide spot. Self-hosted for now (Nic's cutdown, Oct 2026). */}
      <section className="bk-section is-dark">
        {/* The full intro, under the banner (in it, Strategy's banner was taller than the
            other service pages', Elliot, Nov 2026). Large on the left, in the slot and style
            of the question on Production and Post (Nic, 10 Nov). */}
        <div className="lp-wrap bk-service-top is-long">
          <RevealText as="h2" className="lp-heading" text={page.intro} />
        </div>
        <div className="lp-wrap">
          <WorkSpot
            variant="wide"
            formId="strategy-sales-video"
            theme={salesTheme}
            spot={page.film}
          />
        </div>
      </section>

      {page.services.map((service, i) => (
        <section key={service.heading} className="bk-section is-dark" id={SECTION_IDS[i] ?? slug(service.heading)}>
          <ServiceDrawers
            flipped={i % 2 === 1}
            heading={service.heading}
            line={service.line}
            image={service.image}
            alt={service.alt}
            intro={service.intro}
            items={service.items}
            cta={service.link?.href ? service.link : undefined}
          />
        </section>
      ))}

      <section className="bk-section">
        <Lead
          boxed
          parallax={false}
          heading={page.lead.heading}
          text={page.lead.text}
        >
          <CtaLink href={page.lead.link.href} label={page.lead.link.label} />
        </Lead>
      </section>

      <ContactBlock person="karl" />
      <LandingFooter band={{ background: "var(--_color---accent-color-1)", line: "var(--_color---accent-color-3)", light: true }} />
    </div>
  );
}
