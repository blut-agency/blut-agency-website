import type { Metadata } from "next";
import { share } from "@/lib/share";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import { ContactBlock, CtaLink, Lead, PageHero } from "@/components/Blocks";
import RevealText from "@/components/RevealText";
import WorkSpot from "@/components/WorkSpot";
import { POST_ITEMS as ITEMS } from "@/content/offers";
import { themesForImages } from "@/lib/imageTheme";

export const metadata: Metadata = {
  title: "Post-Production – Sound Design, Mixing and Video Post | blut",
  description: "Sound design, mixing and video post from blut, the music-led creative agency from Hamburg, Berlin and Munich.",
  ...share({
    title: "Post-Production",
    description: "Sound design, mixing and video post from blut, the music-led creative agency from Hamburg, Berlin and Munich.",
    path: "/post",
    image: { url: "/images/story/crazy-wolf.jpg", alt: "The Crazy Wolf energy drink spot" },
  }),
};

/*
  Post (call with Michael and Timo, 30 Oct 2026): laid out like Production,
  a film with a short text per piece; they don't need to be full cases. Audio
  and video post share one page until there is enough video to split them.
  Elliot (video post) is the contact; add the audio post lead once confirmed.
*/

// Call and response, as on Production. AI-written placeholder copy (Oct 2026): replace before launch.
const QUESTION = "What’s the difference between a good spot and one you can’t forget?";
const ANSWER = "The last ten percent. That’s ours.";

export default async function PostPage() {
  const themes = await themesForImages(ITEMS.map((item) => item.spot.image));

  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="post-hero"
        heading="Post-Production"
        // AI-written placeholder line (Oct 2026): replace, then drop lineAiDraft
        lineAiDraft
        line="Sound design, mixing and video post: the finishing touches that make a spot feel complete."
        background="var(--_color---accent-color-2)"
        lineColor="var(--_color---accent-color-1)"
        dark
      />
      <Header variant="start-top" />

      <section className="bk-section is-dark">
        {/* The question, then blut's answer in grey, as one two-tone heading. */}
        <div className="lp-wrap bk-service-top is-long ai-draft">
          <RevealText as="h2" className="lp-heading" text={QUESTION} />
          <RevealText as="p" className="bk-service-line" text={ANSWER} after={QUESTION} />
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
          heading="It’s not just music, it’s everything around it."
          text="Our music production and data-driven sonic strategies work hand-in-hand to create memorable campaigns that genuinely connect with audiences."
        >
          <CtaLink href="/case-studies" label="View our case studies" />
        </Lead>
      </section>

      <ContactBlock person="elliot" />
      <LandingFooter band={{ background: "var(--_color---accent-color-2)", line: "var(--_color---accent-color-1)" }} />
    </div>
  );
}
