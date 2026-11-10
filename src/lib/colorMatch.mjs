import sharp from "sharp";

/*
  Colour maths shared by src/lib/imageTheme.ts (photo highlights, at render)
  and scripts/case-colours.mjs (each case's colour, before the build).

  Plain JavaScript so the build script can run it with node as it is.
  Channels are 0–1 throughout.
*/

/** @typedef {[number, number, number]} Rgb */

/** OKLab chroma at or below this reads as grey. */
export const NEUTRAL = 0.04;

/**
 * The photo's dominant colour: shrunk to 48×48, then the strongest
 * saturation-weighted hue bucket (see dominantColor).
 * @param {string | Buffer} input file path or image bytes
 * @returns {Promise<Rgb>}
 */
export async function dominantOfImage(input) {
  const { data, info } = await sharp(input).resize(48, 48, { fit: "cover" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return dominantColor(data, info.channels);
}

/**
 * Ranks colour themes by how much of a photo's colour they cover: best first.
 *
 * Every colourful pixel votes for the theme colours near its hue (OKLCh, a
 * soft window of about ±20°), weighted by how vivid it is (chroma²), so a
 * strong colour counts more than a faint tint. A theme scores the votes for
 * its background plus those for its line, so a pair whose two colours both
 * show in the photo beats a pair with one. Grey theme colours get no votes.
 *
 * Scores are shares of the photo's colour (0 = none of it). A photo with
 * (almost) no colour gives no ranking at all.
 *
 * @template {{ main: string; secondary: string }} T
 * @param {string | Buffer} input file path or image bytes
 * @param {T[]} themes
 * @returns {Promise<{ theme: T; score: number }[]>}
 */
export async function rankThemesForImage(input, themes) {
  const { data, info } = await sharp(input).resize(64, 64, { fit: "cover" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  /** @type {[number, number][]} hue in degrees, weight */
  const pixels = [];
  for (let i = 0; i < data.length; i += info.channels) {
    const lab = toOklab([data[i] / 255, data[i + 1] / 255, data[i + 2] / 255]);
    const c = chroma(lab);
    if (c <= NEUTRAL || lab[0] < 0.2) continue;
    pixels.push([hueOf(lab), c * c]);
  }
  // Under 2% of the pixels in colour: a grey photo, nothing to go by.
  if (pixels.length < (data.length / info.channels) * 0.02) return [];
  const total = pixels.reduce((sum, p) => sum + p[1], 0);

  /** @param {number} hue */
  const votes = (hue) =>
    pixels.reduce((sum, [h, w]) => {
      const d = Math.abs(((h - hue + 540) % 360) - 180);
      return sum + w * Math.exp(-((d / 20) ** 2));
    }, 0) / total;

  return themes
    .map((theme) => {
      const hues = [theme.secondary, theme.main]
        .map(parseColor)
        .filter((rgb) => rgb !== null)
        .map(toOklab)
        .filter((lab) => chroma(lab) > NEUTRAL)
        .map(hueOf);
      return { theme, score: hues.reduce((sum, h) => sum + votes(h), 0) };
    })
    .sort((a, b) => b.score - a.score);
}

/** @param {Rgb} lab OKLab */
function hueOf(lab) {
  return (Math.atan2(lab[2], lab[1]) * 180) / Math.PI;
}

/**
 * Lower is better: hue distance in degrees, or OKLab distance for a grey photo.
 * A grey theme colour never counts against a colourful photo, since it would
 * match every muted one.
 * @param {Rgb} dominant
 * @param {Rgb} bg
 * @param {Rgb} line
 */
export function matchScore(dominant, bg, line) {
  const target = toOklab(dominant);
  const candidates = [bg, line].map(toOklab);
  if (chroma(target) <= NEUTRAL) {
    return Math.min(...candidates.map((c) => Math.hypot(target[0] - c[0], target[1] - c[1], target[2] - c[2])));
  }
  const colourful = candidates.filter((c) => chroma(c) > NEUTRAL);
  if (colourful.length === 0) return Infinity;
  return Math.min(...colourful.map((c) => hueDistance(target, c)));
}

/**
 * Saturation-weighted colour of the strongest hue bucket. Near-black,
 * near-white and grey pixels are left out; an all-grey photo gives its average.
 * @param {Uint8Array} data raw RGB(A) pixels
 * @param {number} channels
 * @returns {Rgb}
 */
export function dominantColor(data, channels) {
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
    const c = max - min;
    if (l < 0.1 || l > 0.93 || c < 0.12) continue;
    const s = c / (1 - Math.abs(2 * l - 1));

    let h;
    if (max === r) h = ((g - b) / c + 6) % 6;
    else if (max === g) h = (b - r) / c + 2;
    else h = (r - g) / c + 4;
    const bucket = Math.floor((h / 6) * BUCKETS) % BUCKETS;

    const w = s * s;
    weight[bucket] += w;
    sum[bucket][0] += r * w; sum[bucket][1] += g * w; sum[bucket][2] += b * w;
  }

  const top = weight.indexOf(Math.max(...weight));
  if (weight[top] === 0) return [all[0] / count, all[1] / count, all[2] / count];
  return [sum[top][0] / weight[top], sum[top][1] / weight[top], sum[top][2] / weight[top]];
}

/**
 * #rgb, #rrggbb, hsl()/hsla() and the few names the CMS uses.
 * @param {string} value
 * @returns {Rgb | null}
 */
export function parseColor(value) {
  const v = value.trim().toLowerCase();
  /** @type {Record<string, string>} */
  const named = { black: "#000000", white: "#ffffff" };
  const hex = named[v] ?? v;
  if (hex.startsWith("#")) {
    const h = hex.length === 4 ? hex.slice(1).split("").map((c) => c + c).join("") : hex.slice(1, 7);
    return /** @type {Rgb} */ ([0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255));
  }
  const hsl = v.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/);
  if (hsl) {
    const h = Number(hsl[1]) / 360;
    const s = Number(hsl[2]) / 100;
    const l = Number(hsl[3]) / 100;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    /** @param {number} t */
    const hue = (t) => {
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

/** @param {number} c */
const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

/**
 * @param {Rgb} rgb
 * @returns {Rgb}
 */
export function toOklab([r, g, b]) {
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

/** @param {Rgb} lab */
export function chroma(lab) {
  return Math.hypot(lab[1], lab[2]);
}

/**
 * @param {Rgb} a OKLab
 * @param {Rgb} b OKLab
 */
export function hueDistance(a, b) {
  const ha = (Math.atan2(a[2], a[1]) * 180) / Math.PI;
  const hb = (Math.atan2(b[2], b[1]) * 180) / Math.PI;
  return Math.abs(((ha - hb + 540) % 360) - 180);
}

/** @param {Rgb} rgb */
export function relativeLuminance([r, g, b]) {
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** @param {Rgb} rgb */
export function toHex(rgb) {
  return "#" + rgb.map((c) => Math.round(c * 255).toString(16).padStart(2, "0")).join("");
}
