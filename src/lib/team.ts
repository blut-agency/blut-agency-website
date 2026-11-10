import team from "@/content/team.json";

/*
  The team: names, roles, addresses and the team pages' texts, from Sanity
  via team.json. Photos (by `file`) and each person's colours stay in code.
*/

export interface TeamMember {
  /** Short code name, used by the pages' contact blocks, e.g. "michael". */
  key: string;
  name: string;
  firstName: string;
  role: string;
  email: string;
  phone?: string;
  /** Photo file name in /public/images and /public/images/team. */
  file: string;
  showOnAbout: boolean;
  /** The person's own page (/team/<slug>), if they have one. */
  page?: {
    slug: string;
    heroLine: string;
    intro: string[];
    bio: string[];
    expertise: {
      heading: string;
      line: string;
      intro: string;
      image: string;
      alt: string;
      items: { name: string; text: string }[];
    };
    work: { heading: string; spots?: string[]; cases?: string[] };
    faq: { name: string; text: string }[];
    seo: { title: string; description: string; keywords: string[] };
  };
}

/** Each person's colours (banner and pattern). Someone new gets the default. */
export const TEAM_COLORS: Record<string, { background: string; line: string; dark?: boolean }> = {
  karl: { background: "#7a3bff", line: "#02b7fd" },
  timo: { background: "var(--_color---accent-color-3)", line: "var(--_color---accent-color-1)" },
  elliot: { background: "var(--_color---accent-color-2)", line: "var(--_color---accent-color-1)" },
  michael: { background: "var(--_color---accent-color-1)", line: "var(--_color---accent-color-3)" },
};
export const DEFAULT_TEAM_COLOR = { background: "var(--_color---accent-color-3)", line: "var(--_color---accent-color-1)" };

const members = (team as unknown as { members: TeamMember[] }).members;

export function getTeam(): TeamMember[] {
  return members;
}

export function getMember(key: string): TeamMember | undefined {
  return members.find((m) => m.key === key);
}
