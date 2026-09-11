import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GradientBanner from "@/components/GradientBanner";
import MediaFrame from "@/components/MediaFrame";
import PageTeaser from "@/components/PageTeaser";
import RevealText from "@/components/RevealText";

export const metadata: Metadata = {
  title: "Story – A 360° Approach to Sonic Storytelling | blut",
  description:
    "What do Nina Chuba, the Backstreet Boys and a secret lab in the Alps have in common? Let’s find out (it’s blut, of course).",
};

/**
 * Page structure and copy follow the "Story Page" section of the Figma board
 * (🛝 The Playground → Site). Stills come from the board and act as posters
 * until the team sends Vimeo links; set `vimeoId` on a spot to make it play.
 */
type Spot = { client: string; text: string; image: string; vimeoId?: string };

const OPENER: Spot = {
  client: "Samsung / Nina Chuba",
  image: "/images/story/samsung-nina-chuba.jpg",
  text: "Some projects call for all-round production, like when we worked with Nina Chuba on this Samsung spot. We took her voice recordings from the film set and created a fitting soundtrack for the visuals, some subtle SFX to support the movement of the spot and an overall natural yet hi-end mix to round out the project.",
};

// Open question from Timo on the board ("makes us look like bad musicians").
// Kept in for now; remove this entry if the team decides against it.
const ROWS_BEFORE_INTERLUDE: Spot[] = [
  {
    client: "McDonald’s",
    image: "/images/story/mcdonalds.jpg",
    text: "We didn’t write this song (obviously), but instead remade this Backstreet Boys classic with a group of “singers” who should maybe stick to acting. But that was part of the fun, as was creating the overall sound design and mix of the spot.",
  },
  {
    client: "Volkswagen",
    image: "/images/story/volkswagen.jpg",
    text: "Sometimes the artist is in the spotlight, but for this VW campaign, the talent was hiding in the background. For the launch of the VW e-up! we created this fresh beat and had UK Grime legend Che Lingo work his magic on it. “They never thought we were good enough, now we’re pullin’ up…”",
  },
  {
    client: "Schwarzkopf",
    image: "/images/story/schwarzkopf.jpg",
    text: "But the talent doesn’t always have to be musical. For the relaunch of the Schwarzkopf brand, we composed a brand song with changing arrangements to suit a variety of celebrities and influencers including Diane Kruger, Collien Fernandes, Sofia Vergara, Ana Ivanović and Alli Neumann to name a few (oh wait, Alli actually is a musician, but you get the drift). Here’s the hero version.",
  },
  {
    client: "Gore-Tex",
    image: "/images/story/gore-tex.jpg",
    text: "A song doesn’t always have to be the main focus though. For this Gore-Tex campaign we went into their secret testing facility in the Bavarian Alps and recorded all of their weird and wonderful all-weather testing machines, turning them into this epic adventure in sound design.",
  },
];

const INTERLUDE: Spot = {
  client: "Crazy Wolf",
  image: "/images/story/crazy-wolf.jpg",
  text: "Sound design can be adventurous, sound design can be subtle and sound design can also be insane, like when you’re hyped up on too many energy drinks.",
};

const ROWS_AFTER_INTERLUDE: Spot[] = [
  {
    client: "Dr. Oetker",
    image: "/images/story/dr-oetker.jpg",
    text: "Phew… need to calm down a little after that one. How about a lovely little heart-warming, nostalgic, acoustic ballad to bring down the pulse and remind us of the sweeter moments in life?",
  },
  {
    client: "Targobank",
    image: "/images/story/targobank.jpg",
    text: "Earlier we remade the Backstreet Boys, now we’re remaking Michael Sembello’s 80s classic, Maniac. From licensing, to recreating those legendary 80s synth sounds to casting a singer who can hit the (very) high notes like it’s the most normal thing in the world, we had it “covered” from start to finish.",
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
];

const CLOSER: Spot = {
  client: "Hardmade",
  image: "/images/story/hardmade.jpg",
  text: "To sum it all up… we love all things music and all things audio. Here’s one last spot with lots of different styles and sounds in it, because you can combine metal with salsa and trap if you want to.",
};

function slugify(client: string) {
  return `story-${client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

/** A full-width spot: optional lead-in copy, the video, then the client label. */
function FullWidthSpot({ spot, copyFirst }: { spot: Spot; copyFirst: boolean }) {
  const copy = (
    <div className="page-padding">
      <div className="container-medium align-left">
        <div className="spacer-l-start spacer-l-end">
          <h2 className="copy-medium">{spot.client}</h2>
          <div data-wf--spacer--variant="sm" className="spacer-component w-variant-1ed5893b-149c-09fd-1a9e-43daba4600bc"></div>
          <div className="rich-text-custom w-richtext">
            <p>{spot.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <section className="section-story-spot">
      {copyFirst && copy}
      <MediaFrame id={slugify(spot.client)} poster={spot.image} alt={`${spot.client} spot`} vimeoId={spot.vimeoId} />
      {!copyFirst && copy}
    </section>
  );
}

/**
 * Video and copy side by side, 50/50, in the Services page's two-column layout.
 * Sections alternate grey and white like the board's text panels.
 */
function SpotRows({ spots }: { spots: Spot[] }) {
  return (
    <>
      {spots.map((spot, i) => (
        <section
          className={i % 2 === 0 ? "section-services background-color-light-1" : "section-services"}
          key={spot.client}
        >
          <div className="page-padding">
            <div className="container-large">
              <div className="_2-column-grid">
                <div className="grid-item is-media is-video">
                  <MediaFrame id={slugify(spot.client)} poster={spot.image} alt={`${spot.client} spot`} vimeoId={spot.vimeoId} />
                </div>
                <div className="grid-item">
                  <div className="item-inner no-padding">
                    <div className="services-item-inner-content">
                      <h3 className="heading-style-h2">{spot.client}</h3>
                      <div className="rich-text-custom w-richtext">
                        <p>{spot.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

export default function StoryPage() {
  return (
    <>
      <Header variant="start-top" />
      <div className="main-wrapper">
        <div className="nav-distance"></div>

        <GradientBanner form="story-hero" background="var(--_color---accent-color-3)" line="var(--_color---accent-color-1)">
          <RevealText as="h1" className="heading-style-h1" text="A 360° Approach to Sonic Storytelling" />
          <p className="copy-medium">
            What do Nina Chuba, The Backstreet Boys and a secret lab in the Alps have in common? Let’s find out
            (it’s blut, of course).
          </p>
        </GradientBanner>

        <FullWidthSpot spot={OPENER} copyFirst={false} />
        <SpotRows spots={ROWS_BEFORE_INTERLUDE} />

        <GradientBanner form="story-banner-core" background="#dfe5ac" line="var(--_color---accent-color-1)">
          <RevealText className="heading-style-h1" text="Sound lives at the core of what we do." />
        </GradientBanner>

        <FullWidthSpot spot={INTERLUDE} copyFirst />
        <SpotRows spots={ROWS_AFTER_INTERLUDE} />

        <GradientBanner form="story-banner-connector" background="#9747ff" line="var(--_color---accent-color-2)">
          <RevealText className="heading-style-h1" text="It’s not background music, it’s a connector" />
        </GradientBanner>

        <FullWidthSpot spot={CLOSER} copyFirst />

        <PageTeaser
          heading="Want to know more about what else we do?"
          text="Check out some of our sonic strategy cases or see how we measure your campaign with the Sonic Performance Tracker."
          href="/spt"
          ariaLabel="Go to the Sonic Performance Tracker"
        />

        <Footer />
      </div>
    </>
  );
}
