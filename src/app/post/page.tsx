import type { Metadata } from "next";
import { getPage, heroHeading, pageMetadata } from "@/lib/pages";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import { ContactBlock, CtaLink, Lead, PageHero } from "@/components/Blocks";
import RevealText from "@/components/RevealText";
import WorkSpot from "@/components/WorkSpot";
import { themesForImages } from "@/lib/imageTheme";

const page = getPage("postPage");
const ITEMS = page.spots.map(({ layout, ...spot }) => ({ layout, spot }));

export const metadata: Metadata = pageMetadata(page.seo, "/post", { url: "/images/story/crazy-wolf.jpg", alt: "The Crazy Wolf energy drink spot" });

/*
  Post (call with Michael and Timo, 30 Oct 2026): laid out like Production,
  a film with a short text per piece; they don't need to be full cases. Audio
  and video post share one page until there is enough video to split them.
  Michael (audio) and Elliot (video post) are the contacts.
*/


// Call and response, as on Production. AI-written placeholder copy (Oct 2026): replace before launch.
const QUESTION = page.intro.question;
const ANSWER = page.intro.answer;

export default async function PostPage() {
  // Each spot gets its own styleguide pair, matched to its photo, as on Production (Elliot, 11 Nov 2026).
  const themes = await themesForImages(ITEMS.map((item) => item.spot.image));

  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="post-hero"
        heading={heroHeading(page.hero)}
        lineAiDraft={page.hero.placeholder}
        line={page.hero.line}
        background="#dfe5ac"
        lineColor="#6183ff"
        dark
      />
      <Header variant="start-top" />

      <section className="bk-section is-dark">
        {/* The question, then blut's answer in grey, as one two-tone heading. */}
        <div className={`lp-wrap bk-service-top is-long${page.intro.placeholder ? " ai-draft" : ""}`}>
          <RevealText as="h2" className="lp-heading" text={QUESTION} />
          <RevealText as="p" className="bk-service-line is-blue" text={ANSWER} after={QUESTION} />
        </div>
        <ul role="list" className="lp-wrap bk-mosaic is-spaced">
          {ITEMS.map((item, i) => (
            <li key={item.spot.client}>
              <WorkSpot
                spot={item.spot}
                theme={themes[i]}
                variant={item.layout === "wide" ? "wide" : "row"}
                flipped={item.layout === "row-flipped"}
                formId={`post-${i}`}
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

      <ContactBlock person={["michael", "elliot"]} />
      <LandingFooter band={{ background: "#dfe5ac", line: "#6183ff", light: true }} />
    </div>
  );
}
