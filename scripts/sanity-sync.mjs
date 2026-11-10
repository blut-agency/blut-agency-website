/*
  Sanity → site. Runs before every build (`npm run build`) and on demand
  (`npm run sanity:sync`).

  It reads the published content from Sanity, writes it into
  src/content/cms-content.json in the shape the pages already read, and saves
  every picture into public/images/cms/. The site then serves all text and
  pictures itself: visitors never load anything from Sanity (GDPR).

  Without SANITY_PROJECT_ID it does nothing and the build uses the JSON in the
  repo. If Sanity answers with no cases, it stops and keeps the JSON as it is,
  so an empty or broken dataset never wipes the site.
*/
import fs from "node:fs";
import path from "node:path";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "site";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const JSON_FILE = path.join(ROOT, "src/content/cms-content.json");
const PAGES_FILE = path.join(ROOT, "src/content/pages.json");
const SITE_FILE = path.join(ROOT, "src/content/site.json");
const TEAM_FILE = path.join(ROOT, "src/content/team.json");
/** The page documents (one each, id = type name), as in the studio's PAGE_TYPES. */
const PAGE_IDS = ["homePage", "productionPage", "strategyPage", "postPage", "casesPage", "aboutPage", "imprintPage", "privacyPage", "siteSettings"];
const IMAGE_DIR = path.join(ROOT, "public/images/cms");
const IMAGE_URL = "/images/cms";

if (!projectId) {
  console.log("sanity-sync: no SANITY_PROJECT_ID, using the content in the repo.");
  process.exit(0);
}

const img = `{ "url": asset->url, "name": asset->originalFilename, "id": asset->_id, "size": asset->size }`;
const QUERY = `{
  "cases": *[_type == "caseStudy" && defined(slug.current)] | order(position asc) {
    ..., "slug": slug.current,
    "thumbnail": thumbnail${img}, "quoteImage": quoteImage${img},
    "gallery1": gallery1[]${img}, "gallery2": gallery2[]${img},
    "color": color->{ "slug": slug.current, main, secondary },
    "awards": awards[]->{ name, "slug": slug.current, "image": image${img} },
    "nextCaseStudySlug": nextCaseStudy->slug.current,
    "introText": introText[]{ ..., _type == "image" => ${img} },
    "textAfterGallery": textAfterGallery[]{ ..., _type == "image" => ${img} },
    "textAfterAudioPlayer": textAfterAudioPlayer[]{ ..., _type == "image" => ${img} }
  },
  "colors": *[_type == "colorTheme" && photoMatch != false] | order(coalesce(sortOrder, 999) asc, name asc) { name, "slug": slug.current, main, secondary },
  "awards": *[_type == "award"] | order(coalesce(sortOrder, 999) asc, name asc) { name, "slug": slug.current, "image": image${img} },
  "settings": *[_id == "casesSettings"][0]{ "pinned": pinnedCase->slug.current, "featured": featuredCases[]->slug.current },
  "pages": *[_id in ${JSON.stringify(PAGE_IDS)}],
  "team": *[_type == "teamMember"] | order(coalesce(sortOrder, 999) asc, name asc),
  "caseSlugs": *[_type == "caseStudy"]{ _id, "slug": slug.current }
}`;

async function query(q = QUERY) {
  const url = `https://${projectId}.apicdn.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent(q)}&perspective=published`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity answered ${res.status}: ${await res.text()}`);
  return (await res.json()).result;
}

// ---- Pictures -------------------------------------------------------------

/** Pictures to download: Sanity asset id → { url, file name on the site }. */
const downloads = new Map();
const usedNames = new Map();

/** Big photos are shrunk to 2400px WebP; small files and SVGs stay as uploaded. */
function picture(image) {
  if (!image?.url) return "";
  if (downloads.has(image.id)) return `${IMAGE_URL}/${downloads.get(image.id).name}`;
  const original = (image.name || path.basename(image.url)).replace(/[^\w.\-]+/g, "-");
  const ext = path.extname(original).toLowerCase();
  const shrink = image.size > 800_000 && [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  let name = shrink ? original.slice(0, -ext.length) + ".webp" : original;
  // Two different pictures with the same file name: the second gets its id.
  if (usedNames.has(name) && usedNames.get(name) !== image.id) {
    name = name.replace(/(\.\w+)$/, `-${image.id.split("-")[1].slice(0, 8)}$1`);
  }
  usedNames.set(name, image.id);
  downloads.set(image.id, { url: shrink ? `${image.url}?w=2400&fit=max&fm=webp&q=85` : image.url, name });
  return `${IMAGE_URL}/${name}`;
}

async function downloadAll() {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
  const jobs = [...downloads.values()];
  for (let i = 0; i < jobs.length; i += 8) {
    await Promise.all(
      jobs.slice(i, i + 8).map(async ({ url, name }) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Picture ${name} failed: ${res.status}`);
        fs.writeFileSync(path.join(IMAGE_DIR, name), Buffer.from(await res.arrayBuffer()));
      }),
    );
  }
  return jobs.length;
}

// ---- Text -----------------------------------------------------------------

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s) => esc(s).replace(/"/g, "&quot;");

/** ["A", "B"] → "<ul><li>A</li><li>B</li></ul>"; an empty list → "". */
const list = (items) => (items?.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "");

/** One text block's words with bold, italics and links. */
function inline(b) {
  const links = Object.fromEntries((b.markDefs ?? []).map((m) => [m._key, m]));
  return (b.children ?? [])
    .map((s) => {
      let t = esc(s.text).replace(/\n/g, "<br>");
      const marks = s.marks ?? [];
      if (marks.includes("em")) t = `<em>${t}</em>`;
      if (marks.includes("strong")) t = `<strong>${t}</strong>`;
      // Links wrap the bold, as in the original Webflow HTML.
      for (const m of marks) {
        if (links[m]?.href) {
          const href = links[m].href;
          const external = /^https?:/.test(href);
          t = `<a href="${attr(href)}"${external ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`;
        }
      }
      return t;
    })
    .join("");
}

/** Sanity text blocks → the HTML the pages render (paragraphs, h1–h4, bullet lists, pictures). */
function html(blocks) {
  if (!blocks?.length) return "";
  let out = "";
  let inList = false;
  for (const b of blocks) {
    const isItem = b._type === "block" && b.listItem;
    if (inList && !isItem) {
      out += "</ul>";
      inList = false;
    }
    if (b._type === "image") {
      const src = picture(b);
      if (src) out += `<figure class="w-richtext-figure-type-image w-richtext-align-fullwidth" data-rt-type="image" data-rt-align="fullwidth"><div><img src="${attr(src)}" alt="${attr(b.alt ?? "")}" loading="lazy"></div></figure>`;
      continue;
    }
    if (b._type !== "block") continue;
    if (isItem) {
      if (!inList) out += "<ul>";
      inList = true;
      out += `<li>${inline(b)}</li>`;
      continue;
    }
    const tag = /^h[1-4]$/.test(b.style) ? b.style : "p";
    out += `<${tag}>${inline(b)}</${tag}>`;
  }
  if (inList) out += "</ul>";
  return out;
}

const media = (m) => {
  const out = { title: m?.title ?? "", subline: m?.subline ?? "" };
  if (m?.url) out.url = m.url;
  return out;
};

// ---- Main -----------------------------------------------------------------

const data = await query();
if (!data?.cases?.length) {
  console.error(`sanity-sync: Sanity (${projectId}/${dataset}) has no published cases. Keeping the content in the repo.`);
  process.exit(0);
}

const featured = data.settings?.featured?.filter(Boolean) ?? [];
const caseStudies = data.cases.map((c) => {
  const out = {
    slug: c.slug,
    internalName: c.internalName ?? "",
    title: c.title ?? "",
    position: c.position ?? 99,
    showOnHomepage: featured.includes(c.slug),
    clientListHtml: list(c.clients),
    whatWeDidHtml: list(c.whatWeDid),
    collaboratorsHtml: list(c.collaborators),
    color: c.color ?? null,
    // The site picks this case's colour from its photo (scripts/case-colours.mjs).
    colorFromPhoto: c.colorFromPhoto === true,
    useVisual: [1, 2, 3, 4].map((n) => n === (c.visual ?? 1)),
    visualizationJson: c.visualizationJson ?? "",
    quoteImage: picture(c.quoteImage),
    quote: c.quote ?? "",
    quoteName: c.quoteName ?? "",
    introTextHtml: html(c.introText),
    gallery1: (c.gallery1 ?? []).map(picture).filter(Boolean),
    textAfterGalleryHtml: html(c.textAfterGallery),
    gifVideoHashtags: c.gifVideoHashtags ?? "",
    audioPlayer1: media(c.audioPlayer1),
    audioPlayer2: media(c.audioPlayer2),
    textAfterAudioPlayerHtml: html(c.textAfterAudioPlayer),
    gallery2: (c.gallery2 ?? []).map(picture).filter(Boolean),
    awards: (c.awards ?? []).filter(Boolean).map((a) => ({ name: a.name, slug: a.slug, image: picture(a.image) })),
    nextCaseStudySlug: c.nextCaseStudySlug ?? "",
    teaserClient: c.teaserClient ?? "",
    teaserCampaign: c.teaserCampaign ?? "",
    thumbnail: picture(c.thumbnail),
  };
  if (c.videoFiles?.length) out.videoFiles = c.videoFiles.map((v) => ({ url: v.url, poster: v.poster ?? "" }));
  if (c.aiDraftCopy) out.aiDraftCopy = true;
  if (c.previewUrl) out.previewUrl = c.previewUrl;
  if (c.videoUnderQuote?.url) out.videoUnderQuote = { url: c.videoUnderQuote.url, poster: c.videoUnderQuote.poster ?? "" };
  if (c.loopUrl) out.loopUrl = c.loopUrl;
  if (c.thumbnailPosition) out.thumbnailPosition = c.thumbnailPosition;
  return out;
});

// ---- Pages, team, menu and footer ------------------------------------------

/** Every picture the pages and team use, by asset id. */
const assetIds = new Set();
const findAssets = (v) => {
  if (Array.isArray(v)) v.forEach(findAssets);
  else if (v && typeof v === "object") {
    if (v._type === "image" && v.asset?._ref) assetIds.add(v.asset._ref);
    Object.values(v).forEach(findAssets);
  }
};
findAssets([data.pages, data.team, data.cases.map((c) => c.sections)]);
const assets = assetIds.size
  ? Object.fromEntries(
      (await query(`*[_type == "sanity.imageAsset" && _id in ${JSON.stringify([...assetIds])}]{ "url": url, "name": originalFilename, "id": _id, "size": size }`)).map((a) => [a.id, a]),
    )
  : {};
const caseSlug = Object.fromEntries(data.caseSlugs.map((c) => [c._id, c.slug]));
const isText = (v) => Array.isArray(v) && v.length > 0 && v.every((b) => b?._type === "block" || b?._type === "image") && v.some((b) => b._type === "block");

/** A Sanity value → the site's JSON: pictures become paths, text blocks HTML, case links slugs. */
function plain(v) {
  if (Array.isArray(v)) return isText(v) ? html(v.map((b) => (b._type === "image" ? { ...b, ...assets[b.asset?._ref] } : b))) : v.map(plain);
  if (!v || typeof v !== "object") return v;
  if (v._type === "image") return v.asset?._ref ? picture(assets[v.asset._ref]) : "";
  if (v._type === "reference") return caseSlug[v._ref] ?? "";
  if (v._type === "slug") return v.current;
  const out = {};
  for (const [k, val] of Object.entries(v)) if (!k.startsWith("_")) out[k] = plain(val);
  return out;
}

// The case builder's sections, in page order, each with its type.
data.cases.forEach((c, i) => {
  if (Array.isArray(c.sections)) caseStudies[i].sections = c.sections.map((s) => ({ type: s._type, ...plain(s) }));
});

const pagesJson = JSON.parse(fs.readFileSync(PAGES_FILE, "utf8"));
let siteJson = JSON.parse(fs.readFileSync(SITE_FILE, "utf8"));
for (const doc of data.pages) {
  if (doc._id === "siteSettings") siteJson = plain(doc);
  else pagesJson[doc._id] = plain(doc);
}
const teamJson = data.team.length
  ? { members: data.team.map((m) => { const { sortOrder: _order, ...rest } = plain(m); return rest; }) }
  : JSON.parse(fs.readFileSync(TEAM_FILE, "utf8"));

const current = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
const next = {
  ...current,
  caseStudies,
  colors: data.colors,
  awards: data.awards.map((a) => ({ name: a.name, slug: a.slug, image: picture(a.image) })),
  casesSettings: { pinned: data.settings?.pinned ?? "", featured },
};
const count = await downloadAll();
fs.writeFileSync(JSON_FILE, JSON.stringify(next, null, 2) + "\n");
fs.writeFileSync(PAGES_FILE, JSON.stringify(pagesJson, null, 2) + "\n");
fs.writeFileSync(SITE_FILE, JSON.stringify(siteJson, null, 2) + "\n");
fs.writeFileSync(TEAM_FILE, JSON.stringify(teamJson, null, 2) + "\n");
console.log(`sanity-sync: ${data.pages.length} pages, ${teamJson.members.length} team members, ${caseStudies.length} cases, ${data.colors.length} colour themes, ${data.awards.length} awards, ${count} pictures from ${projectId}/${dataset}.`);
