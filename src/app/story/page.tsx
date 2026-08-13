import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "A 360º Approach to Sonic Storytelling | blut",
  description:
    "What do Nina Chuba, the Backstreet Boys and a secret lab in the Alps have in common? Let's find out (it's blut, of course).",
};

// Real narrative copy from the team's Figma redesign board. Every vignette
// below is missing its photo/video asset — see the placeholder note.
const VIGNETTES: { client: string; text: string }[] = [
  {
    client: "Samsung / Nina Chuba",
    text: "Some projects call for all-round production, like when we worked with Nina Chuba on this Samsung spot. We took her voice recordings from the film set and created a fitting soundtrack for the visuals, some subtle SFX to support the movement of the spot and an overall natural yet hi-end mix to round out the project.",
  },
  // Open internal question — Timo flagged discomfort with this spot ("makes us look
  // like bad musicians") in the Figma board. Keeping it in per current instructions,
  // but it needs a final call from the team before launch.
  {
    client: "McDonald's",
    text: "We didn't write this song (obviously), but instead remade this Backstreet Boys classic with a group of “singers” who should maybe stick to acting. But that was part of the fun, as was creating the overall sound design and mix of the spot.",
  },
  {
    client: "Volkswagen",
    text: "Sometimes the artist is in the spotlight, but for this VW campaign, the talent was hiding in the background. For the launch of the VW E-Up we created this fresh beat and had UK Grime legend Che Lingo work his magic on it. “They never thought we were good enough, now we're pullin' up… “",
  },
  {
    client: "Schwarzkopf",
    text: "But the talent doesn't always have to be musical. For the relaunch of the Schwarzkopf brand, we composed a brand song with changing arrangements to suit a variety of celebrities and influencers including Diane Kruger, Collien Fernandes, Sofia Vergara, Ana Ivanović and Alli Neumann to name a few (oh wait, Alli actually is a musician, but you get the drift). Here's the hero version.",
  },
  {
    client: "Gore-Tex",
    text: "A song doesn't always have to be the main focus though. For this Gore-Tex campaign we went into their secret testing facility in the Bavarian alps and recorded all of their weird and wonderful all-weather testing machines, turning thing into this epic adventure in sound design:",
  },
  {
    client: "",
    text: "Phew… need to calm down a little after that one. How about a lovely little heart-warming, nostalgic, acoustic ballad to bring down the pulse and remind us of the sweeter moments in life?",
  },
  {
    client: "",
    text: "Earlier we remade the Backstreet Boys, now we're remaking Michael Sembello's 80s classic, Maniac. From licensing, to recreating those legendary 80s synth sounds to casting a singer who can hit the (very) high notes like it's the most normal thing in the world, we had it “covered” from start to finished.",
  },
  {
    client: "Haribo",
    text: "Here's another remake of a classic song that literally everyone knows. It's Happy Birthday… but not as simple as it sounds. We got to work with the iconic Haribo Voice Kids concept, but turn it into music for the first time. We experimented with punk, metal, pop and stadium rock and recorded several hours of kids' voices before landing on this final version.",
  },
  {
    client: "Adidas Originals",
    text: "We do like to get more artistic too from time to time, like in this cinematic Adidas Superstar spot featuring rapper Jugo Ürdens and shot on 16mm. The music sounds like a film score from yesteryear and we felt nostalgic recording brass, woodwinds and grand piano for it, before creating the sound design and final mix.",
  },
];

const ALSO_WORKED_WITH = ["Targobank", "Dr. Oetker", "Crazy World", "Hardmade"];

export default function StoryPage() {
  return (
    <>
      <Header variant="start-top" />
      <div className="main-wrapper">
        <div className="nav-distance"></div>

        <section className="section-services-intro">
          <div className="page-padding">
            <div className="container-large">
              <div className="container-medium align-left">
                <div
                  data-wf--spacer--variant="xxl"
                  className="spacer-component w-variant-f176b2ee-826a-f858-3f7a-82a98e21da6b"
                ></div>
                <div className="text-component">
                  <h1 className="heading-style-h1">A 360º Approach to Sonic Storytelling</h1>
                  <div className="spacer-slot">
                    <div
                      data-wf--spacer--variant="xl"
                      className="spacer-component w-variant-2cf01a4e-9649-6aa7-d409-1feb17978d26"
                    ></div>
                  </div>
                  <div className="rich-text-custom w-richtext">
                    <p>
                      What do Nina Chuba, The Backstreet Boys and a secret lab in the Alps have in common? Let&#x27;s
                      find out (it&#x27;s blut, of course).
                    </p>
                  </div>
                </div>
                <div
                  data-wf--spacer--variant="xxl"
                  className="spacer-component w-variant-f176b2ee-826a-f858-3f7a-82a98e21da6b"
                ></div>
              </div>
            </div>
          </div>
        </section>

        {VIGNETTES.map((v, i) => (
          <section className="section-services" key={i}>
            <div className="page-padding">
              <div className="container-large">
                <div className="spacer-l-start spacer-l-end">
                  <div className="content-placeholder">
                    <p>[Placeholder — real photo/video for this spot goes here]</p>
                  </div>
                  <div
                    data-wf--spacer--variant="md"
                    className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                  ></div>
                  {v.client && <h2 className="copy-medium">{v.client}</h2>}
                  <div
                    data-wf--spacer--variant="sm"
                    className="spacer-component w-variant-1ed5893b-149c-09fd-1a9e-43daba4600bc"
                  ></div>
                  <div className="rich-text-custom w-richtext">
                    <p>{v.text}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="section-services background-color-light-1">
          <div className="page-padding">
            <div className="container-large">
              <div className="spacer-l-start spacer-l-end">
                <h2 className="copy-medium">Also part of the family</h2>
                <div
                  data-wf--spacer--variant="sm"
                  className="spacer-component w-variant-1ed5893b-149c-09fd-1a9e-43daba4600bc"
                ></div>
                <div className="rich-text-custom w-richtext">
                  <p>{ALSO_WORKED_WITH.join(" · ")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-services">
          <div className="page-padding">
            <div className="container-large">
              <div className="spacer-l-start spacer-l-end">
                <h2 className="heading-style-h1">Sound lives at the core of what we do.</h2>
                <div
                  data-wf--spacer--variant="md"
                  className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                ></div>
                <div className="rich-text-custom w-richtext">
                  <p>
                    Sound design can be adventurous, sound design can be subtle and sound design can also be insane,
                    like when you&#x27;re hyped up on too many energy drinks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-services background-color-light-1">
          <div className="page-padding">
            <div className="container-large">
              <div className="spacer-l-start spacer-l-end">
                <h2 className="heading-style-h1">It&#x27;s not background music, it&#x27;s a connector</h2>
                <div
                  data-wf--spacer--variant="md"
                  className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                ></div>
                <div className="rich-text-custom w-richtext">
                  <p>
                    To sum it all up… we love all things music and all things audio. Here&#x27;s one last spot with
                    lots of different styles and sounds in it, because you can combine metal with salsa and trap if
                    you want to.
                  </p>
                </div>
                <div
                  data-wf--spacer--variant="md"
                  className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                ></div>
                <div className="content-placeholder">
                  <p>[Placeholder — closing spot video goes here]</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-services-cases-teaser">
          <div className="page-teaser-wide-component">
            <div className="page-teaser-wide-background-color is-accent-2"></div>
            <div className="container-large">
              <div
                data-wf--box-inner-text--variant="is-next-case-study-teaser"
                className="item-inner w-variant-d9f4f337-c70e-b4e9-7a9a-312292f48761"
              >
                <div className="item-top w-variant-d9f4f337-c70e-b4e9-7a9a-312292f48761">
                  <div className="copy-small">
                    <div className="meta-list-component">
                      <div className="meta-list w-richtext">
                        <p>Want to know more about what else we do?</p>
                      </div>
                    </div>
                  </div>
                  <div
                    data-wf--spacer--variant="md"
                    className="spacer-component w-variant-26d428b4-eedf-8573-45ef-f4ea471bd58b"
                  ></div>
                  <h2 className="heading-style-h1">
                    Check out our sonic strategy cases or see how we measure your campaign with the Sonic Performance
                    Tracker.
                  </h2>
                </div>
                <div className="item-bottom">
                  <div
                    data-wf--cta-link--variant="dark-text"
                    className="cta-link-component w-variant-dee7867e-1b44-c2d3-0b3d-782590fc4f34"
                  >
                    <Link
                      aria-hidden="true"
                      aria-label="Go to the Sonic Performance Tracker"
                      href="/spt"
                      className="cta-link-full-cover w-inline-block"
                    />
                    <Link
                      aria-label="Go to the Sonic Performance Tracker"
                      href="/spt"
                      className="cta-link w-inline-block"
                    >
                      <div className="cta-link-line w-variant-dee7867e-1b44-c2d3-0b3d-782590fc4f34"></div>
                      <div className="cta-link-text">Read more</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
