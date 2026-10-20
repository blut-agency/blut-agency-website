import type { Metadata } from "next";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import { ContactBlock, CtaLink, Lead, PageHero } from "@/components/Blocks";
import WorkSpot, { type WorkSpotData } from "@/components/WorkSpot";
import { themesForImages } from "@/lib/imageTheme";

export const metadata: Metadata = {
  title: "Work – A 360° Approach to Sonic Storytelling | blut",
  description:
    "What do Nina Chuba, the Backstreet Boys and a secret lab in the Alps have in common? Let’s find out. It’s blut, of course.",
};

/*
  Layout: Figma "Work v02" (node 223:2364). Copy: the WORK column of the
  "Website v2" board (node 85:2285), in board order. The first and last spots
  run full width; every other spot sits in a half-and-half pair under a
  headline that ties the two together. Spot copy is the board's, word for
  word; pair headlines, card titles and tags are drawn from it.

  Built from the landing page's parts (landing.css: .lp-heading, .lp-copy,
  .lp-panel, .lp-case-tags, logo band, footer); page-only styles in
  ./work.css. Stills act as posters until the team sends Vimeo links: set
  `vimeoId` on a spot to make it play.

  Left out: Nivea / Serenia, whose copy on the board is still lorem ipsum.
*/

const SAMSUNG: WorkSpotData = {
  client: "Samsung",
  image: "/images/story/samsung-nina-chuba.jpg",
  text: "Taking her voice recordings from the film set, we created a fitting soundtrack for the visuals, some subtle SFX to support the movement of the spot and an overall natural yet hi-end mix to round out the project.",
};

const HARDMADE: WorkSpotData = {
  client: "Hardmade",
  image: "/images/story/hardmade.jpg",
  text: "Here’s one last spot with lots of different styles and sounds in it.",
};

type Pair = {
  id: string;
  heading: string;
  line: string;
  spots: [WorkSpotData, WorkSpotData];
};

const PAIRS: Pair[] = [
  {
    id: "talent",
    heading: "Sometimes the artist is in the spotlight.",
    line: "Sometimes the talent is in the spotlight, sometimes it’s hiding in the background.",
    spots: [
      {
        client: "Schwarzkopf",
        title: "Brand relaunch",
        tags: ["Brand Song", "Music Production"],
        image: "/images/story/schwarzkopf.jpg",
        text: "But the talent doesn’t always have to be musical. For the relaunch of the Schwarzkopf brand, we composed a brand song with changing arrangements to suit a variety of celebrities and influencers including Diane Kruger, Collien Fernandes, Sofia Vergara, Ana Ivanović and Alli Neumann to name a few (oh wait, Alli actually is a musician, but you get the drift). Here’s the hero version.",
      },
      {
        client: "Volkswagen",
        title: "VW e-up!",
        tags: ["Music Production", "Artist Partnership"],
        image: "/images/story/volkswagen.jpg",
        text: "Sometimes the artist is in the spotlight, but for this VW campaign, the talent was hiding in the background. For the launch of the VW e-up! we created this fresh beat and had UK Grime legend Che Lingo work his magic on it. “They never thought we were good enough, now we’re pullin’ up…”",
      },
    ],
  },
  {
    id: "sound-design",
    heading: "A song doesn’t always have to be the main focus.",
    line: "Sound design can be adventurous, it can be subtle, and it can also be insane.",
    spots: [
      {
        client: "Gore-Tex",
        title: "A secret lab in the Alps",
        tags: ["Sound Design", "Field Recording"],
        image: "/images/story/gore-tex.jpg",
        text: "A song doesn’t always have to be the main focus though. For this Gore-Tex campaign we went into their secret testing facility in the Bavarian Alps and recorded all of their weird and wonderful all-weather testing machines, turning them into this epic adventure in sound design.",
      },
      {
        client: "Crazy Wolf",
        title: "Energy drink overload",
        tags: ["Sound Design"],
        image: "/images/story/crazy-wolf.jpg",
        text: "Sound design can be adventurous, sound design can be subtle and sound design can also be insane, like when you’re hyped up on too many energy drinks.",
      },
    ],
  },
  {
    id: "covers",
    heading: "We didn’t write this song (obviously).",
    line: "From licensing to casting, we had it covered from start to finish.",
    spots: [
      {
        client: "McDonald’s",
        title: "Backstreet Boys remake",
        tags: ["Music Production", "Sound Design"],
        image: "/images/story/mcdonalds.jpg",
        text: "We didn’t write this song (obviously), but instead remade this Backstreet Boys classic with a group of “singers” who should maybe stick to acting. But that was part of the fun, as was creating the overall sound design and mix of the spot.",
      },
      {
        client: "Targobank",
        title: "Maniac",
        tags: ["Licensing", "Casting"],
        image: "/images/story/targobank.jpg",
        text: "Earlier we remade the Backstreet Boys, now we’re remaking Michael Sembello’s 80s classic, Maniac. From licensing, to recreating those legendary 80s synth sounds to casting a singer who can hit the (very) high notes like it’s the most normal thing in the world, we had it “covered” from start to finish.",
      },
    ],
  },
  {
    id: "calm",
    heading: "Phew… time to calm down a little.",
    line: "From a heart-warming acoustic ballad to a film score from yesteryear.",
    spots: [
      {
        client: "Dr. Oetker",
        title: "Acoustic ballad",
        tags: ["Music Production"],
        image: "/images/story/dr-oetker.jpg",
        text: "Phew… need to calm down a little after that one. How about a lovely little heart-warming, nostalgic, acoustic ballad to bring down the pulse and remind us of the sweeter moments in life?",
      },
      {
        client: "Adidas",
        title: "Superstar on 16mm",
        tags: ["Music Production", "Sound Design"],
        image: "/images/story/adidas-originals.jpg",
        text: "We do like to get more artistic too from time to time, like in this cinematic Adidas Superstar spot featuring rapper Jugo Ürdens and shot on 16mm. The music sounds like a film score from yesteryear and we felt nostalgic recording brass, woodwinds and grand piano for it, before creating the sound design and final mix.",
      },
    ],
  },
];

export default async function WorkPage() {
  const spots = [SAMSUNG, ...PAIRS.flatMap((p) => p.spots), HARDMADE];
  const themes = await themesForImages(spots.map((s) => s.image));
  const themeOf = (spot: WorkSpotData) => themes[spots.indexOf(spot)];

  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="work-hero"
        heading="A 360 degree Approach to Sonic Storytelling"
        line="What do Nina Chuba, The Backstreet Boys and a secret lab in the Alps have in common? Let’s find out. It’s blut, of course."
      />
      <Header variant="start-top" />

      <section className="bk-section is-dark">
        <Lead
          flipped
          heading="Some projects call for all-round production..."
          text="Like when we worked with Nina Chuba on this Samsung spot."
        />
        <div className="lp-wrap">
          <WorkSpot spot={SAMSUNG} theme={themeOf(SAMSUNG)} variant="wide" formId="work-samsung" />
        </div>
      </section>

      {PAIRS.map((pair, p) => {
        // Sections alternate white and black after the black Samsung section;
        // on the black ones the headline flips to the right and the card
        // stagger mirrors.
        const flipped = p % 2 === 1;
        return (
          <section className={`bk-section${flipped ? " is-dark" : ""}`} key={pair.id}>
            <Lead boxed flipped={flipped} heading={pair.heading} text={pair.line} />
            <ul role="list" className={`lp-wrap bk-cards${flipped ? " is-flipped" : ""}`}>
              {pair.spots.map((spot, i) => (
                <li key={spot.client} data-parallax={(i === 0) !== flipped ? 0.4 : 1}>
                  <WorkSpot spot={spot} theme={themeOf(spot)} variant="card" formId={`work-${pair.id}-${i}`} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section className="bk-section is-dark">
        <Lead
          flipped
          heading="You can combine metal with salsa and trap if you want to."
          text="To sum it all up… we love all things music and all things audio."
        />
        <div className="lp-wrap">
          <WorkSpot spot={HARDMADE} theme={themeOf(HARDMADE)} variant="wide" formId="work-hardmade" />
        </div>
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

      <ContactBlock person="karl" />

      <LandingFooter band={{ background: "var(--_color---accent-color-3)", line: "var(--_color---accent-color-1)" }} />
    </div>
  );
}
