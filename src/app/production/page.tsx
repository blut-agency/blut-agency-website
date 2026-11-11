import type { Metadata } from "next";
import { getPage, heroHeading, pageMetadata } from "@/lib/pages";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import { ContactBlock, CtaLink, Lead, PageHero } from "@/components/Blocks";
import RevealText from "@/components/RevealText";
import WorkSpot from "@/components/WorkSpot";
import { themesForImages } from "@/lib/imageTheme";

const page = getPage("productionPage");
const ITEMS = page.spots.map(({ layout, ...spot }) => ({ layout, spot }));

export const metadata: Metadata = pageMetadata(page.seo, "/production", { url: "/images/story/samsung-nina-chuba.jpg", alt: "Nina Chuba in the Samsung spot" });

/*
  Layout: the Work spots (Figma 264:1110) in the case list’s layout, with the copy of the "Website v2"
  board (node 85:2285) word for word and in board order. Three full-width
  spots break up rows of still (2/3) + text box (1/3) that alternate sides.
  Built from the site's parts (Blocks.tsx, WorkSpot.tsx); stills act as
  posters until the team sends the films: set `videoUrl` to make one play.

  Left out: Nivea / Serenia, whose copy on the board is still lorem ipsum.
*/

const QUESTION = page.intro.question;

export default async function ProductionPage() {
  const themes = await themesForImages(ITEMS.map((item) => item.spot.image));

  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="work-hero"
        heading={heroHeading(page.hero)}
        lineAiDraft={page.hero.placeholder}
        line={page.hero.line}
        background="#7a3bff"
        lineColor="#02b7fd"
      />
      <Header variant="start-top" />

      {/* The case list's spacing on black, with Elliot's arrangement: the
          cards swap sides from row to row, full-width spots in between. */}
      <section className="bk-section is-dark">
        {/* The Strategy service heading: question and answer as one two-tone heading. */}
        <div className={`lp-wrap bk-service-top is-long${page.intro.placeholder ? " ai-draft" : ""}`}>
          <RevealText as="h2" className="lp-heading" text={QUESTION} />
          <RevealText as="p" className="bk-service-line is-red" text={page.intro.answer} after={QUESTION} />
        </div>
        <ul role="list" className="lp-wrap bk-mosaic is-spaced is-chip-top">
          {ITEMS.map((item, i) => (
            <li key={item.spot.client}>
              <WorkSpot
                spot={item.spot}
                theme={themes[i]}
                variant={item.layout === "wide" ? "wide" : "row"}
                flipped={item.layout === "row-flipped"}
                formId={`work-${i}`}
                pattern={i}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="bk-section">
        <Lead
          boxed
          heading={page.lead.heading}
          text={page.lead.text}
        >
          <CtaLink href={page.lead.link.href} label={page.lead.link.label} />
        </Lead>
      </section>

      <ContactBlock person={page.contacts} />
      <LandingFooter band={{ background: "#7a3bff", line: "#02b7fd" }} />
    </div>
  );
}
