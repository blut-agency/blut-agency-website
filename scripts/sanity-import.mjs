/*
  One-off import: copies the cases, colour themes and awards from
  src/content/cms-content.json into Sanity, and uploads their images.

    npm run sanity:import                 # stops if Sanity already has cases
    npm run sanity:import -- --force      # overwrites them (loses studio edits!)
    node scripts/sanity-import.mjs --dry-run  # only writes the documents to a file

  npm run sanity:import runs this through `sanity exec --with-user-token`,
  so it writes as whoever is logged in with `npx sanity login`. No token
  needed. Run directly with node, it needs NEXT_PUBLIC_SANITY_PROJECT_ID and
  SANITY_WRITE_TOKEN (sanity.io/manage → API → Tokens, Editor rights).
*/
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";
import { JSDOM } from "jsdom";

const root = import.meta.dirname ? path.resolve(import.meta.dirname, "..") : process.cwd();
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const apiVersion = "2026-11-01";

async function makeClient() {
  if (dryRun) return null;
  if (token && projectId) return createClient({ projectId, dataset, token, apiVersion, useCdn: false });
  try {
    // Inside `sanity exec --with-user-token`: the logged-in user's client.
    const { getCliClient } = await import("sanity/cli");
    return getCliClient({ apiVersion }).withConfig({ useCdn: false });
  } catch {
    console.error("Run `npm run sanity:import` after `npx sanity login`, or set SANITY_WRITE_TOKEN.");
    process.exit(1);
  }
}
const client = await makeClient();

const cms = JSON.parse(fs.readFileSync(path.join(root, "src/content/cms-content.json"), "utf8"));
const offers = fs.readFileSync(path.join(root, "src/content/offers.ts"), "utf8");
const pinned = offers.match(/PINNED_CASE = "([^"]+)"/)?.[1];
const featured = [...(offers.match(/FEATURED_CASES = \[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);
const ref = (id) => ({ _type: "reference", _ref: id, _key: key() });

/* Images: each file is uploaded once, then reused. */
const uploads = new Map();
async function image(src, { inArray = false } = {}) {
  if (!src) return undefined;
  if (!uploads.has(src)) {
    uploads.set(
      src,
      (async () => {
        let body;
        if (/^https?:\/\//.test(src)) {
          const res = await fetch(src);
          if (!res.ok) throw new Error(`${res.status} ${src}`);
          body = Buffer.from(await res.arrayBuffer());
        } else {
          const file = path.join(root, "public", decodeURI(src));
          if (!fs.existsSync(file)) throw new Error(`missing file public${src}`);
          if (dryRun) return `image-dry-run-${src}`;
          body = fs.readFileSync(file);
        }
        const asset = await client.assets.upload("image", body, { filename: path.basename(src.split("?")[0]) });
        console.log(`  uploaded ${src}`);
        return asset._id;
      })().catch((err) => {
        console.warn(`  ! skipped image: ${err.message}`);
        return null;
      }),
    );
  }
  const id = await uploads.get(src);
  if (!id) return undefined;
  return { _type: "image", asset: { _type: "reference", _ref: id }, ...(inArray ? { _key: key() } : {}) };
}

const images = async (list) => (await Promise.all((list ?? []).map((src) => image(src, { inArray: true })))).filter(Boolean);

/* "<ul><li>A</li><li>B</li></ul>" → ["A", "B"] */
function listItems(html) {
  if (!html) return [];
  const doc = new JSDOM(`<body>${html}</body>`).window.document;
  return [...doc.querySelectorAll("li")].map((li) => li.textContent.replace(/ /g, " ").trim()).filter(Boolean);
}

/* Webflow rich text (h2, p, strong, a, br, figure) → Portable Text. */
async function richText(html) {
  if (!html) return [];
  const doc = new JSDOM(`<body>${html}</body>`).window.document;
  const blocks = [];
  for (const node of doc.body.childNodes) {
    if (node.nodeType === 3) {
      if (node.textContent.trim()) blocks.push(block("normal", [{ text: node.textContent, marks: [] }], []));
      continue;
    }
    if (node.nodeType !== 1) continue;
    const img = node.tagName === "IMG" ? node : node.querySelector("img");
    if (img && !node.textContent.trim()) {
      const pic = await image(img.getAttribute("src"), { inArray: true });
      if (pic) blocks.push(pic);
      continue;
    }
    const markDefs = [];
    const spans = [];
    const walk = (n, marks) => {
      if (n.nodeType === 3) return spans.push({ text: n.textContent, marks });
      if (n.nodeType !== 1) return;
      const tag = n.tagName;
      if (tag === "BR") return spans.push({ text: "\n", marks });
      let next = marks;
      if (tag === "STRONG" || tag === "B") next = [...marks, "strong"];
      if (tag === "A" && n.getAttribute("href")) {
        const k = key();
        markDefs.push({ _key: k, _type: "link", href: n.getAttribute("href") });
        next = [...marks, k];
      }
      n.childNodes.forEach((c) => walk(c, next));
    };
    node.childNodes.forEach((c) => walk(c, []));
    blocks.push(block(node.tagName === "H2" ? "h2" : "normal", spans, markDefs));
  }
  return blocks;
}

function block(style, spans, markDefs) {
  const children = (spans.length ? spans : [{ text: "", marks: [] }]).map((s) => ({ _type: "span", _key: key(), text: s.text, marks: s.marks }));
  return { _type: "block", _key: key(), style, markDefs, children };
}

const player = (p) => (p && (p.vimeoId || p.url || p.title) ? { vimeoId: p.vimeoId || undefined, url: p.url || undefined, title: p.title || undefined, subline: p.subline || undefined } : undefined);

async function main() {
  const existing = dryRun ? 0 : await client.fetch(`count(*[_type == "caseStudy"])`);
  if (existing && !force) {
    console.error(`Sanity already has ${existing} cases. Run with --force to overwrite them (studio edits are lost).`);
    process.exit(1);
  }

  const docs = [];
  console.log("Colour themes");
  // The listed themes, then any a case carries that the list lacks (e.g. blue-red).
  const colors = [...cms.colors];
  for (const c of cms.caseStudies) {
    if (c.color && !colors.some((t) => t.slug === c.color.slug)) {
      const name = c.color.slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" + ");
      colors.push({ ...c.color, name });
    }
  }
  colors.forEach((c, i) => {
    docs.push({ _id: `colorTheme-${c.slug}`, _type: "colorTheme", name: c.name, slug: { _type: "slug", current: c.slug }, main: c.main, secondary: c.secondary, order: i + 1 });
  });
  console.log("Awards");
  for (const a of cms.awards) {
    docs.push({ _id: `award-${a.slug}`, _type: "award", name: a.name, slug: { _type: "slug", current: a.slug }, image: await image(a.image) });
  }
  console.log("Cases");
  const caseId = (slug) => `caseStudy-${slug}`;
  const slugs = new Set(cms.caseStudies.map((c) => c.slug));
  for (const c of cms.caseStudies) {
    console.log(`- ${c.internalName}`);
    docs.push({
      _id: caseId(c.slug),
      _type: "caseStudy",
      internalName: c.internalName,
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      position: Number(c.position),
      showOnHomepage: Boolean(c.showOnHomepage),
      teaserClient: c.teaserClient || undefined,
      teaserCampaign: c.teaserCampaign || undefined,
      thumbnail: await image(c.thumbnail),
      thumbnailPosition: c.thumbnailPosition || undefined,
      previewVimeoId: c.previewVimeoId || undefined,
      previewUrl: c.previewUrl || undefined,
      clients: listItems(c.clientListHtml),
      whatWeDid: listItems(c.whatWeDidHtml),
      collaborators: listItems(c.collaboratorsHtml),
      awards: (c.awards ?? []).map((a) => ref(`award-${a.slug}`)),
      introText: await richText(c.introTextHtml),
      quote: c.quote || undefined,
      quoteName: c.quoteName || undefined,
      quoteImage: await image(c.quoteImage),
      textAfterGallery: await richText(c.textAfterGalleryHtml),
      textAfterAudioPlayer: await richText(c.textAfterAudioPlayerHtml),
      aiDraftCopy: Boolean(c.aiDraftCopy),
      nextCaseStudy: slugs.has(c.nextCaseStudySlug) ? { _type: "reference", _ref: caseId(c.nextCaseStudySlug) } : undefined,
      videoUnderQuoteVimeoId: c.videoUnderQuoteVimeoId || undefined,
      gallery1: await images(c.gallery1),
      gifVideoVimeoId: c.gifVideoVimeoId || undefined,
      gifVideoHashtags: c.gifVideoHashtags || undefined,
      audioPlayer1: player(c.audioPlayer1),
      audioPlayer2: player(c.audioPlayer2),
      video1VimeoId: c.video1VimeoId || undefined,
      video2VimeoId: c.video2VimeoId || undefined,
      video3VimeoId: c.video3VimeoId || undefined,
      videoFiles: (c.videoFiles ?? []).map((v) => ({ _key: key(), url: v.url, poster: v.poster || undefined })),
      gallery2: await images(c.gallery2),
      color: c.color ? { _type: "reference", _ref: `colorTheme-${c.color.slug}` } : undefined,
      visual: Math.max(0, (c.useVisual ?? []).findIndex(Boolean)) + 1,
      visualizationJson: c.visualizationJson || undefined,
    });
  }
  docs.push({
    _id: "casesPage",
    _type: "casesPage",
    pinnedCase: pinned && slugs.has(pinned) ? { _type: "reference", _ref: caseId(pinned) } : undefined,
    featuredCases: featured.filter((s) => slugs.has(s)).map((s) => ref(caseId(s))),
  });

  if (dryRun) {
    const out = path.join(root, ".sanity-import-dry-run.json");
    fs.writeFileSync(out, JSON.stringify(docs, null, 2));
    console.log(`Dry run: ${docs.length} documents written to ${out}. Nothing was uploaded.`);
    return;
  }
  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(JSON.parse(JSON.stringify(doc)));
  await tx.commit();
  console.log(`Done: ${docs.length} documents, ${uploads.size} images.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
