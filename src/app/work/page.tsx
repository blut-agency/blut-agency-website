import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import GridFooter from "@/components/GridFooter";
import LogoBand from "@/components/LogoBand";
import GradientBanner from "@/components/GradientBanner";
import VideoPanel from "@/components/VideoPanel";
import RevealText from "@/components/RevealText";
import "./work.css";

export const metadata: Metadata = {
  title: "Work – A 360° Approach to Sonic Storytelling | blut",
  description:
    "What do Nina Chuba, the Backstreet Boys and a secret lab in the Alps have in common? Let’s find out (it’s blut, of course).",
};

/**
 * Stills act as posters until the team sends Vimeo links; set `vimeoId` on a
 * spot to make it play in the lightbox. `hidden` keeps a spot in the data but
 * off the page (Nivea / Serenia: its copy is still placeholder).
 */
type Spot = { client: string; text: string; image: string; vimeoId?: string; hidden?: boolean };

// Current order of the Work page. The first and last spots are the wide rows;
// everything in between alternates media left / right.
const SPOTS: Spot[] = [
  {
    client: "Samsung / Nina Chuba",
    image: "/images/story/samsung-nina-chuba.jpg",
    text: "Some projects call for all-round production, like when we worked with Nina Chuba on this Samsung spot. We took her voice recordings from the film set and created a fitting soundtrack for the visuals, some subtle SFX to support the movement of the spot and an overall natural yet hi-end mix to round out the project.",
  },
  {
    client: "Nivea / Serenia",
    image: "/images/story/nivea-serenia.jpg",
    text: "Copy for this spot is still to come – the board only has placeholder text here.",
    hidden: true,
  },
  {
    client: "Schwarzkopf",
    image: "/images/story/schwarzkopf.jpg",
    text: "But the talent doesn’t always have to be musical. For the relaunch of the Schwarzkopf brand, we composed a brand song with changing arrangements to suit a variety of celebrities and influencers including Diane Kruger, Collien Fernandes, Sofia Vergara, Ana Ivanović and Alli Neumann to name a few (oh wait, Alli actually is a musician, but you get the drift). Here’s the hero version.",
  },
  {
    client: "Volkswagen",
    image: "/images/story/volkswagen.jpg",
    text: "Sometimes the artist is in the spotlight, but for this VW campaign, the talent was hiding in the background. For the launch of the VW e-up! we created this fresh beat and had UK Grime legend Che Lingo work his magic on it. “They never thought we were good enough, now we’re pullin’ up…”",
  },
  {
    client: "Gore-Tex",
    image: "/images/story/gore-tex.jpg",
    text: "A song doesn’t always have to be the main focus though. For this Gore-Tex campaign we went into their secret testing facility in the Bavarian Alps and recorded all of their weird and wonderful all-weather testing machines, turning them into this epic adventure in sound design.",
  },
  {
    client: "Crazy Wolf",
    image: "/images/story/crazy-wolf.jpg",
    text: "Sound design can be adventurous, sound design can be subtle and sound design can also be insane, like when you’re hyped up on too many energy drinks.",
  },
  {
    client: "McDonald’s",
    image: "/images/story/mcdonalds.jpg",
    text: "We didn’t write this song (obviously), but instead remade this Backstreet Boys classic with a group of “singers” who should maybe stick to acting. But that was part of the fun, as was creating the overall sound design and mix of the spot.",
  },
  {
    client: "Targobank",
    image: "/images/story/targobank.jpg",
    text: "Earlier we remade the Backstreet Boys, now we’re remaking Michael Sembello’s 80s classic, Maniac. From licensing, to recreating those legendary 80s synth sounds to casting a singer who can hit the (very) high notes like it’s the most normal thing in the world, we had it “covered” from start to finish.",
  },
  {
    client: "Dr. Oetker",
    image: "/images/story/dr-oetker.jpg",
    text: "Phew… need to calm down a little after that one. How about a lovely little heart-warming, nostalgic, acoustic ballad to bring down the pulse and remind us of the sweeter moments in life?",
  },
  {
    client: "Haribo",
    image: "/images/story/haribo.jpg",
    text: "Here’s another remake of a classic song that literally everyone knows. It’s Happy Birthday… but not as simple as it sounds. We got to work with the iconic Haribo Voice Kids concept, but turn it into music for the first time. We experimented with punk, metal, pop and stadium rock and recorded several hours of kids’ voices before landing on this final version.",
  },
  {
    client: "Adidas Originals",
    image: "/images/story/adidas-originals.jpg",
    text: "We do like to get more artistic too from time to time, like in this cinematic Adidas Superstar spot featuring rapper Jugo Ürdens and shot on 16mm. The music sounds like a film score from yesteryear and we felt nostalgic recording brass, woodwinds and grand piano for it, before creating the sound design and final mix.",
  },
  {
    client: "Hardmade",
    image: "/images/story/hardmade.jpg",
    text: "To sum it all up… we love all things music and all things audio. Here’s one last spot with lots of different styles and sounds in it, because you can combine metal with salsa and trap if you want to.",
  },
];

/** Light spacer row (Figma "Section Divider", no middle line): 64px, or 128px when tall. */
function Spacer({ tall = false }: { tall?: boolean }) {
  return (
    <div className={`gl-spacer wk-spacer${tall ? " is-tall" : ""}`} aria-hidden="true">
      <div className="gl-col" />
    </div>
  );
}

/**
 * Wide spot (Figma "Feature Row", full): black row with a split spacer, the
 * 16:9 still across the 1280 column, then client name | copy below it.
 */
function WideSpot({ spot }: { spot: Spot }) {
  return (
    <section className="wk-wide">
      <div className="wk-wide-spacer" aria-hidden="true">
        <div className="gl-col" />
      </div>
      <div className="wk-wide-media-row">
        <div className="gl-col wk-wide-media">
          <VideoPanel title={spot.client} image={spot.image} vimeoId={spot.vimeoId} />
        </div>
      </div>
      <div className="gl-col gl-split wk-wide-copy">
        <div className="gl-cell">
          <RevealText as="h2" className="heading-style-h1" text={spot.client} />
        </div>
        <div className="gl-cell">
          <p className="wk-wide-text">{spot.text}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * Spot row (Figma "Feature Row", thirds): the still takes a third (same play
 * behaviour as before: hover label, lightbox), client and copy take two.
 */
function SpotRow({ spot, flipped }: { spot: Spot; flipped: boolean }) {
  return (
    <section className={`gl-row wk-spot${flipped ? " is-flipped" : ""}`}>
      <div className="gl-col wk-spot-grid">
        <div className="wk-spot-media">
          <VideoPanel title={spot.client} image={spot.image} vimeoId={spot.vimeoId} />
        </div>
        <div className="wk-spot-copy">
          <h2 className="wk-spot-title">{spot.client}</h2>
          <p className="wk-spot-text">{spot.text}</p>
        </div>
      </div>
    </section>
  );
}

/*
  Work page in the grid-landing layout (Figma "Work", 45:1406): banner, nav,
  wide opener, sky band, alternating third rows, purple band, wide closer,
  statement banner, footer. Styles: ./work.css, everything scoped to .wk-page.
*/
export default function WorkPage() {
  const shown = SPOTS.filter((s) => !s.hidden);
  const opener = shown[0];
  const closer = shown[shown.length - 1];
  const rows = shown.slice(1, -1);

  return (
    <div className="main-wrapper gl-page wk-page">
      <div className="gl-banner wk-banner">
        <GradientBanner form="work-hero" background="#ff6004" line="#e2e2e2">
          <RevealText as="h1" className="heading-style-h1" text="A 360° Approach to Sonic Storytelling" />
          <p className="copy-medium">
            What do Nina Chuba, The Backstreet Boys and a secret lab in the Alps have in common? Let’s find out. It’s
            blut, of course.
          </p>
        </GradientBanner>
      </div>
      <Header variant="start-top" />

      <WideSpot spot={opener} />
      <LogoBand theme="sky" />
      <Spacer tall />

      {rows.map((spot, i) => (
        <div key={spot.client}>
          {i > 0 && <Spacer />}
          {/* As drawn: media left first, then right, and so on. */}
          <SpotRow spot={spot} flipped={i % 2 === 1} />
        </div>
      ))}

      <Spacer tall />
      <LogoBand theme="purple" reverse />
      <WideSpot spot={closer} />

      {/* Figma's Statement Banner, carrying the existing closing-row copy. */}
      <div className="gl-banner wk-statement">
        <GradientBanner
          form="work-statement"
          background="var(--_color---accent-color-3)"
          line="var(--_color---accent-color-1)"
        >
          <RevealText as="h2" className="heading-style-h1" text="It’s not just music, it’s everything around it." />
          <p className="copy-medium">We specialize in assessing brands and creating bespoke sonic strategies.</p>
          <div className="cta-link-component gl-cta">
            <Link aria-label="Get to know our process" href="/strategy" className="cta-link w-inline-block">
              <div className="cta-link-line" />
              <div className="cta-link-text">Get to know our process</div>
            </Link>
          </div>
        </GradientBanner>
      </div>

      <GridFooter />
    </div>
  );
}
