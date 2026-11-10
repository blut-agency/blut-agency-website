/*
  One-off import: copies the cases, colour themes and awards from the site's
  src/content/cms-content.json into the studio's dataset, with their pictures.

  Run from the studio folder:  npm run import
  (uses your Sanity login; `npm run import:force` overwrites cases that exist)

  The text sections are HTML in the JSON. They become Sanity text blocks here,
  and the site's sync script turns them back into the same HTML.
*/
import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { JSDOM } from "jsdom";

const client = getCliClient({ apiVersion: "2025-01-01" });
const SITE = path.resolve(process.cwd(), "..");
const force = process.argv.includes("--force") || process.env.FORCE === "1";

type Media = { url?: string; title?: string; subline?: string };
type Video = { url: string; poster?: string };
type Case = Record<string, unknown> & {
  slug: string;
  color: { slug: string } | null;
  awards: { slug: string }[];
  useVisual: boolean[];
  gallery1: string[];
  gallery2: string[];
  audioPlayer1: Media;
  audioPlayer2: Media;
  videoFiles?: Video[];
  videoUnderQuote?: Video;
};
type Cms = {
  caseStudies: Case[];
  colors: { name: string; slug: string; main: string; secondary: string }[];
  awards: { name: string; slug: string; image: string }[];
  casesSettings?: { pinned: string; featured: string[] };
};

const cms: Cms = JSON.parse(fs.readFileSync(path.join(SITE, "src/content/cms-content.json"), "utf8"));
const pinned = cms.casesSettings?.pinned;
const featured = cms.casesSettings?.featured ?? [];

let keyCount = 0;
const key = () => `k${(keyCount++).toString(36)}`;
const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key() });
const ref1 = (id: string) => ({ _type: "reference", _ref: id });

// Pictures: upload each site file once; the same path reuses the same asset.
const uploaded = new Map<string, string>();
async function asset(sitePath: string): Promise<string | null> {
  if (!sitePath) return null;
  if (uploaded.has(sitePath)) return uploaded.get(sitePath)!;
  const file = path.join(SITE, "public", decodeURIComponent(sitePath));
  if (!fs.existsSync(file)) {
    console.warn(`  missing picture ${sitePath}, skipped`);
    return null;
  }
  const doc = await client.assets.upload("image", fs.createReadStream(file), { filename: path.basename(file) });
  uploaded.set(sitePath, doc._id);
  return doc._id;
}
async function image(sitePath: string) {
  const id = await asset(sitePath);
  return id ? { _type: "image", asset: ref1(id) } : undefined;
}
async function images(paths: string[]) {
  const out = [];
  for (const p of paths) {
    const id = await asset(p);
    if (id) out.push({ _type: "image", _key: key(), asset: ref1(id) });
  }
  return out;
}

// "<ul><li>A</li><li>B</li></ul>" → ["A", "B"]
function list(html: unknown): string[] {
  if (!html) return [];
  const doc = new JSDOM(String(html)).window.document;
  return [...doc.querySelectorAll("li")].map((li) => li.textContent!.trim()).filter(Boolean);
}

// HTML text section → Sanity text blocks (paragraphs, h2, bold, links, pictures).
type Span = { _type: "span"; _key: string; text: string; marks: string[] };
async function blocks(html: unknown) {
  if (!html) return undefined;
  const doc = new JSDOM(String(html)).window.document;
  const out: unknown[] = [];
  for (const el of [...doc.body.children]) {
    const tag = el.tagName.toLowerCase();
    if (tag === "figure" || tag === "img") {
      const img = tag === "img" ? el : el.querySelector("img");
      const id = await asset(img?.getAttribute("src") ?? "");
      const alt = img?.getAttribute("alt") ?? "";
      if (id) out.push({ _type: "image", _key: key(), asset: ref1(id), ...(alt && !alt.startsWith("__wf") ? { alt } : {}) });
      continue;
    }
    const children: Span[] = [];
    const markDefs: { _type: "link"; _key: string; href: string }[] = [];
    const walk = (node: Node, marks: string[]) => {
      if (node.nodeType === 3) {
        children.push({ _type: "span", _key: key(), text: node.textContent ?? "", marks });
        return;
      }
      if (node.nodeType !== 1) return;
      const e = node as Element;
      const t = e.tagName.toLowerCase();
      if (t === "br") {
        children.push({ _type: "span", _key: key(), text: "\n", marks });
        return;
      }
      let next = marks;
      if (t === "strong" || t === "b") next = [...marks, "strong"];
      if (t === "a") {
        const k = key();
        markDefs.push({ _type: "link", _key: k, href: e.getAttribute("href") ?? "" });
        next = [...marks, k];
      }
      e.childNodes.forEach((c) => walk(c, next));
    };
    el.childNodes.forEach((c) => walk(c, []));
    // Join neighbouring spans with the same marks.
    const merged: Span[] = [];
    for (const s of children) {
      const last = merged[merged.length - 1];
      if (last && last.marks.join() === s.marks.join()) last.text += s.text;
      else merged.push(s);
    }
    out.push({
      _type: "block",
      _key: key(),
      style: tag === "h2" ? "h2" : "normal",
      markDefs,
      children: merged.length ? merged : [{ _type: "span", _key: key(), text: "", marks: [] }],
    });
  }
  return out;
}

const video = (v: Video) => ({ _type: "videoFile", url: v.url, poster: v.poster ?? "" });

const player = (m: Media) => ({
  _type: "object",
  title: m?.title ?? "",
  subline: m?.subline ?? "",
  url: m?.url ?? "",
});

async function main() {
  const existing: number = await client.fetch(`count(*[_type == "caseStudy"])`);
  if (existing && !force) {
    console.log(`The dataset already has ${existing} cases. Nothing imported. Run "npm run import:force" to overwrite them.`);
    return;
  }
  console.log(`Importing into ${client.config().projectId} / ${client.config().dataset}`);

  const tx = client.transaction();
  // Colour themes in their current order, plus any a case uses that the list lacks.
  const colors: (Cms["colors"][number] & { photoMatch?: boolean })[] = [...cms.colors];
  for (const c of cms.caseStudies) {
    if (c.color && !colors.some((t) => t.slug === c.color!.slug)) {
      const { slug, main, secondary } = c.color as { slug: string; main: string; secondary: string };
      const name = slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" + ");
      colors.push({ name, slug, main, secondary, photoMatch: false });
    }
  }
  colors.forEach((c, i) => {
    tx.createOrReplace({ _id: `color-${c.slug}`, _type: "colorTheme", sortOrder: i, name: c.name, slug: { _type: "slug", current: c.slug }, main: c.main, secondary: c.secondary, photoMatch: c.photoMatch ?? true });
  });
  for (const [i, a] of cms.awards.entries()) {
    tx.createOrReplace({ _id: `award-${a.slug}`, _type: "award", sortOrder: i, name: a.name, slug: { _type: "slug", current: a.slug }, image: await image(a.image) });
  }

  for (const c of cms.caseStudies) {
    console.log(`  ${c.internalName}`);
    const visual = c.useVisual.indexOf(true);
    tx.createOrReplace({
      _id: `case-${c.slug}`,
      _type: "caseStudy",
      internalName: c.internalName,
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      position: c.position,
      showOnHomepage: c.showOnHomepage,
      teaserClient: c.teaserClient ?? "",
      teaserCampaign: c.teaserCampaign ?? "",
      thumbnail: await image(c.thumbnail as string),
      thumbnailPosition: c.thumbnailPosition ?? "",
      previewUrl: c.previewUrl ?? "",
      clients: list(c.clientListHtml),
      whatWeDid: list(c.whatWeDidHtml),
      collaborators: list(c.collaboratorsHtml),
      awards: c.awards.map((a) => ref(`award-${a.slug}`)),
      introText: await blocks(c.introTextHtml),
      quote: c.quote ?? "",
      quoteName: c.quoteName ?? "",
      quoteImage: await image(c.quoteImage as string),
      textAfterGallery: await blocks(c.textAfterGalleryHtml),
      textAfterAudioPlayer: await blocks(c.textAfterAudioPlayerHtml),
      aiDraftCopy: Boolean(c.aiDraftCopy),
      nextCaseStudy: c.nextCaseStudySlug ? ref1(`case-${c.nextCaseStudySlug}`) : undefined,
      videoUnderQuote: c.videoUnderQuote ? video(c.videoUnderQuote) : undefined,
      gallery1: await images(c.gallery1),
      loopUrl: c.loopUrl ?? "",
      gifVideoHashtags: c.gifVideoHashtags ?? "",
      audioPlayer1: player(c.audioPlayer1),
      audioPlayer2: player(c.audioPlayer2),
      videoFiles: (c.videoFiles ?? []).map((v) => ({ ...video(v), _key: key() })),
      gallery2: await images(c.gallery2),
      color: c.color ? ref1(`color-${c.color.slug}`) : undefined,
      visual: visual >= 0 ? visual + 1 : 1,
      visualizationJson: c.visualizationJson ?? "",
    });
  }

  tx.createOrReplace({
    _id: "casesSettings",
    _type: "casesSettings",
    pinnedCase: pinned ? ref1(`case-${pinned}`) : undefined,
    featuredCases: featured.map((s) => ref(`case-${s}`)),
  });

  await tx.commit({ visibility: "async" });
  console.log(`Done: ${cms.caseStudies.length} cases, ${colors.length} colour themes, ${cms.awards.length} awards, ${uploaded.size} pictures.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
