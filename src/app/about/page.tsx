import type { Metadata } from "next";
import { getPage, heroHeading, pageMetadata } from "@/lib/pages";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import TeamGrid from "@/components/TeamGrid";
import { PageHero } from "@/components/Blocks";

const page = getPage("aboutPage");

export const metadata: Metadata = pageMetadata(page.seo, "/about");

/*
  About in the new design (Figma "About", node 249:1747): the pink banner with
  the mission statement, "We are blut." over the team (TeamGrid), then the
  band and the footer. The offices section is gone (Elliot, Nov 2026); a
  Hamburg office photo may come back later.
*/

export default function AboutPage() {
  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="about-hero"
        heading={heroHeading(page.hero)}
        line={page.hero.line || undefined}
        lineAiDraft={page.hero.placeholder}
        small
        background="#e5d2e5"
        lineColor="#c66274"
        dark
      />
      <Header variant="start-top" />

      <section className="bk-section">
        <div className="lp-wrap">
          <TeamGrid intro={page.teamIntro} />
        </div>
      </section>

      <LandingFooter band={{ background: "#e5d2e5", line: "#c66274", light: true }} />
    </div>
  );
}
