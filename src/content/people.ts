/*
  Team pages (/team/<slug>): one page per contact person, written for search,
  with the role, what it covers, selected work and an FAQ.

  Everything here is drawn from what the site already says (roles, the Work
  board copy, the Strategy services). There are no personal biography facts
  yet: `bio` is empty until Michael and Karl send theirs, and nothing is shown
  for it until then. Don't invent career history, clients or awards here.
*/

export type Person = {
  slug: string;
  name: string;
  firstName: string;
  role: string;
  /** Photo file in /public/images (with -p-500/-800/-1080 sizes). */
  file: string;
  email: string;
  phone?: string;
  /** Page <title> and description: name, role, agency, city. */
  seoTitle: string;
  seoDescription: string;
  /** Search terms the copy covers, for the keywords meta tag. */
  keywords: string[];
  hero: { line: string; background: string; lineColor: string; dark?: boolean };
  /** Short paragraphs under the portrait. */
  intro: string[];
  /** Personal bio from the person themselves; empty until they send it. */
  bio: string[];
  expertise: {
    heading: string;
    line: string;
    intro: string;
    image: string;
    alt: string;
    items: { name: string; text: string }[];
  };
  /** Work spots by client name (src/content/work.ts) and/or case slugs. */
  work: { heading: string; spots?: string[]; cases?: string[] };
  faq: { name: string; text: string }[];
};

export const PEOPLE: Person[] = [
  {
    slug: "michael-robb",
    name: "Michael Robb",
    firstName: "Michael",
    role: "Head of Audio Production",
    file: "Michael",
    email: "michael.robb@blut.agency",
    phone: "+49 177 6233941",
    seoTitle: "Michael Robb – Head of Audio Production at blut | Music Production & Sound Design, Hamburg",
    seoDescription:
      "Michael Robb leads audio production at blut, the music-led creative agency in Hamburg: brand songs, music production, sound design, remakes and the final mix for campaigns.",
    keywords: [
      "Michael Robb",
      "Head of Audio Production",
      "audio production agency Hamburg",
      "music production for brands",
      "sound design for advertising",
      "brand song",
      "sonic branding",
      "blut",
    ],
    hero: {
      line: "Head of Audio Production at blut. Music, sound design and the final mix, from the first idea to the finished spot.",
      background: "#7a3bff",
      lineColor: "#02b7fd",
    },
    intro: [
      "Michael Robb is Head of Audio Production at blut, the music-led creative agency in Hamburg.",
      "He leads how a brand’s sonic strategy turns into sound people actually hear: brand songs and original scores, remakes of songs everyone knows, sound design that carries a spot, and the final mix that ties it together.",
    ],
    bio: [],
    expertise: {
      heading: "Audio Production",
      line: "From the first note to the final mix.",
      intro:
        "Every piece of audio starts with the brand’s sonic DNA. These are the parts of a production Michael’s team takes on, alone or together:",
      image: "/images/story/gore-tex.jpg",
      alt: "Recording for the Gore-Tex campaign",
      items: [
        {
          name: "Music Production & Brand Songs",
          text: "Original music written for a brand: for the Schwarzkopf relaunch, a brand song with changing arrangements for a range of celebrities and influencers; for Adidas Superstar, a film score from yesteryear with brass, woodwinds and grand piano.",
        },
        {
          name: "Sound Design",
          text: "Sound that carries the picture, from adventurous to subtle to insane: for Gore-Tex, recordings of their all-weather testing machines in a secret lab in the Bavarian Alps, turned into an adventure in sound design.",
        },
        {
          name: "Remakes & Licensing",
          text: "Songs everyone knows, made new: a Backstreet Boys classic for McDonald’s and Michael Sembello’s Maniac for Targobank, from licensing to recreating the original sound to casting the right voice.",
        },
        {
          name: "Mixing & Final Mix",
          text: "The last step that makes a spot sound finished: for Samsung with Nina Chuba, her voice recordings from the film set, a soundtrack for the visuals, subtle SFX for the movement and an overall natural yet hi-end mix.",
        },
      ],
    },
    work: {
      heading: "Selected blut audio work",
      spots: ["Gore-Tex", "McDonald’s", "Targobank", "Adidas"],
    },
    faq: [
      {
        name: "What does blut’s audio production include?",
        text: "Music production and brand songs, sound design, remakes and licensing of existing songs, casting singers and voices, and the final mix for film, social and campaign assets.",
      },
      {
        name: "Can blut remake a well-known song for a campaign?",
        text: "Yes. For McDonald’s blut remade a Backstreet Boys classic, and for Targobank Michael Sembello’s Maniac, covering licensing, recreating the sound and casting.",
      },
      {
        name: "Does blut only do music, or sound design too?",
        text: "Both. Some spots need a song; others are carried by sound design, like the Gore-Tex campaign built from recordings of their testing machines, or the Crazy Wolf energy-drink spot.",
      },
      {
        name: "How do I start an audio production with blut?",
        text: "Write to Michael at michael.robb@blut.agency or call +49 177 6233941. blut is based in Hamburg with offices in Berlin and Munich.",
      },
    ],
  },
  {
    slug: "karl-jawara",
    name: "Karl Jawara",
    firstName: "Karl",
    role: "Creative Product & Campaign Lead",
    file: "Karl",
    email: "karl.jawara@blut.agency",
    seoTitle: "Karl Jawara – Creative Product & Campaign Lead at blut | Music-Led Campaigns, Hamburg",
    seoDescription:
      "Karl Jawara is Creative Product & Campaign Lead at blut, the music-led creative agency in Hamburg: campaigns, content, artist partnerships and cultural activations built on a brand’s sonic strategy.",
    keywords: [
      "Karl Jawara",
      "Creative Product & Campaign Lead",
      "music-led campaigns",
      "music marketing agency Hamburg",
      "artist partnerships for brands",
      "cultural activation",
      "content production",
      "blut",
    ],
    hero: {
      line: "Creative Product & Campaign Lead at blut. Campaigns, content and activations with music at their heart.",
      background: "#e7f639",
      lineColor: "#82685b",
      dark: true,
    },
    intro: [
      "Karl Jawara is Creative Product & Campaign Lead at blut, the music-led creative agency in Hamburg.",
      "He shapes how a brand’s sound comes to life in the world: campaigns and content, artist collaborations and cultural activations, all starting from the brand’s sonic DNA and measured for their impact.",
    ],
    bio: [],
    expertise: {
      heading: "Campaigns & Creative Product",
      line: "From strategy to real life.",
      intro:
        "Informed by blut’s analytical insights, Karl’s work turns a sonic identity into assets and experiences across every touchpoint:",
      image: "/images/spt/slideshow-poster.jpg",
      alt: "On set with Hyundai Inster",
      items: [
        {
          name: "Content & Campaign Production",
          text: "Campaigns, social content, films and brand experiences that don’t just grab attention, they earn emotional loyalty. Every piece starts with the brand’s sonic DNA and turns it into real-world resonance.",
        },
        {
          name: "Artist Partnerships",
          text: "Artist collaborations that are creatively inspired and make strategic sense, like DJ Seinfeld and sogumm for the Hyundai Inster launch, or UK Grime artist Che Lingo for the VW e-up!",
        },
        {
          name: "Cultural Activation & Experiences",
          text: "Branded playlists, cultural partnerships and live experiences that make a brand part of the conversation, not an outsider shouting from the sidelines.",
        },
        {
          name: "Measurable Impact",
          text: "Engagement, cultural resonance and strategic impact tracked with the Sonic Performance Tracker, so every campaign shows how its sound is being heard and felt.",
        },
      ],
    },
    work: {
      heading: "Selected blut campaigns",
      cases: ["hyundai-are-you-in", "volkswagen-bringing-it-all-back-home", "wdr---re-arranging-perceptions"],
    },
    faq: [
      {
        name: "What is a music-led campaign?",
        text: "A campaign built around the brand’s sound: a song, an artist partnership or a sonic identity that carries the films, social content and live moments, instead of music added at the end.",
      },
      {
        name: "Can blut connect brands with artists?",
        text: "Yes. blut matches brands with artists using data-based research and qualitative factors, so the partnership feels authentic and makes strategic sense. Recent examples include DJ Seinfeld and sogumm for Hyundai.",
      },
      {
        name: "How does blut measure a campaign’s impact?",
        text: "With reporting, market research and data analytics, including the Sonic Performance Tracker: direct response, cultural resonance and strategic impact scoring.",
      },
      {
        name: "How do I start a campaign with blut?",
        text: "Write to Karl at karl.jawara@blut.agency. blut is based in Hamburg with offices in Berlin and Munich.",
      },
    ],
  },
];

export function getPerson(slug: string): Person | undefined {
  return PEOPLE.find((p) => p.slug === slug);
}
