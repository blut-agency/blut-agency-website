import type { Metadata } from "next";
import { share } from "@/lib/share";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import { ContactBlock, CtaLink, Lead, PageHero } from "@/components/Blocks";
import RevealText from "@/components/RevealText";
import WorkSpot from "@/components/WorkSpot";
import { WORK_ITEMS as ITEMS } from "@/content/work";
import { themesForImages } from "@/lib/imageTheme";

export const metadata: Metadata = {
  title: "Production – A 360° Approach to Sonic Storytelling | blut",
  description:
    "What do Nina Chuba, the Backstreet Boys and a secret lab in the Alps have in common? Let’s find out. It’s blut, of course.",
  ...share({
    title: "Production – A 360° Approach to Sonic Storytelling",
    description: "What do Nina Chuba, the Backstreet Boys and a secret lab in the Alps have in common? Let’s find out. It’s blut, of course.",
    path: "/production",
    image: { url: "/images/story/samsung-nina-chuba.jpg", alt: "Nina Chuba in the Samsung spot" },
  }),
};

/*
  Layout: the Work spots (Figma 264:1110) in the case list’s layout, with the copy of the "Website v2"
  board (node 85:2285) word for word and in board order. Three full-width
  spots break up rows of still (2/3) + text box (1/3) that alternate sides.
  Built from the site's parts (Blocks.tsx, WorkSpot.tsx); stills act as
  posters until the team sends Vimeo links: set `vimeoId` to make one play.

  Left out: Nivea / Serenia, whose copy on the board is still lorem ipsum.
*/

const QUESTION = "What do Nina Chuba, The Backstreet Boys and a secret lab in the Alps have in common? Let’s find out.";

export default async function ProductionPage() {
  const themes = await themesForImages(ITEMS.map((item) => item.spot.image));

  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="work-hero"
        heading="A 360° Approach to Sonic Storytelling"
        // AI-written placeholder line (Oct 2026): replace, then drop lineAiDraft
        lineAiDraft
        line="Music production, sound design and everything around it, from the first idea to the final mix."
      />
      <Header variant="start-top" />

      {/* The case list's spacing on black, with Elliot's arrangement: the
          cards swap sides from row to row, full-width spots in between. */}
      <section className="bk-section is-dark">
        {/* The Strategy service heading: question and answer as one two-tone heading. */}
        <div className="lp-wrap bk-service-top is-long">
          <RevealText as="h2" className="lp-heading" text={QUESTION} />
          <RevealText as="p" className="bk-service-line" text="It’s blut, of course." after={QUESTION} />
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
          heading="It’s not just music, it’s everything around it."
          text="We specialize in assessing brands and creating bespoke sonic strategies"
        >
          <CtaLink href="/strategy" label="Get to know our process" />
        </Lead>
      </section>

      <ContactBlock person="michael" />
      <LandingFooter band={{ background: "var(--_color---accent-color-3)", line: "var(--_color---accent-color-1)" }} />
    </div>
  );
}
