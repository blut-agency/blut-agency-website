import type { WorkSpotData } from "@/components/WorkSpot";

/*
  The Work spots, in the "Website v2" board's order and with its copy word for
  word. Used by the Work page (mosaic) and the team pages (selected work).
*/

export type WorkItem = { spot: WorkSpotData; layout: "wide" | "row" | "row-flipped" };

export const WORK_ITEMS: WorkItem[] = [
  {
    layout: "wide",
    spot: {
      client: "Samsung / Nina Chuba",
      image: "/images/story/samsung-nina-chuba.jpg",
      videoUrl: "/videos/work/samsung-nina-chuba.mp4",
      text: "Some projects call for all-round production, like when we worked with Nina Chuba on this Samsung spot. We took her voice recordings from the film set and created a fitting soundtrack for the visuals, some subtle SFX to support the movement of the spot and an overall natural yet hi-end mix to round out the project.",
    },
  },
  {
    layout: "row",
    spot: {
      client: "Schwarzkopf",
      image: "/images/story/schwarzkopf.jpg",
      videoUrl: "/videos/work/schwarzkopf.mp4",
      text: "But the talent doesn’t always have to be musical. For the relaunch of the Schwarzkopf brand, we composed a brand song with changing arrangements to suit a variety of celebrities and influencers including Diane Kruger, Collien Fernandes, Sofia Vergara, Ana Ivanović and Alli Neumann to name a few (oh wait, Alli actually is a musician, but you get the drift). Here’s the hero version.",
    },
  },
  {
    layout: "row-flipped",
    spot: {
      client: "Volkswagen",
      image: "/images/story/volkswagen.jpg",
      videoUrl: "/videos/work/volkswagen.mp4",
      text: "Sometimes the artist is in the spotlight, but for this VW campaign, the talent was hiding in the background. For the launch of the VW e-up! we created this fresh beat and had UK Grime legend Che Lingo work his magic on it. “They never thought we were good enough, now we’re pullin’ up…”",
    },
  },
  {
    layout: "row",
    spot: {
      client: "Gore-Tex",
      image: "/images/story/gore-tex.jpg",
      videoUrl: "/videos/work/gore-tex.mp4",
      text: "A song doesn’t always have to be the main focus though. For this Gore-Tex campaign we went into their secret testing facility in the Bavarian Alps and recorded all of their weird and wonderful all-weather testing machines, turning them into this epic adventure in sound design.",
    },
  },
  {
    layout: "wide",
    spot: {
      client: "Crazy Wolf",
      image: "/images/story/crazy-wolf.jpg",
      videoUrl: "/videos/work/crazy-wolf.mp4",
      text: "Sound design can be adventurous, sound design can be subtle and sound design can also be insane, like when you’re hyped up on too many energy drinks.",
    },
  },
  {
    layout: "row-flipped",
    spot: {
      client: "McDonald’s",
      image: "/images/story/mcdonalds.jpg",
      videoUrl: "/videos/work/mcdonalds.mp4",
      text: "We didn’t write this song (obviously), but instead remade this Backstreet Boys classic with a group of “singers” who should maybe stick to acting. But that was part of the fun, as was creating the overall sound design and mix of the spot.",
    },
  },
  {
    layout: "row",
    spot: {
      client: "Targobank",
      image: "/images/story/targobank.jpg",
      videoUrl: "/videos/work/targobank.mp4",
      text: "Earlier we remade the Backstreet Boys, now we’re remaking Michael Sembello’s 80s classic, Maniac. From licensing, to recreating those legendary 80s synth sounds to casting a singer who can hit the (very) high notes like it’s the most normal thing in the world, we had it “covered” from start to finish.",
    },
  },
  {
    layout: "row-flipped",
    spot: {
      client: "Dr. Oetker",
      image: "/images/story/dr-oetker.jpg",
      videoUrl: "/videos/work/dr-oetker.mp4",
      text: "Phew… need to calm down a little after that one. How about a lovely little heart-warming, nostalgic, acoustic ballad to bring down the pulse and remind us of the sweeter moments in life?",
    },
  },
  {
    layout: "row",
    spot: {
      client: "Adidas",
      image: "/images/story/adidas-originals.jpg",
      videoUrl: "/videos/work/adidas-originals.mp4",
      text: "We do like to get more artistic too from time to time, like in this cinematic Adidas Superstar spot featuring rapper Jugo Ürdens and shot on 16mm. The music sounds like a film score from yesteryear and we felt nostalgic recording brass, woodwinds and grand piano for it, before creating the sound design and final mix.",
    },
  },
  {
    layout: "wide",
    spot: {
      client: "Hardmade",
      image: "/images/story/hardmade.jpg",
      videoUrl: "/videos/work/hardmade.mp4",
      text: "To sum it all up… we love all things music and all things audio. Here’s one last spot with lots of different styles and sounds in it, because you can combine metal with salsa and trap if you want to.",
    },
  },
];

export function workItem(client: string): WorkItem {
  const item = WORK_ITEMS.find((i) => i.spot.client === client);
  if (!item) throw new Error(`No Work spot for ${client}`);
  return item;
}
