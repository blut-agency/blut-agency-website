import path from "node:path";
import sharp from "sharp";
import { getColors, type Color } from "@/lib/content";

/**
 * Picks, for each photo, the CMS colour theme (cms-content.json → colors)
 * whose colours match it best, so the animated highlight behind a teaser panel
 * picks up the photo's own colour.
 *
 * The photo is shrunk to 48×48 and its dominant colour taken: pixels are
 * grouped by hue, weighted by saturation, with near-black, near-white and grey
 * pixels left out. Themes are then ranked by how close the hue of their
 * background (secondary) or line (main) colour is to it, in OKLCh. A grey
 * theme colour never counts, since it would match every muted photo. A grey
 * photo falls back to plain OKLab distance.
 *
 * Photos passed together get different themes where possible: the closest
 * match is settled first, and the others take their next best.
 *
 * Content with a theme of its own (a case study's CMS colour, which its case
 * page uses too) keeps it: pass it as `color` to `highlightThemes`.
 *
 * Images can be local (/images/…, read from public/) or remote URLs (fetched).
 * Server only. The dominant colour is cached per image; an image that can't
 * be read gets no theme rather than breaking the page.
 */

export interface ImageTheme {
  slug: string;
  /** Highlight background. */
  background: string;
  /** Animated line colour. */
  line: string;
  /** Text on top of the background should be dark. */
  lightBackground: boolean;
  /** The photo's dominant colour, for debugging (absent for an own theme). */
  dominant?: string;
}

type ThemeColors = { slug: string; main: string; secondary: string };

/** One highlight per teaser: its own theme if it has one, else the photo's match. */
export async function highlightThemes(
  items: { image: string; color?: ThemeColors | null }[],
): Promise<(ImageTheme | null)[]> {
  const toMatch = items.filter((item) => !item.color);
  const matched = await themesForImages(toMatch.map((item) => item.image));
  return items.map((item) => (item.color ? themeFromColors(item.color) : matched[toMatch.indexOf(item)]));
}

export function themeFromColors(color: ThemeColors): ImageTheme | null {
  const bg = parseColor(color.secondary);
  if (!bg) return null;
  return {
    slug: color.slug,
    background: color.secondary,
    line: color.main,
    lightBackground: relativeLuminance(bg) > LIGHT,
  };
}

type Rgb = [number, number, number];

/** OKLab chroma at or below this reads as grey. */
const NEUTRAL = 0.04;
/** Relative luminance above this takes dark text: where black text starts to
    contrast more than white (so orange #ff6004 gets black, 6.9:1 instead of 3:1). */
const LIGHT = 0.179;

const dominantCache = new Map<string, Promise<Rgb | null>>();

export async function themesForImages(srcs: string[]): Promise<(ImageTheme | null)[]> {
  const dominants = await Promise.all(srcs.map(dominantOf));
  const themes = getColors()
    .map((color) => ({ color, bg: parseColor(color.secondary), line: parseColor(color.main) }))
    .filter((t): t is { color: Color; bg: Rgb; line: Rgb } => Boolean(t.bg && t.line));

  // Every (photo, theme) pair, best first; then hand out themes greedily.
  const pairs: { image: number; theme: number; score: number }[] = [];
  dominants.forEach((dominant, image) => {
    if (!dominant) return;
    themes.forEach((t, theme) => pairs.push({ image, theme, score: matchScore(dominant, t.bg, t.line) }));
  });
  pairs.sort((a, b) => a.score - b.score);

  const chosen: (number | undefined)[] = new Array(srcs.length);
  const taken = new Set<number>();
  for (const allowRepeat of [false, true]) {
    for (const { image, theme, score } of pairs) {
      if (chosen[image] !== undefined || !Number.isFinite(score)) continue;
      if (!allowRepeat && taken.has(theme)) continue;
      chosen[image] = theme;
      taken.add(theme);
    }
  }

  return chosen.map((theme, image) => {
    if (theme === undefined) return null;
    const t = themes[theme];
    return {
      slug: t.color.slug,
      background: t.color.secondary,
      line: t.color.main,
      lightBackground: relativeLuminance(t.bg) > LIGHT,
      dominant: toHex(dominants[image]!),
    };
  });
}

function dominantOf(src: string): Promise<Rgb | null> {
  let hit = dominantCache.get(src);
  if (!hit) {
    hit = readImage(src)
      .then((input) => sharp(input).resize(48, 48, { fit: "cover" }).removeAlpha().raw().toBuffer({ resolveWithObject: true }))
      .then(({ data, info }) => dominantColor(data, info.channels))
      .catch(() => null);
    dominantCache.set(src, hit);
  }
  return hit;
}

async function readImage(src: string): Promise<string | Buffer> {
  if (!/^https?:\/\//.test(src)) return path.join(process.cwd(), "public", src);
  const res = await fetch(src, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${res.status} ${src}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Lower is better: hue distance in degrees, or OKLab distance for a grey photo. */
function matchScore(dominant: Rgb, bg: Rgb, line: Rgb): number {
  const target = toOklab(dominant);
  const candidates = [bg, line].map(toOklab);
  if (chroma(target) <= NEUTRAL) {
    return Math.min(...candidates.map((c) => Math.hypot(target[0] - c[0], target[1] - c[1], target[2] - c[2])));
  }
  const colourful = candidates.filter((c) => chroma(c) > NEUTRAL);
  if (colourful.length === 0) return Infinity;
  return Math.min(...colourful.map((c) => hueDistance(target, c)));
}

/** Saturation-weighted colour of the strongest hue bucket. */
function dominantColor(data: Buffer, channels: number): Rgb {
  const BUCKETS = 24;
  const weight = new Array(BUCKETS).fill(0);
  const sum = Array.from({ length: BUCKETS }, () => [0, 0, 0]);
  const all = [0, 0, 0];
  let count = 0;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    all[0] += r; all[1] += g; all[2] += b; count++;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const chroma = max - min;
    if (l < 0.1 || l > 0.93 || chroma < 0.12) continue;
    const s = chroma / (1 - Math.abs(2 * l - 1));

    let h: number;
    if (max === r) h = ((g - b) / chroma + 6) % 6;
    else if (max === g) h = (b - r) / chroma + 2;
    else h = (r - g) / chroma + 4;
    const bucket = Math.floor((h / 6) * BUCKETS) % BUCKETS;

    const w = s * s;
    weight[bucket] += w;
    sum[bucket][0] += r * w; sum[bucket][1] += g * w; sum[bucket][2] += b * w;
  }

  const top = weight.indexOf(Math.max(...weight));
  if (weight[top] === 0) return [all[0] / count, all[1] / count, all[2] / count];
  return [sum[top][0] / weight[top], sum[top][1] / weight[top], sum[top][2] / weight[top]];
}

/** #rgb, #rrggbb, hsl()/hsla() and the few names the CMS uses. Channels 0–1. */
function parseColor(value: string): Rgb | null {
  const v = value.trim().toLowerCase();
  const named: Record<string, string> = { black: "#000000", white: "#ffffff" };
  const hex = named[v] ?? v;
  if (hex.startsWith("#")) {
    const h = hex.length === 4 ? hex.slice(1).split("").map((c) => c + c).join("") : hex.slice(1, 7);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;
  }
  const hsl = v.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/);
  if (hsl) {
    const h = Number(hsl[1]) / 360;
    const s = Number(hsl[2]) / 100;
    const l = Number(hsl[3]) / 100;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue = (t: number) => {
      t = (t + 1) % 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    return [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)];
  }
  return null;
}

const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function toOklab([r, g, b]: Rgb): Rgb {
  const [lr, lg, lb] = [linear(r), linear(g), linear(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function chroma(lab: Rgb): number {
  return Math.hypot(lab[1], lab[2]);
}

function hueDistance(a: Rgb, b: Rgb): number {
  const ha = (Math.atan2(a[2], a[1]) * 180) / Math.PI;
  const hb = (Math.atan2(b[2], b[1]) * 180) / Math.PI;
  return Math.abs(((ha - hb + 540) % 360) - 180);
}

function relativeLuminance([r, g, b]: Rgb): number {
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function toHex(rgb: Rgb): string {
  return "#" + rgb.map((c) => Math.round(c * 255).toString(16).padStart(2, "0")).join("");
}
