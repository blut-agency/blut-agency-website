/*
  Each case's colour, picked from its photo. Runs before every build, after
  sanity-sync (`npm run build`), and on demand (`npm run case-colours`).

  For every case with `colorFromPhoto` in src/content/cms-content.json, it
  takes the dominant colour of the case photo (the card photo, `thumbnail`)
  and snaps it to the closest colour theme in the same file (`colors`: the
  studio's colour themes, i.e. the styleguide pairs). The theme then goes into
  the case's `color`, which the case page, its card and Home already use.

  A case whose colour an editor picked by hand in the studio has no
  `colorFromPhoto` and keeps that colour. A photo that can't be read keeps the
  case's last colour, so the build never breaks over a picture.

  The theme that covers most of the photo's colour wins: see
  rankThemesForImage in src/lib/colorMatch.mjs. A theme no other case has yet
  wins over a repeat when it scores nearly as well (SPREAD), so the cases mix
  the styleguide pairs. A grey photo, or one where no
  theme covers at least a tenth of the colour, keeps the case's last colour.
*/
import fs from "node:fs";
import path from "node:path";
import { rankThemesForImage } from "../src/lib/colorMatch.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const JSON_FILE = path.join(ROOT, "src/content/cms-content.json");

const content = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
/** Below this share of the photo's colour, a theme is no real match. */
const MIN_SCORE = 0.1;
/** A theme no other case uses yet wins if it scores at least this share of the best one. */
const SPREAD = 0.75;

async function readImage(src) {
  if (!/^https?:\/\//.test(src)) return path.join(ROOT, "public", src);
  const res = await fetch(src, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${res.status} ${src}`);
  return Buffer.from(await res.arrayBuffer());
}

let changed = 0;
const rows = [];
// Themes already on a case: hand-picked ones first, then each pick in turn,
// so the case list mixes the styleguide pairs instead of repeating one.
const used = new Set(content.caseStudies.filter((cs) => !cs.colorFromPhoto && cs.color).map((cs) => cs.color.slug));
for (const cs of content.caseStudies) {
  if (!cs.colorFromPhoto) {
    rows.push([cs.slug, "hand-picked", cs.color?.slug ?? "none"]);
    continue;
  }
  if (!cs.thumbnail) {
    rows.push([cs.slug, "no photo", cs.color?.slug ?? "none"]);
    continue;
  }
  let ranking;
  try {
    ranking = await rankThemesForImage(await readImage(cs.thumbnail), content.colors);
  } catch (err) {
    rows.push([cs.slug, `photo unreadable (${err.message})`, cs.color?.slug ?? "none"]);
    continue;
  }
  const top = ranking[0];
  const fresh = ranking.find((r) => !used.has(r.theme.slug) && r.score >= MIN_SCORE && top && r.score >= top.score * SPREAD);
  const first = fresh ?? top;
  const second = ranking.find((r) => r !== first);
  if (!first || first.score < MIN_SCORE) {
    rows.push([cs.slug, first ? "no theme fits the photo, kept" : "grey photo, kept", cs.color?.slug ?? "none"]);
    continue;
  }
  const best = first.theme;
  used.add(best.slug);
  const color = { main: best.main, secondary: best.secondary, slug: best.slug };
  if (JSON.stringify(color) !== JSON.stringify(cs.color)) changed++;
  cs.color = color;
  rows.push([cs.slug, `from photo (${first.score.toFixed(2)}${second ? `, next ${second.theme.slug} ${second.score.toFixed(2)}` : ""})`, best.slug]);
}

if (changed) fs.writeFileSync(JSON_FILE, JSON.stringify(content, null, 2) + "\n");
const width = Math.max(...rows.map((r) => r[0].length));
for (const [slug, how, theme] of rows) console.log(`case-colours: ${slug.padEnd(width)}  ${theme.padEnd(14)}  ${how}`);
console.log(`case-colours: ${changed} case colour${changed === 1 ? "" : "s"} changed.`);
