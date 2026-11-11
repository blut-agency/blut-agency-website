/*
  One-off import: copies the cases, colour themes and awards from the site's
  src/content/cms-content.json into the studio's dataset, with their pictures.

  Run from the studio folder:  npm run import
  (uses your Sanity login; `npm run import:force` overwrites cases that exist;
  `npm run import:sections` only adds page sections to cases that have none)

  The text sections are HTML in the JSON. They become Sanity text blocks here,
  and the site's sync script turns them back into the same HTML.
*/
import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { JSDOM } from "jsdom";
import { PAGE_TYPES, schemaTypes } from "../schemaTypes";
import { legacySections, type CaseSection, type LegacyCase } from "../../src/lib/caseSections";

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
/** Cases the site hides (published: false) come in as drafts only: unpublished in Sanity. */
const hidden = new Set(cms.caseStudies.filter((c) => c.published === false).map((c) => c.slug));
const caseRef = (slug: string) => ({ ...ref1(`case-${slug}`), ...(hidden.has(slug) ? { _weak: true } : {}) });

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
/** One paragraph, heading or list item → a Sanity text block with bold, italic and links. */
function textBlock(el: Element, style: string, extra: Record<string, unknown> = {}) {
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
    if (t === "em" || t === "i") next = [...marks, "em"];
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
  return {
    _type: "block",
    _key: key(),
    style,
    ...extra,
    markDefs,
    children: merged.length ? merged : [{ _type: "span", _key: key(), text: "", marks: [] }],
  };
}

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
    if (tag === "ul" || tag === "ol") {
      for (const li of [...el.children]) out.push(textBlock(li, "normal", { listItem: "bullet", level: 1 }));
      continue;
    }
    out.push(textBlock(el, /^h[1-4]$/.test(tag) ? tag : "normal"));
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

/** The case builder's sections (from the old fixed fields) → Sanity objects. */
async function sanitySections(list: CaseSection[]) {
  const out: Record<string, unknown>[] = [];
  for (const s of list) {
    const base = { _type: s.type, _key: key() };
    switch (s.type) {
      case "caseChapter":
        out.push({ ...base, stage: s.stage, line: s.line || undefined, body: await blocks(s.body), cta: Boolean(s.cta) });
        break;
      case "caseQuote":
        out.push({ ...base, quote: s.quote, name: s.name ?? "", photo: await image(s.photo ?? "") });
        break;
      case "caseVideos":
        out.push({ ...base, videos: s.videos.map((v) => ({ ...video(v), ...(v.label ? { label: v.label } : {}), _key: key() })) });
        break;
      case "caseGallery":
        out.push({ ...base, images: await images(s.images) });
        break;
      case "caseLoop":
        out.push({ ...base, url: s.url, hashtags: s.hashtags ?? "" });
        break;
      case "caseAudio":
        out.push({ ...base, title: s.title ?? "", subline: s.subline ?? "", url: s.url });
        break;
      case "caseAwards":
        out.push({ ...base, heading: s.heading ?? "Awarded at" });
        break;
    }
  }
  return out;
}

// ---- Pages, team, menu and footer: converted field by field from the schema ----

type Def = { name?: string; type: string; fields?: Def[]; of?: Def[]; to?: { type: string }[] };
const NAMED = new Map<string, Def>(schemaTypes.map((t) => [t.name, t as unknown as Def]));
const TEXT_TYPES = new Set(["richText", "legalText"]);

/** A site value (from the JSON files) → the Sanity value for a field of this type. */
async function toSanity(value: unknown, def: Def): Promise<unknown> {
  if (value === undefined || value === null || value === "") return undefined;
  if (TEXT_TYPES.has(def.type)) return blocks(value);
  const named = NAMED.get(def.type);
  if (named && def.type !== def.name) return toSanity(value, { ...named, name: def.type });
  switch (def.type) {
    case "image":
      return image(String(value));
    case "reference":
      // References in the JSON are case slugs or team member code names.
      return ref1(def.to?.[0]?.type === "teamMember" ? `team-${value}` : `case-${value}`);
    case "object":
    case "document": {
      const out: Record<string, unknown> = {};
      const v = value as Record<string, unknown>;
      for (const f of def.fields ?? []) {
        const converted = await toSanity(v[f.name!], f);
        if (converted !== undefined) out[f.name!] = converted;
      }
      return out;
    }
    case "array": {
      const member = def.of?.[0];
      if (!member) return value;
      const items = [];
      for (const item of value as unknown[]) {
        const converted = await toSanity(item, member);
        if (converted === undefined) continue;
        if (typeof converted === "object") {
          const typeName = NAMED.has(member.type) ? member.type : member.name ?? member.type;
          items.push({ _key: key(), ...(member.type === "reference" ? {} : { _type: typeName }), ...(converted as object) });
        } else items.push(converted);
      }
      return items;
    }
    default:
      return value;
  }
}

async function importPages(tx: ReturnType<typeof client.transaction>) {
  const pages = JSON.parse(fs.readFileSync(path.join(SITE, "src/content/pages.json"), "utf8"));
  pages.siteSettings = JSON.parse(fs.readFileSync(path.join(SITE, "src/content/site.json"), "utf8"));
  let count = 0;
  for (const type of PAGE_TYPES) {
    if (!pages[type.name]) continue;
    const doc = (await toSanity(pages[type.name], type as unknown as Def)) as Record<string, unknown>;
    tx.createOrReplace({ ...doc, _id: type.name, _type: type.name });
    count++;
  }
  const team = JSON.parse(fs.readFileSync(path.join(SITE, "src/content/team.json"), "utf8")).members as Record<string, unknown>[];
  const memberType = NAMED.get("teamMember")!;
  for (const [i, m] of team.entries()) {
    const doc = (await toSanity({ ...m, sortOrder: i }, { ...memberType, type: "document" })) as Record<string, unknown>;
    tx.createOrReplace({ ...doc, _id: `team-${m.key}`, _type: "teamMember" });
  }
  return { pages: count, team: team.length };
}

async function main() {
  if (process.env.SECTIONS_ONLY === "1") {
    // Adds page sections to cases that have none yet; every other field stays as it is.
    const tx = client.transaction();
    let count = 0;
    for (const c of cms.caseStudies) {
      const id = `case-${c.slug}`;
      const has: boolean = await client.fetch(`defined(*[_id == $id][0].sections)`, { id });
      if (has) continue;
      tx.patch(id, { set: { sections: await sanitySections(legacySections(c as unknown as LegacyCase)) } });
      count++;
    }
    await tx.commit({ visibility: "async" });
    console.log(`Done: page sections added to ${count} cases, ${uploaded.size} pictures.`);
    return;
  }
  if (process.env.PAGES_ONLY === "1") {
    const tx = client.transaction();
    const extra = await importPages(tx);
    await tx.commit({ visibility: "async" });
    console.log(`Done: ${extra.pages} pages, ${extra.team} team members, ${uploaded.size} pictures. Cases left as they are.`);
    return;
  }
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
  // Colour themes from an older list stay (a case may still use one) but drop to the end and out of the photo match.
  const oldColors: string[] = await client.fetch(`*[_type == "colorTheme" && !(_id in $ids) && !(_id in path("drafts.**"))]._id`, { ids: colors.map((c) => `color-${c.slug}`) });
  oldColors.forEach((id, i) => tx.patch(id, { set: { photoMatch: false, sortOrder: 100 + i } }));
  for (const [i, a] of cms.awards.entries()) {
    tx.createOrReplace({ _id: `award-${a.slug}`, _type: "award", sortOrder: i, name: a.name, slug: { _type: "slug", current: a.slug }, image: await image(a.image) });
  }

  for (const c of cms.caseStudies) {
    console.log(`  ${c.internalName}${hidden.has(c.slug) ? " (draft, not on the site)" : ""}`);
    const visual = c.useVisual.indexOf(true);
    if (hidden.has(c.slug)) tx.delete(`case-${c.slug}`);
    tx.createOrReplace({
      _id: hidden.has(c.slug) ? `drafts.case-${c.slug}` : `case-${c.slug}`,
      _type: "caseStudy",
      internalName: c.internalName,
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      position: c.position,
      showOnHomepage: c.showOnHomepage,
      colorFromPhoto: c.colorFromPhoto === true,
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
      nextCaseStudy: c.nextCaseStudySlug ? caseRef(c.nextCaseStudySlug as string) : undefined,
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
      sections: await sanitySections(legacySections(c as unknown as LegacyCase)),
    });
  }

  tx.createOrReplace({
    _id: "casesSettings",
    _type: "casesSettings",
    pinnedCase: pinned ? ref1(`case-${pinned}`) : undefined,
    featuredCases: featured.map((s) => ref(`case-${s}`)),
  });

  const extra = await importPages(tx);

  await tx.commit({ visibility: "async" });
  console.log(`Done: ${extra.pages} pages, ${extra.team} team members, ${cms.caseStudies.length} cases, ${colors.length} colour themes, ${cms.awards.length} awards, ${uploaded.size} pictures.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
