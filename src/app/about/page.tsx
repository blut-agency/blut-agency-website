import type { Metadata } from "next";
import { share } from "@/lib/share";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import TeamGrid from "@/components/TeamGrid";
import { PageHero } from "@/components/Blocks";

export const metadata: Metadata = {
  title: "About Us – Meet the Team Behind blut’s Sonic Vision",
  description:
    "Meet blut – a next-gen, full-service music agency redefining how brands use sound. Strategy, creativity, and measurable impact from a collective of sonic experts.",
  ...share({
    title: "About – Meet the Team Behind blut’s Sonic Vision",
    description: "Meet blut – a next-gen, full-service music agency redefining how brands use sound. Strategy, creativity, and measurable impact from a collective of sonic experts.",
    path: "/about",
  }),
};

/*
  About in the new design (Figma "About", node 249:1747): the red banner with
  the mission statement, "We are blut." over the team (TeamGrid), then the
  band and the footer. The offices section is gone (Elliot, Nov 2026); a
  Hamburg office photo may come back later.
*/

export default function AboutPage() {
  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="about-hero"
        heading={["Born out of Creativity.", "Rooted in Insight.", "Embedded in Music Culture."]}
        small
      />
      <Header variant="start-top" />

      <section className="bk-section">
        <div className="lp-wrap">
          <TeamGrid intro="A next generation creative agency for the modern era. We believe there’s a better way to integrate music into brand communication." />
        </div>
      </section>

      <LandingFooter band={{ background: "var(--_color---accent-color-3)", line: "var(--_color---accent-color-1)" }} />
    </div>
  );
}
