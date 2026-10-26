import type { Metadata } from "next";
import { share } from "@/lib/share";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import CaseStudyVisual, { patternAt } from "@/components/CaseStudyVisual";
import TeamOrbit from "@/components/TeamOrbit";
import RevealText from "@/components/RevealText";
import { CtaLink, PageHero } from "@/components/Blocks";
import { getLocations } from "@/lib/content";

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
  the mission statement, the team circling "We are blut." (TeamOrbit), then
  the three offices as staggered cards on black, the band and the footer.
*/

// Each office card's visual, in one of the site's colour themes.
const OFFICE_THEMES: Record<string, { background: string; line: string }> = {
  hamburg: { background: "var(--_color---accent-color-3)", line: "var(--_color---accent-color-1)" },
  berlin: { background: "#7a3bff", line: "#02b7fd" },
  munich: { background: "#e7f639", line: "#82685b" },
};

/** Address lines and the Maps link from an office's CMS rich text. */
function officeDetails(html: string) {
  const href = html.match(/href="([^"]+)"/)?.[1] ?? "";
  const lines = html
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return { href, lines };
}

export default function AboutPage() {
  const offices = getLocations();

  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="about-hero"
        heading={["Born out of Creativity.", "Rooted in Insight.", "Embedded in Music Culture."]}
      />
      <Header variant="start-top" />

      <section className="bk-section">
        <div className="lp-wrap">
          <TeamOrbit intro="A next generation creative agency for the modern era. We believe there’s a better way to integrate music into brand communication." />
        </div>
      </section>

      <section className="bk-section is-dark">
        <div className="lp-wrap">
          <RevealText as="h2" className="lp-heading" text="Offices" />
        </div>
        <div className="lp-wrap">
          <ul role="list" className="lp-case-grid bk-offices">
            {offices.map((office, i) => {
              const { href, lines } = officeDetails(office.contentHtml);
              const theme = OFFICE_THEMES[office.slug] ?? OFFICE_THEMES.hamburg;
              return (
                <li key={office.slug} data-parallax={[0.8, 0.4, 1.2][i % 3]}>
                  <article className="lp-case lp-hover hl-row">
                    <div className="lp-case-media" style={{ background: theme.background }}>
                      <div className="bk-office-visual" aria-hidden="true" style={{ color: theme.line }}>
                        <CaseStudyVisual slug={`office-${office.slug}`} {...patternAt(i)} />
                      </div>
                    </div>
                    <div className="lp-case-body">
                      <h3 className="lp-case-title">{office.name}</h3>
                      <p className="bk-office-address">
                        {lines.map((line, j) => (
                          <span key={line}>
                            {j > 0 && <br />}
                            {line}
                          </span>
                        ))}
                      </p>
                      {href && <CtaLink href={href} label="Open in Maps" />}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <LandingFooter band={{ background: "var(--_color---accent-color-3)", line: "var(--_color---accent-color-1)" }} />
    </div>
  );
}
