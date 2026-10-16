/**
 * Discipline tags for the Cases index. The values are the case pages' own
 * "What we did" lists (cms-content.json -> whatWeDidHtml), so nothing new is
 * written here: this file only parses them and fixes their order.
 */

/** Filter order, as listed in the Cases brief. */
export const DISCIPLINES = ["Sonic Strategy", "Content Production", "Artist Partnership", "Sonic Branding"] as const;

export type Discipline = (typeof DISCIPLINES)[number];

/** `<ul><li>Sonic Strategy</li>…</ul>` -> ["Sonic Strategy", …], known values only. */
export function disciplinesFrom(whatWeDidHtml: string): Discipline[] {
  const items = [...whatWeDidHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) =>
    m[1]
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim(),
  );
  return DISCIPLINES.filter((d) => items.includes(d));
}

/** "Content Production" -> "content-production", for the ?discipline= link. */
export function disciplineSlug(d: Discipline): string {
  return d.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Text colour on the case's panel colour. White (as drawn in Figma) whenever
 * it reaches 3:1 (WCAG AA for large text and UI parts) — the saturated
 * orange and purple panels; black on the light panels (lime, pink, yellow),
 * where white would drop well below that.
 */
export function readableOn(hex: string): "#000" | "#fff" {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#fff";
  const n = parseInt(m[1], 16);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return 1.05 / (L + 0.05) >= WHITE_MIN_CONTRAST ? "#fff" : "#000";
}

/** Raise to 4.5 for strict AA on the small label and tag text (turns the orange panel black). */
const WHITE_MIN_CONTRAST = 3;
