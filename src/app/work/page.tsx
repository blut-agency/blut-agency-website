import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import GridFooter from "@/components/GridFooter";
import LogoBand from "@/components/LogoBand";
import GradientBanner from "@/components/GradientBanner";
import RevealText from "@/components/RevealText";
import StoryCard, { type Spot } from "./StoryCard";
import "./work.css";

export const metadata: Metadata = {
  title: "Work – Music production and sound design | blut",
  description:
    "What do Nina Chuba, the Backstreet Boys and a secret lab in the Alps have in common? Let’s find out (it’s blut, of course).",
};

// TODO: contact address for "Get in touch" is still TBD (Nic). Same value as Home's CONTACT_MAILTO.
const CONTACT_MAILTO = "mailto:contact@blut.agency";

type Chapter = {
  id: string;
  headline: string;
  intro: string;
  /** Headline row background, alternating as in the Figma. */
  dark: boolean;
  /** One wide card (Samsung, Hardmade) instead of a 2-up row. */
  wide?: boolean;
  spots: Spot[];
};

/*
  The story, top to bottom (Figma "Work (story)", 157:276). Spot texts are the
  original Work page copy, verbatim. No spot has a video source yet: set
  `vimeoId` (or `videoUrl`) and it plays in the lightbox; until then the
  poster opens "Video coming soon".
*/
const CHAPTERS: Chapter[] = [
  {
    id: "samsung",
    headline: "Some projects call for all-round production.",
    // DRAFT intro — confirm with Nic
    intro: "Like when we worked with Nina Chuba on this Samsung spot.",
    dark: true,
    wide: true,
    spots: [
      {
        client: "Samsung / Nina Chuba",
        image: "/images/story/samsung-nina-chuba.jpg",
        vimeoId: "", // TODO: video
        text: "Some projects call for all-round production, like when we worked with Nina Chuba on this Samsung spot. We took her voice recordings from the film set and created a fitting soundtrack for the visuals, some subtle SFX to support the movement of the spot and an overall natural yet hi-end mix to round out the project.",
      },
    ],
  },
  {
    id: "artists",
    headline: "Sometimes the artist is in the spotlight.",
    // DRAFT intro — confirm with Nic
    intro: "Sometimes the talent is in the spotlight, sometimes it’s hiding in the background.",
    dark: false,
    spots: [
      {
        client: "Nivea / Serenia",
        image: "/images/story/nivea-serenia.jpg",
        text: "", // TODO: needs copy
        hidden: true, // joins this chapter when its copy exists
      },
      {
        client: "Schwarzkopf",
        image: "/images/story/schwarzkopf.jpg",
        vimeoId: "", // TODO: video
        text: "But the talent doesn’t always have to be musical. For the relaunch of the Schwarzkopf brand, we composed a brand song with changing arrangements to suit a variety of celebrities and influencers including Diane Kruger, Collien Fernandes, Sofia Vergara, Ana Ivanović and Alli Neumann to name a few (oh wait, Alli actually is a musician, but you get the drift). Here’s the hero version.",
      },
      {
        client: "Volkswagen",
        image: "/images/story/volkswagen.jpg",
        vimeoId: "", // TODO: video
        text: "Sometimes the artist is in the spotlight, but for this VW campaign, the talent was hiding in the background. For the launch of the VW e-up! we created this fresh beat and had UK Grime legend Che Lingo work his magic on it. “They never thought we were good enough, now we’re pullin’ up…”",
      },
    ],
  },
  {
    id: "sound-design",
    headline: "Sound design can be adventurous, subtle… or insane.",
    // DRAFT intro — confirm with Nic
    intro: "A song doesn’t always have to be the main focus.",
    dark: true,
    spots: [
      {
        client: "Gore-Tex",
        image: "/images/story/gore-tex.jpg",
        vimeoId: "", // TODO: video
        text: "A song doesn’t always have to be the main focus though. For this Gore-Tex campaign we went into their secret testing facility in the Bavarian Alps and recorded all of their weird and wonderful all-weather testing machines, turning them into this epic adventure in sound design.",
      },
      {
        client: "Crazy Wolf",
        image: "/images/story/crazy-wolf.jpg",
        vimeoId: "", // TODO: video
        text: "Sound design can be adventurous, sound design can be subtle and sound design can also be insane, like when you’re hyped up on too many energy drinks.",
      },
    ],
  },
  {
    id: "covers",
    headline: "We didn’t write this song (obviously).",
    // DRAFT intro — confirm with Nic
    intro: "From licensing to casting, we had it covered from start to finish.",
    dark: false,
    spots: [
      {
        client: "McDonald’s",
        image: "/images/story/mcdonalds.jpg",
        vimeoId: "", // TODO: video
        text: "We didn’t write this song (obviously), but instead remade this Backstreet Boys classic with a group of “singers” who should maybe stick to acting. But that was part of the fun, as was creating the overall sound design and mix of the spot.",
      },
      {
        client: "Targobank",
        image: "/images/story/targobank.jpg",
        vimeoId: "", // TODO: video
        text: "Earlier we remade the Backstreet Boys, now we’re remaking Michael Sembello’s 80s classic, Maniac. From licensing, to recreating those legendary 80s synth sounds to casting a singer who can hit the (very) high notes like it’s the most normal thing in the world, we had it “covered” from start to finish.",
      },
      {
        client: "Haribo",
        image: "/images/story/haribo.jpg",
        text: "Here’s another remake of a classic song that literally everyone knows. It’s Happy Birthday… but not as simple as it sounds. We got to work with the iconic Haribo Voice Kids concept, but turn it into music for the first time. We experimented with punk, metal, pop and stadium rock and recorded several hours of kids’ voices before landing on this final version.",
        hidden: true, // dropped (Nic)
      },
    ],
  },
  {
    id: "score",
    headline: "We do like to get more artistic too.",
    // DRAFT intro — confirm with Nic
    intro: "Something heart-warming, nostalgic, or straight out of a film score.",
    dark: true,
    spots: [
      {
        client: "Dr. Oetker",
        image: "/images/story/dr-oetker.jpg",
        vimeoId: "", // TODO: video
        text: "Phew… need to calm down a little after that one. How about a lovely little heart-warming, nostalgic, acoustic ballad to bring down the pulse and remind us of the sweeter moments in life?",
      },
      {
        client: "Adidas Originals",
        image: "/images/story/adidas-originals.jpg",
        vimeoId: "", // TODO: video
        text: "We do like to get more artistic too from time to time, like in this cinematic Adidas Superstar spot featuring rapper Jugo Ürdens and shot on 16mm. The music sounds like a film score from yesteryear and we felt nostalgic recording brass, woodwinds and grand piano for it, before creating the sound design and final mix.",
      },
    ],
  },
  {
    id: "hardmade",
    headline: "You can combine metal with salsa and trap if you want to.",
    // DRAFT intro — confirm with Nic
    intro: "To sum it all up… we love all things music and all things audio.",
    dark: false,
    wide: true,
    spots: [
      {
        client: "Hardmade",
        image: "/images/story/hardmade.jpg",
        vimeoId: "", // TODO: video
        text: "To sum it all up… we love all things music and all things audio. Here’s one last spot with lots of different styles and sounds in it, because you can combine metal with salsa and trap if you want to.",
      },
    ],
  },
];

function Spacer() {
  return (
    <div className="gl-spacer ws-spacer" aria-hidden="true">
      <div className="gl-col" />
    </div>
  );
}

function CtaLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="cta-link-component gl-cta">
      <Link aria-label={label} href={href} className="cta-link w-inline-block">
        <div className="cta-link-line" />
        <div className="cta-link-text">{label}</div>
      </Link>
    </div>
  );
}

/** Headline | intro (50/50), then the chapter's video cards (2-up, or one wide). */
function ChapterSection({ c }: { c: Chapter }) {
  const spots = c.spots.filter((s) => !s.hidden);
  return (
    <section id={c.id} className="ws-chapter">
      <div className={`gl-row ws-head${c.dark ? " is-dark" : ""}`}>
        <div className="gl-col gl-split">
          <div className="ws-head-cell">
            <RevealText as="h2" className="ws-headline" text={c.headline} />
          </div>
          <div className="ws-head-cell">
            <p className="ws-intro">{c.intro}</p>
          </div>
        </div>
      </div>
      <div className="gl-row ws-videos">
        <div className={`gl-col ws-cards${c.wide ? " is-wide" : ""}`}>
          {spots.map((s) => (
            <StoryCard key={s.client} spot={s} wide={c.wide} />
          ))}
        </div>
      </div>
    </section>
  );
}

/*
  Work page as a story in chapters (Figma "Work (story)", 157:276): banner,
  nav, lime band, the Samsung / Nina Chuba feature, chapters 1–4, the Hardmade
  closer, close row, sky band, footer. Styles: ./work.css, scoped to .ws-page.
*/
export default function WorkPage() {
  return (
    <div className="main-wrapper gl-page ws-page">
      <div className="gl-banner ws-banner">
        <GradientBanner form="work-hero" background="#ff6004" line="#e2e2e2">
          <RevealText as="h1" className="heading-style-h1" text="Music production and sound design." />
          <p className="copy-medium">
            What do Nina Chuba, The Backstreet Boys and a secret lab in the Alps have in common? Let’s find out. It’s
            blut, of course.
          </p>
        </GradientBanner>
      </div>
      <Header variant="start-top" />
      <LogoBand theme="lime" />

      {CHAPTERS.map((c) => (
        <div key={c.id}>
          <Spacer />
          <ChapterSection c={c} />
        </div>
      ))}

      <Spacer />
      <section className="gl-row ws-close">
        <div className="gl-col gl-split">
          <div className="gl-cell">
            <RevealText as="h2" className="heading-style-h1" text="It’s not just music, it’s everything around it." />
          </div>
          <div className="gl-cell gl-copy">
            <div className="rich-text-custom w-richtext">
              <p>We specialize in assessing brands and creating bespoke sonic strategies</p>
            </div>
            <div className="ws-close-links">
              <CtaLink href="/strategy" label="Get to know our process" />
              <CtaLink href={CONTACT_MAILTO} label="Get in touch" />
            </div>
          </div>
        </div>
      </section>
      <Spacer />

      <LogoBand theme="sky" reverse />
      <GridFooter />
    </div>
  );
}
